
function controller(base, form, program) {
    form.$event_submit_before = function (context) {
        debugger;
        if (form.hr10detail.length > 0) {
            var object = form.hr10detail[0].newCompanyId;
            var originalCompanyId = form.hr10detail[0].originalCompanyId
            for (var i = 0; i < form.hr10detail.length; i++) {

                if (form.hr10detail[i].newCompanyId != object) {
                    form.$alert("调动员工信息表中行与行存在调入区域不一致的情况，请重新填写");
                    return context.$stop();
                    break;
                }
                if (form.hr10detail[i].originalCompanyId != originalCompanyId) {
                    form.$alert("调动员工信息表中行与行存在原区域不一致的现象，请重新填写");
                    return context.$stop();
                    break;
                }
                if (form.hr10detail[i].newCompanyId != "YFVIC" && form.hr10detail[i].newCompanyId != "SHTC" && form.hr10detail[i].newCompanyId != "YFVAY")
                {
                    form.$alert("调入区域超出调入范围，请重新填写");
                    return context.$stop();
                    break;
                }
            }

        } else {
            form.$alert("调动员工信息表不允许为空");
            return context.$stop();
        }
        return context.$continue();
    }
    form.delete = function () {
        debugger;
        var evens = _.remove(form.hr10detail, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }
    form.add = function () {
        debugger;
        form.hr10detail.push({ isHeadcountBudgetAdjustment: '51B9F2E4-FBE9-400A-A789-A296E30177BF' });

    }
    form.chooseSupplier = function (selectItem, item) {
        debugger;
        if (!!selectItem && selectItem[0] != null) {
            var row = selectItem[0];

            item.staffName = row.uName;
            item.originalCompanyId = row.areaCode;
            item.originalDepartmentId = row.parentGroupId;
            item.originalSectionId = row.groupId1;
            item.originalPositionId = row.jobid;
        }
    }
    form.$event_agree_before = function (context) {
        
        if (form.$pageRight.Hr10Node2 == 'normal' && base.pageState == 2)
        {
            if ((form.hr10.newDeptOpinion || "") == "6b27927e-756d-4116-ae08-5c56957251a9")
            {
                form.$alert("直接经理意见不同意，只能点击拒绝操作");
                return context.$stop();
            }
           
        }
        return context.$continue();
    }
    form.$page_load = function () {
        if (base.pageState == 1) {
            form.add();
        }
    }
    form.selectjob = function (selectItem, item) {
        debugger;
        if (selectItem.length > 0) {
            program("GetManager", { jobid: (selectItem[0].id || "") },
       function (linemanagers) {
           debugger;
           item.directManager = linemanagers[0];
           item.directManagerEmailAddress = linemanagers[1];
           item.newCompanyId = linemanagers[2];
       });
        }

    }
    form.clearnewDeptApprove = function ()
    {
        if ((form.hr10.newDeptOpinion || "") != "54863d88-5ea2-4171-b23d-b167a132a75d") {
            form.hr10.newDeptApprove = null;
            

        }
    }
    form.clearsetFamiliarPeriod = function ()
    {
        if (form.hr10.newDeptApprove != '8360094f-8b09-4fac-8e9e-29ba5bd2d166') {
            form.hr10.setFamiliarPeriod = null;
        }
    }
}