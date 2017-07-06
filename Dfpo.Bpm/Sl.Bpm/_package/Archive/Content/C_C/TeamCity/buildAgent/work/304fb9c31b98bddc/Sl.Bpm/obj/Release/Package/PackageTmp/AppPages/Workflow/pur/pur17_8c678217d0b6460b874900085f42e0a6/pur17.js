
function controller(base, form, program) {
    debugger;
    var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;

    //页面加载 开始结点加载1/2表单的数据
    form.$page_load = function () {
        if (form.$nodeCode === "Start" && !form.pur17.shipVia) {
            //开始结点并且尚未加载PUR16的数据时才去加载
            //form.pur17.newSupplierSnNumber = "SMC201610001";
            //program('GetNewSupplierApplication', { newSupplierSn: form.pur17.newSupplierSnNumber }, function (data) {
            //    if (!!data[0]) {
            //        var pur16 = data[0];
            //        form.pur17.supplierNa = pur16.registeredSupplierName;
            //        form.pur17.supplierAddress = pur16.registeredAddressPost;
            //        form.pur17.class = pur16.class;
            //        form.pur17.commodity = pur16.commodity;
            //        form.pur17.applicationType = pur16.applicationType;
            //        form.pur17.pn = pur16.productionOrNon;
            //        form.pur17.om = pur16.oneOrMultiTime;
            //        form.pur17.manufactureSide = pur16.manufactureSide;
            //        form.pur17.gsdb = pur16.gsdbSupplier;
            //        form.pur17.currency = pur16.dealCurrency;
            //        form.pur17.applicationReason = pur16.description;
            //        form.pur17.qadSupplicerName = program('Common.StringConvert', { v: pur16.registeredSupplierName, type: 2 });
            //        form.pur17.supplierForSubsidiary = pur16.supplierForSubsidiary;
            //        form.pur17.usedInCompany = pur16.usedInCompany;
            //        form.pur17.qadSupplicerCode = pur16.qadSupplierCode;
            //        //if (form.pur17.supplierForSubsidiary === "51B9F2E4-FBE9-400A-A789-A296E30177BF" || !form.pur17.supplierForSubsidiary) {
            //        //    if (form.pur17.gsdb === "51B9F2E4-FBE9-400A-A789-A296E30177BF") {
            //        //        form.pur17.qadSupplicerCode = pur16.supplierCode;
            //        //    } else {
            //        //        form.pur17.qadSupplicerCode = pur16.gsdbSupplierText;
            //        //    }
            //        //} else {
            //        //    if (!!pur16._SubsidiaryValue) {
            //        //        var val = pur16._SubsidiaryValue;
            //        //        if (form.pur17.gsdb !== "51B9F2E4-FBE9-400A-A789-A296E30177BF") {
            //        //            var end = pur16.supplierCode.slice(1);
            //        //            if (val === "CQ") {
            //        //                form.pur17.qadSupplicerCode = "Q" + end;
            //        //            } else {
            //        //                var start = val.slice(0, 1);
            //        //                form.pur17.qadSupplicerCode = start + end;
            //        //            }
            //        //        } else {
            //        //            form.pur17.qadSupplicerCode = val + "-" + pur16.gsdbSupplierText;
            //        //        }
            //        //    }

            //        //}
            //    }
            //});
            //给最后三个字段赋值
            program('GetPurAndApInfo', { usedInCompany: form.pur17.usedInCompany, productionOrNot: form.pur17.pn, currency: form.pur17.currency }, function (result) {
                if (!!result[0]) {
                    var acct = result[0];
                    form.pur17.purchaseAcct = acct.purAccount;
                    form.pur17.purSubAcct = acct.purSubsidiaryAccount;
                    form.pur17.purCostCenter = acct.purCostCenter;
                    form.pur17.apAcct = acct.apAccount;
                    form.pur17.apSubAcct = acct.apSubsidiaryAccount;
                    form.pur17.apCostCenter = acct.apCostCenter;
                    form.pur17.bankCode = acct.bank;
                }
            });
        }
    }

    //查看新供应商申请流程
    form.checkNewSupplier = function () {
        window.open("/SysPages/SnNumber?id={0}".fill(form.pur17.newSupplierSnNumber));
    }

    //基础验证
    form.$doValidation = function () {
        if (form.$nodeCode === "PUR17_01") {
            var check = program('CheckQadCodeUnique', { qadSupplierCode: form.pur17.qadSupplicerCode, companyCode: form.pur17.usedInCompany, sn: form.pur17.snNumber });
            if (!!check) {
                form.$errors.push({ element: $("[name=qadSupplicerCode]"), msg: form.$pageLang.QadSupplierCodeRepeat });
            }
        }
    }

}