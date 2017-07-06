
function controller(base, form, program) {
    form.$event_submit_before = function (context) {
        if ((form.hr12.refereeEmail || "").substring((form.hr12.refereeEmail || "").indexOf("@"), parseInt((form.hr12.refereeEmail || "").indexOf("@") + 4)) == '@163')
        {
            form.$alert("候选人邮箱不允许填163邮箱");
            return context.$stop();
        }
        if (form.hr12.referralCandidateRelation != '00E2ED8F-82C3-4759-88EC-F2DC3C5ACEB4')
        {
            form.hr12.otherRelationDescription = null;
        }
        if (form.hr12.isWasCandidateInVendorCompany != '1583874B-5978-449A-8055-D0D4FA332217')
        {
            form.hr12.candidateCurrentCompanyName = null;
        }
        if (form.hr12.isCandidateInVendorCompany != '1583874B-5978-449A-8055-D0D4FA332217') {
            form.hr12.candidateCurrentVendorCompanyName = null;
        }
        if (form.hr12.wasCandidateInVendorCompany != '1583874B-5978-449A-8055-D0D4FA332217') {
            form.hr12.candidateWasInVisteon = null;
        }
        if (form.hr12.isCandidateInYfVisteon != '1583874B-5978-449A-8055-D0D4FA332217') {
            form.hr12.candidateCurrentYfCompanyName = null;
        }
        return context.$continue();
    }
    form.clearotherRelationDescription = function ()
    {
        if (form.hr12.referralCandidateRelation != '00E2ED8F-82C3-4759-88EC-F2DC3C5ACEB4') {
            form.hr12.otherRelationDescription = null;
        }
    }
    form.clearcandidateCurrentCompanyName = function (selectItem, fmModel) {
        debugger;
        if (form.hr12.isCandidateInYfVisteon != '1583874B-5978-449A-8055-D0D4FA332217') {
            form.hr12.candidateCurrentYfCompanyName = null;
        }
        if (form.hr12.isCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217' || form.hr12.wasCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217' || form.hr12.isWasCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217')
        {
            if (fmModel == '1583874B-5978-449A-8055-D0D4FA332217')
            {
                if (form.hr12.isWasCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217') {
                    form.hr12.isWasCandidateInVendorCompany = null;
                }
                if (form.hr12.wasCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217') {
                    form.hr12.wasCandidateInVendorCompany = null;
                }
                if (form.hr12.isCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217') {
                    form.hr12.isCandidateInVendorCompany = null;
                    form.hr12.candidateCurrentVendorCompanyName = null;
                }
            }
        }
    }
    form.clearcandidateCurrentVendorCompanyName = function (selectItem, fmModel) {
        debugger;
        if (form.hr12.isWasCandidateInVendorCompany != '1583874B-5978-449A-8055-D0D4FA332217') {
            form.hr12.candidateCurrentCompanyName = null;
        }
        if (form.hr12.isCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217' || form.hr12.wasCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217' || form.hr12.isCandidateInYfVisteon == '1583874B-5978-449A-8055-D0D4FA332217') {
            if (fmModel == '1583874B-5978-449A-8055-D0D4FA332217') {
                if (form.hr12.isCandidateInYfVisteon == '1583874B-5978-449A-8055-D0D4FA332217') {
                    form.hr12.isCandidateInYfVisteon = null;
                    form.hr12.candidateCurrentYfCompanyName = null;
                }
                if (form.hr12.wasCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217') {
                    form.hr12.wasCandidateInVendorCompany = null;
                    form.hr12.candidateWasInVisteon = null;
                }
                if (form.hr12.isCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217') {
                    form.hr12.isCandidateInVendorCompany = null;
                    form.hr12.candidateCurrentVendorCompanyName = null;
                }
            }
        }
    }
    form.clearcandidateWasInVisteon = function (selectItem, fmModel) {
        debugger;
        if (form.hr12.isCandidateInVendorCompany != '1583874B-5978-449A-8055-D0D4FA332217') {
            form.hr12.candidateCurrentVendorCompanyName = null;
        }
        if (form.hr12.isWasCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217' || form.hr12.wasCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217' || form.hr12.isCandidateInYfVisteon == '1583874B-5978-449A-8055-D0D4FA332217') {
            if (fmModel == '1583874B-5978-449A-8055-D0D4FA332217') {
                if (form.hr12.isWasCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217')
                {
                    form.hr12.isWasCandidateInVendorCompany = null;
                    form.hr12.candidateCurrentCompanyName = null;
                }
                if (form.hr12.wasCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217')
                {
                    form.hr12.wasCandidateInVendorCompany = null;
                    form.hr12.candidateWasInVisteon = null;
                }
                if (form.hr12.isCandidateInYfVisteon == '1583874B-5978-449A-8055-D0D4FA332217')
                {
                    form.hr12.isCandidateInYfVisteon = null;
                    form.hr12.candidateCurrentYfCompanyName = null;
                }
              
            }
        }
    }
    form.clearcandidateCurrentYfCompanyName = function (selectItem, fmModel) {
        debugger;
        if (form.hr12.wasCandidateInVendorCompany != '1583874B-5978-449A-8055-D0D4FA332217') {
            form.hr12.candidateCurrentYfCompanyName = null;
        }
        if (form.hr12.isWasCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217' || form.hr12.isCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217' || form.hr12.isCandidateInYfVisteon == '1583874B-5978-449A-8055-D0D4FA332217') {
            if (fmModel == '1583874B-5978-449A-8055-D0D4FA332217') {
                if (form.hr12.isCandidateInYfVisteon == '1583874B-5978-449A-8055-D0D4FA332217') {
                    form.hr12.isCandidateInYfVisteon = null;
                    form.hr12.candidateCurrentYfCompanyName = null;
                }
                if (form.hr12.isWasCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217') {
                    form.hr12.isWasCandidateInVendorCompany = null;
                    form.hr12.candidateCurrentCompanyName = null;
                }
                if (form.hr12.isCandidateInVendorCompany == '1583874B-5978-449A-8055-D0D4FA332217') {
                    form.hr12.isCandidateInVendorCompany = null;
                    form.hr12.candidateCurrentVendorCompanyName = null;
                }
            }
        }
    }
}