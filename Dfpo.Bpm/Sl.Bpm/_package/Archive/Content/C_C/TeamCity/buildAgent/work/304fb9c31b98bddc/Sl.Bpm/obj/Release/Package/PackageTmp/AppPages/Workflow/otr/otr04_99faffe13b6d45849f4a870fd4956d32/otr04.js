
function controller(base, form, program) {
    form.chooseContractreview = function (item) {
        debugger;
        base;
        if (!!item && item[0] != null) {
            var row = item[0];
            form.otr04.fileName = row.snNumber;
            program("GetContractCompanyOtherParty", { TaskId: (row.taskId || "") },
        function (linemanagers) {
            form.otr04.contractOtherParty = linemanagers;
        });
        }
       
    }
    form.bindingcompany = function ()
    {
        if (form.otr04.fileType == '5D02BB7E-964C-4BE8-9992-A37E7D14F6F0') {
            form.otr04.contractOurParty = form.otr04.applyCompany;
        } else
        {
            form.otr04.contractOurParty = null;
        }
        if (form.otr04.fileType == '8B8988C3-3ED7-4211-95A6-63B7A85CDFFB') {
            form.otr04.boardCompany = form.otr04.applyCompany;
        } else {
            form.otr04.boardCompany = null;
        }

    }
    
    form.changeview = function (selectItem, fmModel)
    {
        debugger;
        var model = fmModel.split(',');
        if ((model || "").indexOf("71933c84-1b12-464e-b10f-66030d79796d") >= 0 || (model || "").indexOf("7614c1a5-23e6-40f4-adc2-b5f303bc4fe6") >= 0 || (model || "").indexOf("8ae98adf-4693-4973-a08b-bc6d016e2ea2") >= 0) {
            form.showJustice = true;
            form.showordinary = false;
        }
        else
        {
            form.showJustice = false;
            form.showordinary = true;
        }
        if (form.otr04.fileType == "D4B5D121-DC50-4107-8E48-0AC16D296927")
        {
            if (form.showJustice) {
                form.otr04.otherDocName = null;
                form.otr04.otherContentDes = null;
            }
            else
            {
                form.otr04.legalOtherCompany = null;
                form.otr04.legalOtherYear = null;
                form.otr04.legalBackgroundDes = null;
                form.otr04.legalContentDes = null;
            }
        }
    }
    form.clearData = function ()
    {
        if (form.otr04.fileType != "5D02BB7E-964C-4BE8-9992-A37E7D14F6F0") {
            form.otr04.contractType = null;
            form.otr04.projectName = null;
            form.otr04.contractOurParty = null;
            form.otr04.contractOtherParty = null;
            form.otr04.amount = null;
            form.otr04.validPeriod = null;
            form.otr04.others = null;
        }
        else
        {
            form.otr04.validPeriod = moment(new Date()).startOf('year').format("YYYY-MM-DD") + "~" + moment(new Date()).endOf('year').format("YYYY-MM-DD");
        }
        if (form.otr04.fileType != "8B8988C3-3ED7-4211-95A6-63B7A85CDFFB")
        {
            form.otr04.boardCompany = null;
            form.otr04.boardYear = null;
            form.otr04.resolutionDes = null;
        }
        if (form.otr04.fileType != "ACE5E4C4-F8CE-4E62-8387-9E207AA1B1C2")
        {
            form.otr04.priceListCustomer = null;
            form.otr04.priceListProject = null;
            form.otr04.priceListProduct = null;
        }
        if (form.otr04.fileType != "D4B5D121-DC50-4107-8E48-0AC16D296927")
        {
            form.otr04.otherDocName = null;
            form.otr04.otherContentDes = null;
            form.otr04.legalOtherCompany = null;
            form.otr04.legalOtherYear = null;
            form.otr04.legalBackgroundDes = null;
            form.otr04.legalContentDes = null;
        }
        if (form.otr04.fileType != '5D02BB7E-964C-4BE8-9992-A37E7D14F6F0' || form.otr04.fileType != '99527111-d167-4f16-ac66-aa57ca0ff748' || form.otr04.fileType != '4DE59D91-AEEA-4149-93C9-466E3D1FC82B')
        {
            form.otr04.printCopyNumber = null;
        }
    }
    form.$event_submit_before = function (context) {
        debugger;
        var model = form.otr04.requireApprovalType.split(',');
        if ((model || "").indexOf("bf03aeee-bf00-48e1-92a9-58b3b95f693b") >= 0 && base.areaCode != "YFVIC") {
            if (form.otr04.applyCompany != base.areaCode) {
                form.$alert("申请公司只允许选择申请人所属公司");
                return false;
            }
        }
        if (form.otr04.fileType == '4DE59D91-AEEA-4149-93C9-466E3D1FC82B') {
            if (form.showJustice) {
                form.otr04.isotherJustice = "D17A7445-9082-4A80-80E4-F47B4D19049E";
            }
            else {
                form.otr04.isotherJustice = "51B9F2E4-FBE9-400A-A789-A296E30177BF";
            }
        }
        return context.$continue();
    }
}