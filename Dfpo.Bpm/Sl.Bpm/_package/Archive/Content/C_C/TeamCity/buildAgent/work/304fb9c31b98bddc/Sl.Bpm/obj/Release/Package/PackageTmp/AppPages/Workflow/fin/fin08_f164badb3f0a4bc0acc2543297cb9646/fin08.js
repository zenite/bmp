
function controller(base, form, program) {
    form.$page_load = function () {
        if (form.fin08t.length == 0)
            form.fin08t.push({});
        if (form.$nodeCode == "Cashier") {
            if (form.fin08pay.length == 0)
                form.fin08pay.push({});
        }
    }
    form.chooseProjectCallback = function (row, item) {
        if (row[0] != null) {
            var josnobj = row[0];
            item.projectName = josnobj.projectDesc;
            item.projectManager = josnobj.chName;
            item.projectManagerJobId = josnobj.projectManagerJobId;
            item.auditJobId = josnobj.auditJobId;
        }
    }

    form.ChangeisProj = function (item) {
        debugger;
        if (form.fin08.isProj == "2") {
            for (var i = 0; i < item.length; i++) {
                item[i].checked = !!true;
            }
            var evens = _.remove(item, function (n) {
                return n.checked;
            });
        }
    }


    //删除
    form.delete = function (obj) {
        debugger;
        var evens = _.remove(obj, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }


    form.needCash = function (selectItem) {
        debugger;
        if (selectItem.length > 0) {
            if (selectItem[0].value != "1") {
                form.fin08.currency = null;
                form.fin08.sumofAmount = "";
                form.fin08.currencyDescription = "";
            }
            else {
                form.fin08.currency = "CNY";
            }
        }
    }

    ////付款信息删除
    //form.fin08pay.delete = function () {
    //    var evens = _.remove(form.fin08pay, function (n) {
    //        return n.checked;
    //    }); 
    //    if (evens.length === 0) {
    //        mabp.notify.warn("请先勾选删除列");
    //    }
    //}

    form.$event_submit_before = function (context) {
        debugger;
        if (form.fin08.isProj == "1") {
            if (form.fin08p.length == 0) {
                mabp.notify.warn("请填写至少一行项目明细数据");
                return context.$stop();
            }
        }
        if (form.fin08t.length == 0) {
            mabp.notify.warn("请填写至少一行出差明细数据");
            return context.$stop();
        }
        return context.$continue();
    }

    form.$event_agree_before = function (context) {
        if (form.$nodeCode == "Cashier") {
            if (form.fin08pay.length == 0) {
                mabp.notify.warn("请填写至少一行付款明细数据");
                return context.$stop();
            }
        }
        return context.$continue();
    }
}