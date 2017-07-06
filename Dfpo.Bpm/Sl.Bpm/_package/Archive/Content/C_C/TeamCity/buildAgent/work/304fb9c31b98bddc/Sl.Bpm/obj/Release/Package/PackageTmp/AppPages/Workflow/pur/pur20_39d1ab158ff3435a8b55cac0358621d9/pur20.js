
function controller(base, form, program) {
    debugger;
    //初始加载
    form.$page_load = function () {
        if (form.$nodeCode === "Start" && base.pageState === 1) {
            //退回到发起人的时候不设置默认采购员 退回发起人时 PR 已经把采购员插入了，不做赋值
            //form.pur20.buyer = base.applicantJobId;
            //传过来的PR货币和是否含税是唯一的，可以直接获取
            //form.$state.currency = form.pur20pod[0].currency;
            //form.$state.ynRate = form.pur20pod[0].ynRate;
            //明细行单位默认为PCS
            _.forEach(form.pur20pod,
                function (val) {
                    val.unit = "PCS";
                });

            form.sum();
        }
    }
    //根据最新需求，细表不允许新增，只能删除
    form.add = function () {
        if (!!form.pur20pod[0] && !form.pur20pod[form.pur20pod.length - 1].price && !form.pur20pod[form.pur20pod.length - 1].priceNet) {
            form.$toast(form.$pageLang.PriceNeed);
        } else {
            form.pur20pod.push({ unit: 'PCS', itemType: form.$state.productiveOrNotCode === '1' ? 'D746B882-F5CE-4988-B91D-D862060F4311' : '49B32DB9-5BA2-4E1C-97BA-5E4ED89D2D06' });
        }
    }

    //细表求和
    form.sum = function () {
        _.forEach(form.pur20pod, function (val) {
            val.totalPrice = _$.getMultiply(val.price, val.estimatedQuantity);
            val.totalPriceNet = _$.getMultiply(val.priceNet, val.estimatedQuantity);
            form.selectCurrency(val);
        });

        form.pur20.total = _$.getSumOfArray(form.pur20pod, 'totalPrice');//含税
        form.pur20.totalNet = _$.getSumOfArray(form.pur20pod, 'totalPriceNet');//不含税
    }

    //删除细表
    form.deletePod = function () {
        _.remove(form.pur20pod, { checked: true });
        form.sum();
    }

    //选择币种 获取税率用来计算一个总额，用于流程审批条件判断
    form.selectCurrency = function (i) {
        program('GetCurrencyRate', { currency: i.currency }, function (data) {
            if (!!data) {
                i.tax = data;
                i.totalPrice = _$.getMultiply(i.price, i.estimatedQuantity);
                i.totalPriceNet = _$.getMultiply(i.priceNet, i.estimatedQuantity);
                i.cnyTotal = _$.getMultiply(_$.getInt(i.totalPrice, i.totalPriceNet), _$.getInt(data));
                form.pur20.totalCny = _$.getSumOfArray(form.pur20pod, 'cnyTotal');//RMB总额，用来在流程上扭转判断
            }
        });
    }

    //基础验证和处理
    form.$doValidation = function () {
        if (form.$nodeCode === "Start") {
            //1. 校验卖方代码（QAD供应商代码）是否已启用，没有启用的话提示相关信息不允许提交
            var v = program('CheckSellerCodeEnable', { qadSupplierCode: form.pur20.sellerCode });
            if (!v) {
                form.$errors.push({ element: $("[name=sellerCode]"), msg: form.$pageLang.sellerCodeInvalid });
            }
            //2. PO含税+不含税合计不能大于PR明细行合计总金额，如果超过则提示
            //3. 合计做比较时需要考虑到不同币种*汇率转成人民币比较，但是汇率会发生变化，待财务确认
            //var com = program('CheckTotal', { cnyTotal: form.pur20.totalCny, itemIds: _.map(form.pur20pod, 'prItemId'), ynRate: form.pur20pod[0].ynRate });
            //if (!!com) {

            //}
            //4. 校验币种仅限一种，否则出提示窗口，不允许递交表单。
            if (form.pur20pod.length > 0 && !_.every(form.pur20pod, { 'currency': form.pur20pod[0].currency })) {
                form.$errors.push({ element: $("[name=currency]"), msg: form.$pageLang.CurrencyMulti });
            }
        }
    }

    //选择样品非样品
    form.selectSampleOrNot = function () {
        if (form.$state.sampleOrNotCode === "2") {
            form.pur20.date = new Date();
            form.pur20.deliveryRequired = null;
            form.pur20.routing = null;
            form.pur20.fob = null;
            form.pur20.deliveryAddress = null;
            form.pur20.paymentTerms = null;
            form.pur20.shipTo = null;
        }
        if (form.$state.sampleOrNotCode === "1") {
            form.pur20.shipSamplesTo = null;
            form.pur20.date = null;
            form.pur20.deliveryRequired = new Date();
            form.pur20.routing = "22B8A0AD-1EB7-4B7B-9B21-5BCD0F6B3230";
            form.pur20.fob = "248ECD86-1E65-4F0B-88FC-C77615F1B2C5";
            form.pur20.deliveryAddress = "BAFB4415-8E2A-46DA-8DC9-7A16312D5E4A";
            form.pur20.paymentTerms = "52076376-D7CE-438C-93B6-4D2E7C0D8C6B";
        }
    }

    //发票类型选择
    form.selectInvoiceType = function () {
        if (!!form.$state.invoiceTypeCode) {
            if (form.$state.invoiceTypeCode === "1") {
                form.pur20.invoiceRate = "53A563EE-84A8-496E-8FA2-7D195975BF49";
            }
        }
    }

    //选择生产类非生产类
    form.selectPn = function () {
        if (form.$state.productiveOrNotCode === "1") {
            form.pur20.npCategory = null;
        }
        _.forEach(form.pur20pod, function (val) {
            val.itemType = form.$state.productiveOrNotCode === '1' ? 'D746B882-F5CE-4988-B91D-D862060F4311' : '49B32DB9-5BA2-4E1C-97BA-5E4ED89D2D06';
        });
    }

    //打开PR请购单
    form.checkPr = function () {
        window.open("/SysPages/SnNumber?id={0}".fill(form.pur20.prSnNumber));
    }

    //细表数据上传
    //form.config = {};
    //form.config.base = {
    //    name: "yfvic_pur20_purchase_order_detailinfo", //表名
    //    displayAttachment: true, //是否展示为附件
    //    template: "pur20_template.xlsx", //模板
    //    allowPaged: true,//允许分页
    //    pageSize: 10,//默认每页条数
    //    validateAll: true,//这个用来标识是否需要通过全部的基础验证才会返回数据，默认是
    //    buttonName: base.$pageLang.Upload//按钮名
    //};

    //form.config.columns = [
    //    { columnName: form.$pageLang.ItemType, columnSource: "ItemType", dataSourceType: 2, basicDataType: 1, required: true, dataType: 2 },
    //    { columnName: form.$pageLang.ModelRelation, columnSource: "ModelRelation", dataSourceType: 2, basicDataType: 1, required: false, dataType: 2 },
    //    { columnName: form.$pageLang.EstimatedQuantity, columnSource: "EstimatedQuantity", dataSourceType: 1, required: true, dataType: 2 },
    //    { columnName: form.$pageLang.PartNumber, columnSource: "PartNumber", dataSourceType: 1, required: true, dataType: 2 },
    //    { columnName: form.$pageLang.Description, columnSource: "Description", dataSourceType: 1, required: true, dataType: 2 },
    //    { columnName: form.$pageLang.Currency, columnSource: "Currency", dataSourceType: 3, required: true, dataType: 2 },
    //    { columnName: form.$pageLang.Unit, columnSource: "Unit", dataSourceType: 1, required: true, dataType: 2 },
    //    { columnName: form.$pageLang.Price, columnSource: "Price", dataSourceType: 1, required: true, dataType: 5 },
    //    { columnName: form.$pageLang.PriceNet, columnSource: "PriceNet", dataSourceType: 1, required: true, dataType: 5 }
    //];

    //form.import = function (data) {
    //    var dt = data;
    //    _.forEach(data, function (val) {
    //        form.pur20pod.push(val);
    //    });
    //    form.sum();
    //}
}