
function controller(base, form, program) {
    form.$page_load = function () {
        if (base.pageState == "1") {
            form.sale02.isFirst = "1";
            form.addsale02od();
            form.sale02.contractAmount = 0;
            form.sale02.contractSHTCCompanyId = program('GetGroupId', { AreaCode: 'SHTC' });
            form.sale02.contractNJTCCompanyId = program('GetGroupId', { AreaCode: 'NJTC' });
            form.sale02.companyIds = form.sale02.contractSHTCCompanyId + "," + form.sale02.contractNJTCCompanyId;
        }
    }
    form.sale02.isMasterAgreementFinalDraft = "2";

    form.chooseContractTime = function (item,model) {
        if (form.sale02.contractFrom != "" && form.sale02.contractTo != "" && form.sale02.contractFrom > form.sale02.contractTo) {
            mabp.notify.warn("合同日期结束日期不能比开始日期小");
            if (model == "ContractFrom")
                form.sale02.contractFrom = null;
            else
                form.sale02.contractTo = null;
        }
    }

    form.chooseContractType = function (item) {
        form.sale02.contractTypeId = item[0].id;
        if (form.sale02.contractType == 2)
            form.sale02.chooseApproveDepartments = null;
    }

    form.chooseBusinessType = function (item) {
        form.sale02.businessTypeId = item[0].id;
    }

    form.chooseAllCompany = function (row) {
        var groupId = program('GetGroupId', { AreaCode: row[0].id });
        form.sale02.contractCompanyId = groupId;
    }

    form.$event_submit_before = function (context) {
        form.saveFile();
        return context.$continue();
    }

    form.$event_agree_before = function (context) {
        if (form.$pageRight.LegalExaminationApprovalNode == 'normal' || form.$pageRight.DirectorApprovalNode == 'normal' || form.$pageRight.OtherDirectorApprovalNode == 'normal') {
            form.saveFile();
        }
        if (form.$pageRight.LegalConfirmation == 'normal') {
            if (form.sale02.isMasterAgreementFinalDraft == '2') {
                mabp.notify.warn("请选择一个主协议");
                return false;
            }
        }
        return context.$continue();
    }

    form.saveFile = function () {
        _.remove(form.sale02d);
        $(form.$attachments[0].FileId).each(function (i, item) {
            var fileInfo = program('GetFileInfo', { FileId: item }).split("|");
            form.sale02d.push({ attachName: fileInfo[0], uploadUser: fileInfo[1], uploadTime: fileInfo[2], masterAgreementFinalDraft: 2, finalDraft: 2 });
        })
    }

    form.chooseMasterAgreementFinalDraft = function (item, selectItem) {
        if (item.masterAgreementFinalDraft == 1) {
            item.finalDraft = item.masterAgreementFinalDraft;
            form.sale02.isMasterAgreementFinalDraft = "1";
        }
        else {
            form.sale02.isMasterAgreementFinalDraft = "2";
        }
    }

    form.addsale02od = function () {
        var refId = _$.getGUID();
        if (form.sale02.isFirst == "1") {
            form.sale02.isFirst = "0";
            refId = "1";
        }
        form.sale02od.push({ refId: refId, contractCompanyOtherParty: '' });
    }

    form.deletesale02od = function (item) {
        _.remove(form.sale02od, { refId: item.refId, contractCompanyOtherParty: item.contractCompanyOtherParty });
    }
}