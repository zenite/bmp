
function controller(base, form, program) {
    
    form.changecolor = {//颜色变化类的定义
        invoiceTypeChange: "changecolor1",
        pricenetc: "changecolor1",
        numberc: "changecolor1",
        pricec: "changecolor1",
        totalAfterN: "changecolor1",
        totalAfter: "changecolor1",
        rateChange: "changecolor1",
    }
    form.aaa = function () {
        form.changecolor.totalAfter = "changecolor";
    }
    form.bbb = function () {
        form.changecolor.totalAfterN = "changecolor";
    }
    form.ccc = function () {
        form.changecolor.pricenetc = "changecolor";
    }
    form.ddd = function () {
        form.changecolor.numberc = "changecolor";
    }
    form.eee = function () {
        form.changecolor.pricec = "changecolor";
    }
    form.fff = function () {
        form.changecolor.invoiceTypeChange = "changecolor";
    }
    form.ggg = function ()                                  //税率数据改变造成的颜色的改变
    {
        form.changecolor.rateChange = "changecolor";
    }
    form.$page_load = function (){                          //颜色配值
        form.pur13.points = '蓝色：更改前数据'
        form.pur13.pointsIsChange = '红色：可更改数据'
        form.pur13.pointsWasChange = '橙色：有变更数据'
        if (form.pur13.baseTitle != "" && form.pur13.baseTitle != null) {
            base.title = form.pur13.baseTitle;
        }
    }
    form.ChangeColor = function ()                          //税率数据改变造成的颜色的改变
    {
        form.changecolor.rateChange = "changecolor";
    }
    form.choosePoNumber = function (row) {                  //选取订购单视图的Info
        debugger;
        if (!!row[0]) {
            form.changecolor.totalAfter = "changecolor1";
            form.changecolor.totalAfterN = "changecolor1";
            form.changecolor.pricenetc = "changecolor1";
            form.changecolor.numberc = "changecolor1";
            form.changecolor.pricec = "changecolor1";
            form.changecolor.invoiceTypeChange = "changecolor1";
            form.changecolor.rateChange = "changecolor1";
            program('GetPurchaseOrderInfoMain', { prSnNumber: row[0].snNumber}, function (data) {
                debugger;
                if (!!data[0]) {
                    debugger;
                                                            //主表字段赋值
                    var po = data[0];
                    form.pur13.supplierName = po.supplierName;
                    form.pur13.supplierCode = po.vendorName;
                    form.pur13.programCode = po.projectCode;
                    form.pur13.programName = po.projectName;
                    form.pur13.spotporequester = po.requester;
                    form.pur13.buyer = po.buyer;
                    form.pur13.hqorfudian = po.hqOrSubsidiary;
                    form.pur13.invoiceTypeChange = po.invoiceType;
                    if (form.pur13.invoiceTypeChange == '3E7A4766-ECCD-41E9-9F44-2590E2B31789'||form.pur13.invoiceTypeChange == 'DB876FD7-7D24-4DD8-B785-1661941C9E3E')
                    {
                        form.pur13.rate = po.invoiceRate;
                    }
                    form.pur13.total = po.total;
                    form.pur13.totalN = po.totalNet;
                    form.pur13.totalAfter = po.total;
                    form.pur13.totalAfterN = po.totalNet;
                                                              //删除明细表数据
                    debugger;
                    var evens = _.remove(form.pur13pu, function (n) {
                        return n.checked;
                    });
                                                              //查询细表数据
                    debugger;
                    program('GetPurchaseOrderInfoDetail', { taskId: po.taskId }, function (result) {
                        if (!!result[0]) {
                                                              //细表字段赋值,如果字段名不匹配，就循环赋值，匹配直接把result赋给细表对象，或者直接push,下面是循环的写法
                            _.forEach(result, function (val) {
                                form.pur13pu.push({
                                    checked: val.gridOrder,
                                    number: val.estimatedQuantity,
                                    numberc: val.estimatedQuantity,
                                    partName: val.partNumber,
                                    descritpiton: val.description,
                                    currency: val.currency,
                                    price: val.price,
                                    pricec: val.price,
                                    pricenet: val.priceNet,
                                    pricenetc: val.priceNet

                                });
                            });

                        }
                    });
                }
            });
       }
    }
    form.chooseNoAddInvoice = function () {                 //确定发票的值
        debugger;
        form.fff();
        form.changecolor.invoiceTypeChange = "changecolor";
        form.changecolor.rateChange = "changecolor";
        if (form.$state.invoiceTypeCode === '1') {
            form.pur13.rateChange = '0';
        }
        else if (form.$state.invoiceTypeCode === '2') {
            form.pur13.rateChange = null;
            debugger;
        }
    }
    form.delete = function () {                              //表格删除列
        var evens = _.remove(form.pur13pu, function (n) {
            return n.checked;
        });
        form.sum();
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }
    form.add = function () {                                 //表格添加列
        form.pur13pu.push({});
    }
    form.$event_submit_before = function (context) {
        debugger;
        form.pur13.appliactorJobId = base.jobId;
        form.pur13.belongsSubsidiary = base.areaCode;
        debugger;
        return context.$continue();

    }

    debugger;
    form.getSumThisTotalInvoice = function (item) {            //合计(含税)
        if (base.pageState === 1) {
            if (item.invoiceTypeCode === 'SpecialTicket') {
                item.taxes = ((item.taxRateCode) * item.invoiceAmount).toFixed(2);
                item.realInvoiceAmount = _$.getInt(item.invoiceAmount) + _$.getInt(item.taxes);
                form.admin08.estimatedReimbursementCost = _$.getInt(
                 _$.getSumOfArray(form.admin08invinfo, 'realInvoiceAmount')
                 );
                form.admin08.totalAccountAmount = form.admin08.estimatedReimbursementCost;
            }
        }
    }
    //细表求和
    form.sum = function () {
        
        _.forEach(form.pur13pu, function (val) {
        //   if (val.numberc != val.number) {
        //       form.changecolor.totalAfter = "changecolor";
        //   }
        //   if (val.pricec != val.price) {
        //       form.changecolor.totalAfter = "changecolor";
        //   }
        //   if (val.pricenetc != val.pricenetc) {
        //       form.changecolor.totalAfter = "changecolor";
        //   }
            val.totalPrice = _$.getMultiply(val.pricec, val.numberc);
            val.totalPriceNet = _$.getMultiply(val.pricenetc, val.numberc);
        });
        form.pur13.totalAfter = _$.getSumOfArray(form.pur13pu, 'totalPrice');//含税
        if (form.pur13.totalAfter != form.pur13.total)
        {
            form.changecolor.totalAfter = "changecolor";
        }
        form.pur13.totalAfterN = _$.getSumOfArray(form.pur13pu, 'totalPriceNet');//不含税
        if (form.pur13.totalAfterN != form.pur13.totalN)
        {
            form.changecolor.totalAfterN = "changecolor";
        }
    }
    form.$doValidation = function () {
        if ((form.pur13.totalN + form.pur13.total) < (form.pur13.totalAfter + form.pur13.totalAfterN)) {
            mabp.notify.warn("更改后总金额不能大于更改前总金额！");
        }
    }

}