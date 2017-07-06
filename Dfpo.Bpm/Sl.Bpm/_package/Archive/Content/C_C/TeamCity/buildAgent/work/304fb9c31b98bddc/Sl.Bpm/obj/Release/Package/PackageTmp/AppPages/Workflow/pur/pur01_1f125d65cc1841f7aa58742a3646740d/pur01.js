
function controller(base, form, program) {
    debugger;
    //获取供应商编号
    form.chooseSupplierCode = function (row) {
        if (!!row[0]) {
            form.pur01.supplierCode = row[0].id;
        }
    }
    //获取项目名称
    form.chooseProjectName = function (row) {
        debugger;
        if (!!form.pur01.programCode) {
            //form.pur01.programCodeText = null;
            form.pur01.programName = null;
            if (!!row[0]) {
                form.pur01.programName = row[0].projectName;
            }
        }
    }

    form.$page_load = function () {
        debugger;
        if (form.$nodeCode === 'Start') {
            if (form.pur01.projectinvolveCompany == null) { form.pur01.projectinvolveCompany = base.applicant.areaCode; }
            form.pur01.programCodeText = form.pur01.programCode;
            //初始化协议年度降价率
            if (form.pur01.yeartwo == null) {
                form.pur01.yeartwo = "3";
                form.pur01.yearthree = "3";
                form.pur01.yearfour = "3";
                form.pur01.yearfive = "0";
                form.pur01.yearsix = "0";
            }
        }
    }

    form.$doValidation = function () {
        if (form.$nodeCode === 'Start') {
            if (!!form.pur01.programCode) {
                form.pur01.programCodeText = null;
            }
        }
    }
}