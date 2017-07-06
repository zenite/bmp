
function controller(base, form, program) {
    form.$event_submit_before = function (context) {
        if (form.hr07.changeType == 'bffc7942-6abc-4bb6-9bc5-95e51f5c3648') {
            if (form.hr07detail.length > 0) {
                for (var i = 0; i < form.hr07detail.length; i++) {
                    if (form.hr07detail[i].newCompanyId != form.hr07.company) {
                        form.$alert("调入区域与公司不一致，请重新填写");
                        return context.$stop();
                        break;
                    }
                }
            } else {
                form.$alert("调动员工信息表不允许为空");
                return context.$stop();
            }
            if (form.$state.UploadAttachment == null) {
                form.$alert("管理人员任免必须上传附件");
                return context.$stop();
            }
        }

        if (form.hr07.changeType != 'bffc7942-6abc-4bb6-9bc5-95e51f5c3648') {
            form.hr07.jobLevel = null;
            form.hr07.executiveDismiss = null;
        }
        else if ((form.hr07.changeType == 'f794eaa9-8427-489f-8484-c41ab5499b0a,699ee1ce-eb64-4dc8-a00e-b9a3f814e7b6') || (form.hr07.changeType == '699ee1ce-eb64-4dc8-a00e-b9a3f814e7b6,f794eaa9-8427-489f-8484-c41ab5499b0a') || (form.hr07.changeType == 'f794eaa9-8427-489f-8484-c41ab5499b0a')) {
            form.hr07.existFunctionDescription = null;
            form.hr07.proposedFunctionDesciption = null;
        } else if ((form.hr07.changeType == 'f794eaa9-8427-489f-8484-c41ab5499b0a,699ee1ce-eb64-4dc8-a00e-b9a3f814e7b6') || (form.hr07.changeType == '699ee1ce-eb64-4dc8-a00e-b9a3f814e7b6,f794eaa9-8427-489f-8484-c41ab5499b0a') || (form.hr07.changeType == '699ee1ce-eb64-4dc8-a00e-b9a3f814e7b6')) {
            form.hr07.existOrgDescription = null;
            form.hr07.recommendOrgDescription = null;
        } else {
            form.hr07.existFunctionDescription = null;
            form.hr07.proposedFunctionDesciption = null;
            form.hr07.existOrgDescription = null;
            form.hr07.recommendOrgDescription = null;
            form.hr07.existOrgStrength = null;
            form.hr07.recommendOrgStrength = null;
            form.hr07.existFuncProblem = null;
            form.hr07.recommendFuncPotentialRisks = null;
            form.hr07.procedualDocuments = null;
            form.hr07.orgType = null;
            form.hr07.recommendDept = null;
        }
        return context.$continue();
    }
    form.delete = function () {
        debugger;
        var evens = _.remove(form.hr07detail, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }
    form.add = function () {
        debugger;
        form.hr07detail.push({ isHeadcountBudgetAdjustment: '51B9F2E4-FBE9-400A-A789-A296E30177BF' });
    }
    form.chooseSupplier = function (selectItem, item) {
        debugger;
        if (!!selectItem && selectItem[0] != null) {
            var row = selectItem[0];

            item.staffName = row.uName;
            item.originalCompanyId = row.companyName;
            item.originalDepartmentId = row.parentGroupId;
            item.originalSectionId = row.groupId1;
            item.originalPositionId = row.jobName;
        }
    }
    form.$page_load = function () {
        if (base.pageState == 1 && form.hr07detail.length < 1) {
            form.add();
        }
        debugger;
        program("Setpermissions", { jobid: (base.jobId || "") },
     function (jobLeavel) {
         debugger;
         base.jobLeavel = parseInt(jobLeavel);
     });

    }
    var _oldArr = [];
    form.clearData = function (selectItem, fmModel) {
        if (form.hr07.changeType != 'bffc7942-6abc-4bb6-9bc5-95e51f5c3648') {
            form.hr07.jobLevel = null;
            form.hr07.executiveDismiss = null;
            for (var i = 0; i < form.hr07detail.length; i++) {
                form.hr07detail[i].hrNo = null;
                form.hr07detail[i].staffName = null;
                form.hr07detail[i].gender = null;
                form.hr07detail[i].originalCompanyId = null;
                form.hr07detail[i].originalDepartmentId = null;
                form.hr07detail[i].originalSectionId = null;
                form.hr07detail[i].originalPositionId = null;
                form.hr07detail[i].isCurrentPositionPoison = null;
                form.hr07detail[i].newCompanyId = null;
                form.hr07detail[i].newDeptId = null;
                form.hr07detail[i].newSectionId = null;
                form.hr07detail[i].newPositionId = null;
                form.hr07detail[i].isNewPositionPoison = null;
                form.hr07detail[i].directManager = null;
                form.hr07detail[i].employeeProperty = null;
                form.hr07detail[i].effectiveDate = null;
                form.hr07detail[i].changeType = null;
                form.hr07detail[i].isHeadcountBudgetAdjustment = null;
            }
        }
        else if ((form.hr07.changeType == 'f794eaa9-8427-489f-8484-c41ab5499b0a,699ee1ce-eb64-4dc8-a00e-b9a3f814e7b6') || (form.hr07.changeType == '699ee1ce-eb64-4dc8-a00e-b9a3f814e7b6,f794eaa9-8427-489f-8484-c41ab5499b0a') || (form.hr07.changeType == 'f794eaa9-8427-489f-8484-c41ab5499b0a')) {
            form.hr07.existFunctionDescription = null;
            form.hr07.proposedFunctionDesciption = null;
        } else if ((form.hr07.changeType == 'f794eaa9-8427-489f-8484-c41ab5499b0a,699ee1ce-eb64-4dc8-a00e-b9a3f814e7b6') || (form.hr07.changeType == '699ee1ce-eb64-4dc8-a00e-b9a3f814e7b6,f794eaa9-8427-489f-8484-c41ab5499b0a') || (form.hr07.changeType == '699ee1ce-eb64-4dc8-a00e-b9a3f814e7b6')) {
            form.hr07.existOrgDescription = null;
            form.hr07.recommendOrgDescription = null;
        } else {
            form.hr07.existFunctionDescription = null;
            form.hr07.proposedFunctionDesciption = null;
            form.hr07.existOrgDescription = null;
            form.hr07.recommendOrgDescription = null;
            form.hr07.existOrgStrength = null;
            form.hr07.recommendOrgStrength = null;
            form.hr07.existFuncProblem = null;
            form.hr07.recommendFuncPotentialRisks = null;
            form.hr07.procedualDocuments = null;
            form.hr07.orgType = null;
            form.hr07.recommendDept = null;
        }

        var arr = (fmModel || "").split(",");
        if (selectItem && selectItem.id == 'bffc7942-6abc-4bb6-9bc5-95e51f5c3648') {
            if (arr.indexOf("699ee1ce-eb64-4dc8-a00e-b9a3f814e7b6") >= 0) {
                arr.splice(arr.indexOf("699ee1ce-eb64-4dc8-a00e-b9a3f814e7b6"), 1);
            }
            if (arr.indexOf("f794eaa9-8427-489f-8484-c41ab5499b0a") >= 0) {
                arr.splice(arr.indexOf("f794eaa9-8427-489f-8484-c41ab5499b0a"), 1);
            }
        } else {
            if (arr.indexOf("bffc7942-6abc-4bb6-9bc5-95e51f5c3648") >= 0) arr.splice(arr.indexOf("bffc7942-6abc-4bb6-9bc5-95e51f5c3648"), 1);

        }
        _oldArr = arr;
        form.hr07.changeType = arr.join(",");

    }
    form.selectjob = function (selectItem, item) {
        debugger;
        if (selectItem.length > 0) {
            program("GetManager", { jobid: (selectItem[0].id || "") },
       function (linemanagers) {
           item.directManager = linemanagers[0];
           item.newCompanyId = linemanagers[1];
       });
        }

    }


    form.$event_agree_before = function (context) {

        debugger;
        if (form.$pageRight.Hr07Node1 == 'normal')
        {
            var files = form.$attachments[0].files;
            var isHave = _.findIndex(files, { creatorUserId: base.currentUserId, nodeId: base.nodeId }) > -1;
            if (!isHave) {
                //todo:给出需要用户上传文件提示
                form.$alert("必须上传附件");
                return context.stop();

            }
        }
       
        //todo:开发完成后这里应该是context.$continue();继续提交
        return context.$continue()

    }


}