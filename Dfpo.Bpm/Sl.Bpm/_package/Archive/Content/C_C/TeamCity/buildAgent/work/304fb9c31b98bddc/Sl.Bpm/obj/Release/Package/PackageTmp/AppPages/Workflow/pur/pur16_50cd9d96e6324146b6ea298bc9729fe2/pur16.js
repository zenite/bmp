
function controller(base, form, program) {
    debugger;
    var b = /^[0-9a-zA-Z]{5}$/;

    form.$page_load = function () {
        //抬头固定为YFVIC
        if (form.$nodeCode === "Start") {
            base.areaCode = "YFVIC";
        }
        if (base.pageState === 3) {
            form.pur16.managementCodeText = form.pur16.managementCode;
        }
    }
    //基础验证和处理
    form.$doValidation = function () {
        if (form.$nodeCode === "Start") {
            //非Gsdb gsdbText为空
            if (form.$state.gsdbSupplierCode !== '1') {
                form.pur16.gsdbSupplierText = null;
            }
            //GSDB Code如果有必须限定为5位 且只能为数字或字母或组合
            if (form.$state.gsdbSupplierCode === '1' && !b.test(form.pur16.gsdbSupplierText)) {
                form.$errors.push({ element: $("[name=gsdbSupplierText]"), msg: form.$pageLang.GsdbSupplierTextLength });
            }
            //非投资公司子公司和子公司代买料为空
            if (form.pur16.usedInCompany !== 'YFVIC') {
                form.pur16.supplierForSubsidiary = null;
                form.pur16.subsidiary = null;
            }
        }
        //如果管理代码是在发放代码时给出的
        if (form.$state.tag === 1) {
            form.pur16.managementCode = form.pur16.managementCodeText;
        }
        //验证供应商代码是否唯一、位数(供应商编码和QAD代码一起验证)
        if (form.$nodeCode === "PUR16_11") {
            //供应商编码必须为8位
            if (form.pur16.supplierCode.length !== 8) {
                form.$errors.push({ element: $("[name=supplierCode]"), msg: form.$pageLang.SupplierCodeLength });
            }
            form.generateQadCode();//调用生成QAD代码方法
            //供应商编码可以重复，不需要验证
            //var code = program('CheckSupplierCodeRepeat', { supplierCode: form.pur16.supplierCode, companyCode: form.pur16.usedInCompany });
            //if (!!code) {
            //    form.$errors.push({ element: $("[name=supplierCode]"), msg: form.$pageLang.SupplierCodeRepeat });
            //}
            var qadCode = program('CheckQadSupplierCodeRepeat', { qadSupplierCode: form.pur16.qadSupplierCode, companyCode: form.pur16.usedInCompany });
            if (!!qadCode) {
                form.$errors.push({ element: $("[name=supplierCode]"), msg: form.$pageLang.QadSupplierCodeRepeat });
            }
        }
    }

    //生成新的供应商代码
    form.generateCode = function (managementCode, currency, tag) {
        var code = "";
        //生产性/非生产性
        if (form.$state.productionOrNonCode === "NP") {
            code += "N";
        } else {
            code += "P";
        }
        //制造地/发货地/商品/服务
        if (form.$state.manufactureSideCode === "1") {
            code += "M";
        } else if (form.$state.manufactureSideCode === "2") {
            code += "D";
        } else if (form.$state.manufactureSideCode === "3") {
            code += "C";
        } else {
            code += "S";
        }
        //管理代码
        code += managementCode;
        //一次性/非一次性采购
        code += form.$state.oneOrMultiTimeCode;
        //交易币种
        code += currency;

        form.pur16.supplierCode = code;
        if (tag === 1) {
            form.$state.tag = 1;
            form.pur16.managementCodeText = managementCode;
        } else {
            form.$state.tag = 2;
            form.pur16.managementCode = managementCode;
        }
    }

    //获取新的管理代码并生成供应商代码
    form.searchManagementCode = function (code) {
        if (code[0]) {
            program('GetCurrencySimplifiedCode', { currency: form.pur16.dealCurrency }, function (data) {
                if (!!data[0]) {
                    form.generateCode(code[0].id, data, 2);
                }
            });
        }
    }

    //发放代码
    form.generateSupplierCode = function () {
        program('GetManagementHexAndCurrencySimpCode', { currency: form.pur16.dealCurrency }, function (data) {
            if (!!data[0]) {
                form.generateCode(data[0].hex, data[0].simplifiedCode, 1);
            }
        });
    }

    //切换物料大类，所属产品和补充信息也需要清空 产品采购也清空
    form.selectClass = function (data) {
        if (data[0]) {
            if (data[0].value === "3") {
                form.pur16.applicationType = null;
                form.pur16.assessmentResult = null;
                form.pur16.assessmentResultLevel = null;
                form.pur16.plannedProcurementCurrency = null;
                form.pur16.plannedProcurementCost = null;
                form.pur16.costPercentageOfCommodity = null;
                form.pur16.plannedProcurementQty = null;
                form.pur16.productionOrNon = "A26B07DB-2BA2-4065-A9DC-EA41D5233496";
            } else {
                form.pur16.productionOrNon = "F52BB99A-7AC7-4C06-8042-210578ACC33E";
            }
            form.pur16.commodity = null;
            form.pur16.commodityDetailedInfo = null;
            form.pur16.commodityBuyer = null;//只要所属物料大类切换了，所属产品就会清空，对应的采购也清空掉
        }
    }

    //切换申请类型
    form.selectApplicationType = function (data) {
        if (!!data[0]) {
            if (data[0].value !== "1") {
                form.pur16.assessmentResultLevel = null;
            }
            if (data[0].value === "3") {
                form.pur16.assessmentResult = null;
                form.pur16.manufactureSide = "C1A1341A-A2E0-42CB-BD2F-6343EF0C2270";
            }
            if (data[0].value !== "3") {
                form.pur16.manufactureSide = "181779F3-DA17-4373-8907-DCE8BEFF5C13";
            }
        }
    }

    //切换所属产品
    form.selectCommodity = function () {
        if (!!form.pur16.commodity) {
            program('GetPurchaser', { product: form.pur16.commodity }, function (data) {
                if (!!data[0]) {
                    form.pur16.commodityBuyer = data[0].purchaserJobId;
                }
            });
        }
    }

    //切换一次性/非一次性采购
    form.selectOneOrMultiTime = function (item) {
        if (form.$nodeCode === 'PUR16_11' && !!form.pur16.dealCurrency && (form.pur16.managementCode || form.pur16.managementCodeText) && !!item && !!item[0]) {
            program('GetCurrencySimplifiedCode', { currency: form.pur16.dealCurrency }, function (data) {
                if (!!data) {
                    if (form.$state.tag === 2) {
                        form.generateCode(form.pur16.managementCode, data, 2);
                    } else {
                        form.generateCode(form.pur16.managementCodeText, data, 1);
                    }
                }
            });
        }
    }

    //说明与术语
    form.instructionAndGlossary = function () {
        base.titleNew = "";
        form.$openDialog("instructionandglossary");
    }

    //切换是否为子公司代买料供应商
    form.SupplierForSubsidiary = function () {
        if (form.$state.supplierForSubsidiaryCode !== '1') {
            form.pur16.subsidiary = null;
        }
    }

    //生成供应商QAD代码
    form.generateQadCode = function () {
        if (form.pur16.usedInCompany === "YFVIC" || form.pur16.usedInCompany === "YFVSJ" || form.pur16.usedInCompany === "SHTC" || form.pur16.usedInCompany === "NJTC" || form.pur16.usedInCompany === "YFVAY") {
            //按照规则生成QAD Code
            if (!!form.pur16.supplierForSubsidiary) {//YFVIC才会有子公司代买料选项
                if (form.pur16.supplierForSubsidiary === "51B9F2E4-FBE9-400A-A789-A296E30177BF") {//不为子公司代买料
                    if (form.pur16.gsdbSupplier === "51B9F2E4-FBE9-400A-A789-A296E30177BF") {//否GSDB供应商
                        form.pur16.qadSupplierCode = form.pur16.supplierCode;
                    } else {
                        form.pur16.qadSupplierCode = form.pur16.gsdbSupplierText;
                    }
                } else {//子公司代买料
                    if (form.pur16.gsdbSupplier === "51B9F2E4-FBE9-400A-A789-A296E30177BF") {//否GSDB供应商
                        var start = form.$state.subsidiaryCode.slice(0, 1);
                        var end = form.pur16.supplierCode.slice(1);
                        if (form.$state.subsidiaryCode === "CQ") {
                            form.pur16.qadSupplierCode = "Q" + end;
                        } else {
                            form.pur16.qadSupplierCode = start + end;
                        }
                    } else {
                        form.pur16.qadSupplierCode = form.$state.subsidiaryCode + "-" + form.pur16.gsdbSupplierText;
                    }
                }
            } else {//另外四家不会有该选项，默认为否
                if (form.pur16.gsdbSupplier === "51B9F2E4-FBE9-400A-A789-A296E30177BF") {//否GSDB供应商
                    form.pur16.qadSupplierCode = form.pur16.supplierCode;
                } else {
                    form.pur16.qadSupplierCode = form.pur16.gsdbSupplierText;
                }
            }
        } else {
            form.pur16.qadSupplierCode = form.pur16.supplierCode;
        }
    }
}