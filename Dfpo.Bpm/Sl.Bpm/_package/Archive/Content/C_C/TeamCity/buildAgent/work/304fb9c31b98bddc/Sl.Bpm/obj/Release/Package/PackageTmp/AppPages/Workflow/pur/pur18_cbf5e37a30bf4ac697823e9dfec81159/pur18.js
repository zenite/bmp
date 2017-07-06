
function controller(base, form, program) {
    debugger;
    form.$page_load = function () {
        if (base.pageState == "1") {
            form.pur18.total = "0";
            form.pur18.baseTitle = base.title;
        }
        else {
            if (form.pur18.baseTitle != "" && form.pur18.baseTitle != null) {
                var companyName = program('GetCompanyName', { AreaCode: form.pur18.selectCompany, Language: app.language });
                base.title = companyName + base.title;
            }
        }
    }

    form.$watch('base.areaCode', function () {
        if (base.areaCode && base.pageState == "1") {
            form.pur18.selectCompany = base.areaCode;
            if (form.pur18.selectCompany === "YFVSJ") {
                form.pur18.category = null;
                form.pur18.program = null;
                form.pur18.programBuyer = null;
                form.pur18.companyArea = "SJ";
            }
            else {
                form.pur18.companyArea = "TC";
            }
        }
    })

    form.$event_submit_before = function (context) {
        if (form.pur18d.length === 0) {
            mabp.notify.warn("请填写明细数据");
            return false;
        }
        if (form.pur18.total > 2000) {
            mabp.notify.warn("总金额不能高于2000");
            return false;
        }
        return context.$continue();
    }

    //grid删除
    form.delete = function () {
        var evens = _.remove(form.pur18d, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        else {
            form.calculationTotal();
        }
    }

    form.chooseCategory = function (row) {
        if (!!row[0]) {
            if (row[0].value == 2) {
                form.pur18.programBuyer = null;
                form.pur18.program = null;
            }
            form.pur18.categoryId = row[0].id;
        }
    }

    form.calculationTotal = function () {
        var total = 0;
        for (i = 0; i < form.pur18d.length; i++) {
            var qtyToBeBought = 0;
            if (form.pur18d[i].qtyToBeBought != null)
                qtyToBeBought = form.pur18d[i].qtyToBeBought;

            var unitPrice = 0;
            if (form.pur18d[i].unitPrice != null)
                unitPrice = form.pur18d[i].unitPrice;

            total += qtyToBeBought * unitPrice;
        }
        form.pur18.total = total.toString();
    }

    form.chooseCostCenter = function (item, row) {
        if (row[0] != null) {
            //item.costCenter = row[0].text;
            item.expenseType = row[0].accountDesc;
        }
    }

    form.$watch('form.pur18.program', function (newV, oldV) {
        if (!form.pur18.program) {
            form.pur18.programBuyer = null;
        }
    });
}