
function controller(base, form, program) {
   
    form.$page_load = function ()
    {
        form.hr03.jobid = base.applicantJobId;
    }
    form.showDialog = function (item,fmModel) {
        debugger;
        if (!!item && item[0] != null) {
            var row = item[0];
            if (fmModel == 'A1491210-51A1-4FBE-A61F-20CE8F6BB04C' && base.pageState == 1)
            {
                form.$alert("附件请记得上传工作描述");
            }
        }
    }
    form.$event_submit_before = function (context)
    {
        if (form.hr03.recruitReason != '131CDCD4-5DED-447B-8F30-A9A629ACFFB1') {
            form.hr03.resignTransferStaffNameChi = null;
            form.hr03.resignTransferStaffNameEng = null;
            form.hr03.resignTransferStaffJobChi = null;
            form.hr03.resignTransferStaffJobEng = null;
            form.hr03.resignTransferTime = null;
            form.hr03.resignTransferReasonChi = null;
            form.hr03.resignTransferReasonEng = null;
           
        }
        return context.$continue();
    }
    form.clearData = function ()
    {
        if (form.hr03.recruitReason != '131CDCD4-5DED-447B-8F30-A9A629ACFFB1') {
            form.hr03.resignTransferStaffNameChi = null;
            form.hr03.resignTransferStaffNameEng = null;
            form.hr03.resignTransferStaffJobChi = null;
            form.hr03.resignTransferStaffJobEng = null;
            form.hr03.resignTransferTime = null;
            form.hr03.resignTransferReasonChi = null;
            form.hr03.resignTransferReasonEng = null;
        }
        if (form.hr03.recruitReason != '51B9F2E4-FBE9-400A-A789-A296E30177BF')
        {
            form.hr03.budgetHc = null;
            form.hr03.actualHc = null;
        }
        if (form.hr03.recruitReason != 'A2BC7505-F23C-44E0-8449-AA9CB51CA75A') {
            form.hr03.overBudgetReasonChi = null;
            form.hr03.overBudgetReasonEng = null;
        }
    }
}