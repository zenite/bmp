
function controller(base, form, program) {
    debugger;
    form.chooseProjectName = function (row) {
        debugger; if (row[0] != null) {
            form.pur11.projectName = row[0].text;
        }
    }
    form.chooseSupplierCode = function (row) {
        if (row[0] != null) {
            form.pur11.sourcingSupplierName = row[0].registeredSupplierName;
        }
        debugger;
    }
    form.delete = function () {
        var evens = _.remove(form.pur11p, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }
    form.add = function () {
        form.pur11p.push({});
    }
    form.$event_submit_before = function (context) {
        debugger;
        form.pur11.selectFormBelongsCompany = base.areaCode;
        return context.$continue();
    }
    form.$page_load = function () {
        debugger;
        form.pur11.applicatotr = base.applicant.userName;
        if (form.pur11p.length == 0) {
            form.pur11p.push({});
        }
    }
    form.$watch('base.areaCode', function () {
        debugger; if (base.areaCode == 'YFVSJ') {
            form.refreshApproval();
        }
    });
    debugger;
    form.refreshApproval = function () {
        debugger; form.pur11.mPLSupervisor = "UR0168M644";
        form.pur11.sPESupervisor = 'UR01510562';
        form.pur11.mPLManager = 'UR00000048';
        form.pur11.purchasingManager = 'UR0386JO77';
        debugger;
    }
    form.$doValidation = function () {
        if (form.pur11.projectCycl <= 0) {
            form.$errors.push({ element: $("[name=projectCycl]"), msg: "项目生命周期总用量必须大于0" });
        }
        if (form.pur11.projectlifecycle <= 0) {
            form.$errors.push({ element: $("[name=projectlifecycle]"), msg: "项目生命周期必须大于0" });
        }
    }
    form.selectAll = function (ischecked, items) {
        for (var i = 0; i < items.length; i++) items[i].checked = !!form.pur11pAllChecked;
    }

}
