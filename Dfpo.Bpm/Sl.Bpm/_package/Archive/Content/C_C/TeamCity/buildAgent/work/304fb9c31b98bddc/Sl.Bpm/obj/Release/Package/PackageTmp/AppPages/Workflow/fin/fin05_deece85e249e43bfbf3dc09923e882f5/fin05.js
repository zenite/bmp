
function controller(base, form, program) {
    debugger;

    //科技公司弹出提醒
    form.popupNotice = function () {
        if (base.areaCode == "SHTC" || base.areaCode == "NJTC") {
            form.$openDialog("tcpurnotice");
        }
    }
    //赋值项目经理
    form.setProjectInfo = function (item) {
        if (item.length > 0) {
            form.fin05.projManager = item[0].projectManager;
            form.fin05.projMgrAccount = item[0].projectManagerJobId;
            form.fin05.projAuditJobId = item[0].auditJobId;
        }
    }
    //赋值科目信息
    form.selectCostCenter = function (item, selectItem) {
        if (selectItem.length > 0) {
            item.costCenter = selectItem[0].costCenter;
            item.account = selectItem[0].account;
            item.accountDesc = selectItem[0].accountDesc;
            item.accountManagerJobId = selectItem[0].managerJobId;
        }
    }
    //选择币种
    form.selectCurrency = function (item) {
        if (item.length > 0) {
            form.fin05.exchangeRate = item[0].rate;
        }
    }
    //选择采购员角色
    form.selectBuyer = function (selectItem) {
        if (selectItem.length > 0) {
            form.fin05.buyerShow = selectItem[0].text;
        }
    }
    //选择框架协议
    form.selectFramework = function (selectItem) {
        //读取框架协议的物资赋值
        _.each(selectItem, function (item) {
            form.fin05est.push({
                isFrame: 1,
                itemName: item.product,
                estPrice: item.price
            });
        });
    }

    //选择币种
    form.selectItemCurrency = function (item, selectItem) {
        if (selectItem.length > 0)
            item.rate = selectItem[0].rate;
        form.sumQuot();
    }
    //读取供应商信息
    form.selectItemSupplier = function (item, selectItem) {
        if (selectItem.length > 0) {
            item.supplierCode = selectItem[0].qadSupplicerCode;
            item.supplier = selectItem[0].registeredSupplierName;
            item.paymentTerm = selectItem[0].crTerms;
        }
    }
    //读取发票类型，增值税专用发票可以选择发票税率
    form.selectItemInvoice = function (item, selectItem) {
        if (selectItem.length > 0 && selectItem[0].value != "3") {
            item.tax = 0;
        }
    }
    //选择采购类型，控制数值
    form.setPurchaseTypeStatus = function () {
        //不需要项目数据
        if (form.fin05.projType != "3" && form.fin05.projType != "4") {
            form.fin05.projCode = null;
            form.fin05.projManager = null;
            form.fin05.projMgrAccount = null;
            for (var i = 0; i < form.fin05est.length; i++) {
                form.fin05est[i].projectItemCode = null;
            }
        }
        if (form.fin05.projType == "4") {
            for (var i = 0; i < form.fin05est.length; i++) {
                form.fin05est[i].budgetId = null;
                form.fin05est[i].costCenter = null;
                form.fin05est[i].account = null;
                form.fin05est[i].accountDesc = null;
            }
        }
    }
    //删除预算行
    form.deleteEst = function () {
        var evens = _.remove(form.fin05est, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }
    //校验物料审核人必填 改成前端校验
    //form.$event_submit_before = function (context) {
    //    if (form.fin05.ismpl == '1' && form.$pageRight.EditQuot == 'normal') {
    //        form.$toast("请选择物料审批人");
    //        return context.$stop();
    //    }
    //    return context.$continue();
    //}
    form.import = {};
    //columnName：展示列名
    //columnSource：对应数据库名称
    //dataSourceType：数据源类型：1：普通input 2：基础数据 3：数据视图
    //basicDataType：如果数据源dataSourceType为2-基础数据，这个地方用于标识该字段所需要返回的值类型：1：Id，2：Value，3：Text
    //required：是否必填
    //dataType:数据类型，用于检测导入的数据是否出现值类型错误：1：Int，2：Nvarchar，3：Real，4：Bit，5：Decimal，6：DateTime
    var columns = [
              { columnName: form.$pageLang.EstLineId, columnSource: "EstLineId", dataSourceType: 1, required: true, dataType: 1 },      //是否标记
              { columnName: form.$pageLang.IsMark, columnSource: "IsMark", dataSourceType: 1, required: true, dataType: 4 },      //是否标记
              { columnName: form.$pageLang.SupplierCode, columnSource: "SupplierCode", dataSourceType: 1, required: true, dataType: 2 },      //供应商编码
              { columnName: form.$pageLang.Supplier, columnSource: "Supplier", dataSourceType: 1, required: true, dataType: 2 },              //供应商名称
              { columnName: form.$pageLang.NameDescription, columnSource: "ItemCode", dataSourceType: 1, required: true, dataType: 2 },      //品号
              { columnName: form.$pageLang.ProductDescribe, columnSource: "ItemName", dataSourceType: 1, required: true, dataType: 2 }, //品名描述
              { columnName: form.$pageLang.Currency, columnSource: "Currency", dataSourceType: 3, required: true, dataType: 2 },  //币种
              { columnName: form.$pageLang.InvoiceType, columnSource: "InvoiceType", dataSourceType: 2, basicDataType: 2, required: true, dataType: 2 },   //发票类型
              { columnName: form.$pageLang.Tax, columnSource: "Tax", dataSourceType: 2, basicDataType: 2, dataType: 2 },   //税率
              { columnName: form.$pageLang.UnitPrice, columnSource: "Price", dataSourceType: 1, required: true, dataType: 5 }, //单价
              { columnName: form.$pageLang.Quantity, columnSource: "Qty", dataSourceType: 1, required: true, dataType: 5 },  //数量
              { columnName: form.$pageLang.Delivery, columnSource: "Delivery", dataSourceType: 1, required: true, dataType: 6, dateTimeFormat: "yyyy-MM-dd" },  //交付日期
              { columnName: form.$pageLang.PaymentTerms, columnSource: "PaymentTerm", dataSourceType: 1, required: true, dataType: 2 }   //付款方式
    ];
    //加载
    form.$page_load = function () {
        form.import.base = {
            name: "yfvic_fin05_quot",
            displayAttachment: true,
            template: "PR.xls",
            allowPaged: true,
            pageSize: 20,
            validateAll: true,
            buttonName: "询价信息导入 ",
            validateFunc: function (data) {
                //是否调用自定义验证方法
                form.validateFunc(data);
            }
        };
        form.import.columns = columns;

        //if (!form.fin05est || form.fin05est.length == 0) {
        //    form.fin05est = [{}];
        //}
        //询价物资行默认和预算行一致，新增只能在行内新增
        if (form.$pageRight.EditQuot == "normal" && form.fin05quot.length == 0) {
            for (var i = 0; i < form.fin05est.length; i++) {
                var est = form.fin05est[i];
                form.fin05quot.push({
                    rowSpan: 1,
                    itemCode: est.itemName,
                    qty: est.qty,
                    currency: form.fin05.currencyType,
                    estItemId: est.id,
                    isMark: true
                });
            }
        }
        //默认报价日期
        if (form.$pageRight.EditQuot == "normal") {
            program('GetDateTime', {}, function (data) {
                if (!!data) {
                    form.fin05.quoteDate = data;
                }
            });
        }

        if (form.$nodeCode == "Start") {
            form.fin05quot = [];
        }
        //赋值
        for (var i = 0; i < form.fin05quot.length; i++) {
            for (var j = 0; j < form.fin05est.length; j++) {
                if (form.fin05quot[i].estItemId == form.fin05est[j].id) {
                    form.fin05quot[i].estLineId = form.fin05est[j].gridOrder;
                    break;
                }
            }
            form.fin05quot[i].rowSpan = 1;
        }
        form.mergeItem();

        $timeout(function () { form.sumQuot(); }, 200);
    }

    //导入数据校验供应商
    form.validateFunc = function (importData) {
        for (var i = 0; i < importData.length; i++) {
            //校验供应商是否存在
            program('CheckSupplier', { areaCode: base.areaCode, supplierCode: importData[i].supplierCode, index: i }, function (data) {
                if (!!data) {
                    if (data[0].key == "") {
                        importData[data[0].index]._ValidateError += ";供应商代码不存在";
                    }
                }
            });

            //校验行号是否存在
            var exist = false;
            for (var j = 0; j < form.fin05est.length; j++) {
                if (form.fin05est[j].gridOrder == importData[i].estLineId) {
                    importData[i].estItemId = form.fin05est[j].id;
                    exist = true; break;
                }
            }
            if (!exist) {
                importData[i]._ValidateError += "物资行号不存在";
            }
        }
    }

    form.importQuote = function (importData) {
        form.fin05quot = [];
        for (var n = 0; n < importData.length; n++) {
            datanew = importData[n];
            form.fin05quot.push({
                rowSpan: 1,
                isMark: true,
                estItemId: datanew.estItemId,
                estLineId: datanew.estLineId,
                supplierId: base.areaCode + '-' + datanew.supplierCode, //订单编号
                supplierCode: datanew.supplierCode,
                supplier: datanew.supplier, //供应商
                itemCode: datanew.itemCode, //付款方式
                itemName: datanew.itemName, //发送方式
                currency: datanew.currency, //零件号
                invoiceType: datanew.invoiceType, //币种
                tax: datanew.tax,//税率
                price: datanew.price,//单价
                qty: datanew.qty, //最小订购量
                delivery: datanew.delivery, //最小包装量
                paymentTerm: datanew.paymentTerm //产品类别
            });
        }
        form.sumQuot();
        form.mergeItem();
    }
    //合并第一列
    form.mergeItem = function () {
        for (var i = 0; i < form.fin05quot.length; i++) {
            var toprow = form.fin05quot[i];
            if (toprow.rowSpan == 0)
                continue;
            var rowspan = 1;
            for (var j = i + 1; j < form.fin05quot.length; j++) {
                var mrow = form.fin05quot[j];
                if (toprow.estItemId == mrow.estItemId) {
                    rowspan++;
                    mrow.rowSpan = 0;
                }
                else break;
            }
            toprow.rowSpan = rowspan;
        }
    }
    //新增询价行
    form.addQuoteRow = function (row) {
        var index = form.fin05quot.indexOf(row) + 1;

        form.fin05quot.splice(index, 0, {
            rowSpan: 1,
            estItemId: row.estItemId,
            estLineId: row.estLineId,
            isMark: true
        });
        form.mergeItem();
    }

    //删除询价行
    form.deleteQuoteRow = function (row) {
        if (row.rowSpan > 1)
            return;
        var count = 0;
        for (var i = 0; i < form.fin05quot.length; i++) {
            if (form.fin05quot[i].estItemId == row.estItemId) {
                count++;
            }
        }
        if (count == 1)
            return;

        var index = form.fin05quot.indexOf(row);
        form.fin05quot.splice(index, 1);

        form.mergeItem();
    }

    //计算预算
    form.calBudget = function () {
        var now = sv.dateTimeNow();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;

        _.each(form.fin05est, function (i) {
            base.$readBudget(year, month, i.costCenter, i.account, form.fin05.projCode, i.projectItemCode, function (data) {
                i.restAmount = data[0].totalAmount - data[0].usedAmount;
            });
        });
    }

    //金额计算
    form.sumEst = function () {
        _.each(form.fin05est, function (i) {
            i.subTotal = (parseFloat(i.estPrice) * parseFloat(i.qty)).getPrecision(6);
        });
        form.fin05.estTotalPrice = _$.getSumOfArray(form.fin05est, 'subTotal');//发票总金额
        form.calBudget();
    }
    form.currItems = [];
    //计算询价金额
    form.sumQuot = function () {
        var curr = [];
        form.currItems = [];
        var totPrice = 0;

        _.each(form.fin05quot, function (i) {
            var tax = (isNaN(i.tax) || i.tax == null || i.tax == "") ? 0 : i.tax;
            if (i.isTax != 1) {
                //不含税
                var costprice = isNaN(i.costPrice) ? 0 : i.costPrice;
                i.price = costprice * (1 + parseFloat(tax) / 100);
                i.price = i.price.getPrecision(6);
            }
            else {
                var price = isNaN(i.price) ? 0 : i.price;
                i.costPrice = price / (1 + parseFloat(tax) / 100);
                i.costPrice = i.costPrice.getPrecision(6);
            }
            //含税单价
            var price = isNaN(i.price) ? 0 : i.price;
            var qty = isNaN(i.qty) ? 0 : i.qty;
            var subtot = parseFloat(price) * parseFloat(qty);
            subtot = subtot * (1 + parseFloat(tax) / 100);
            i.subTotal = subtot.getPrecision(6);

            if (!!i.currency) {
                if (!!curr[i.currency])
                    curr[i.currency] += subtot;
                else
                    curr[i.currency] = subtot;
            }
            //CNY金额
            subtot = subtot * parseFloat(i.rate);
            totPrice += subtot.getPrecision(6);
        });

        for (var c in curr) {
            form.currItems.push({ currency: c, amount: curr[c].getPrecision(6) });
        }
        form.fin05.estPrice = totPrice;
    }

    form.$doValidation = function () {
        if (form.fin05est.length < 1) {
            form.fin05est.push({});
            form.$errors.push({ element: $("[name=framworkTb]"), msg: form.$pageLang.Frameby + form.$pageLang.AtLeastOne });
        }
    }
}