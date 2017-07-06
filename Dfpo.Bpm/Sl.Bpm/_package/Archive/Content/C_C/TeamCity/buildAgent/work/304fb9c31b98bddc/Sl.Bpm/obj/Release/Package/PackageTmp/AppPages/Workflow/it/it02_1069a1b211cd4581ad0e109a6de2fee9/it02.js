function controller(base, form, program) {
    form.$page_load = function () {
        debugger;
        form.isstae = form.$pageRight.AcrnO2 === 'normal' || base.pageState == 1 ? 'normal' : '';
    }
    form.$event_submit_before = function (context) {
        var id = form.it02.applicationChangeRequest;
        form.it02.acrJobId = program("GetAcrJobId", {
            id: id
        });
        return context.$continue();
    }
    
    form.$event_agree_before = function (context) {
        debugger;
       
        if (form.$pageRight.AcrnO2 == 'normal') {
            //含测试结果不满足上线要求Guid
            var acr02 = "089A1E00-63D1-48EC-BC38-8FA37FC4E4F2";
            var acrlen = form.it02uat.length;
            if (acrlen < 1) {
                form.$toast("User Acceptance Test至少填写一条！");

              //  form.$alert("User Acceptance Test至少填写一条！");
                return context.$stop();
            } else {
                for (var i = 0; i < acrlen; i++) {
                    var row = form.it02uat[i];
                    if (row.testBy == acr02) {
                        form.$alert("含测试结果不满足上线要求！");
                        return context.$stop();
                    }
                }
            }
        }
        return context.$continue();
    }
    form.after_choose = function (selectItem)
    {
        if (form.it02.applicationChangeRequest != null && selectItem.length>0) {

            form.it02.application = selectItem[0].application;
            form.it02.actionType = selectItem[0].actionType;
            form.it02.applicant = selectItem[0].applicant;
            form.it02.itEngineer = selectItem[0].itEngineer;
        }
     
    }
    form.mark = function () {
        form.table.selectMark(form.it02, form.it02uat);
    }
    form.selectAll = function () {
        debugger;
        form.table.selectAll(form.it02, form.it02uat);
    }

    form.add = function () {
        if (!form.it02.applicationChangeRequest) {
            mabp.notify.warn("请选择Application Change Request");
            return;
        } else {
            debugger;
            form.it02uat.push({});
        }
    }
    form.delete = function () {
        var evens = _.remove(form.it02uat, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        };
    }
    form.table = {
        selectAll: function (appliaction, detail) {
            debugger;
            var detaillength =detail.length;
            if (detaillength > 0) {
                for (var i = 0; i < detaillength; i++) {
                    detail[i].checked = appliaction.selectAll ? true : false;
                }
            } else {
                mabp.notify.warn("请添加行！");
                appliaction.selectAll = false;
            }
        },
        tdelete: function (appliaction, detail) {
            if (appliaction.selectAll) {
                appliaction.selectAll = false;
            }
            var evens = _.remove(detail, function (n) {
                return n.checked;
            });
            if (evens.length === 0) {
                mabp.notify.warn("请先勾选删除列");
            }
        },
        selectMark: function (appliaction, detail) {
            debugger;
            for (var i = 0; i < detail.length; i++) {
                if (detail[i].checked == false) {
                    return appliaction.selectAll = false;
                }
            }
            appliaction.selectAll = true;
        }
    };
}
