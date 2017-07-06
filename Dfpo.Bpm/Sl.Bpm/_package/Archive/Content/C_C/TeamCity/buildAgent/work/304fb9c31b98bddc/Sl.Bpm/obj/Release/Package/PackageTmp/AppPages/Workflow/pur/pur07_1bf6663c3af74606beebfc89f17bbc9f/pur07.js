
function controller(base, form, program) {
    debugger;
    var pur07D = {
        allpur07: [],
        newpur7d: [],
        usedToal: [],
        yfvic: 0,
        yfvsj: 0,
        yfvi: 0
    };
    form.supplierType = false;
    var note = 0;
    form.import = {};
    //columnName：展示列名
    //columnSource：对应数据库名称
    //dataSourceType：数据源类型：1：普通input 2：基础数据 3：数据视图
    //basicDataType：如果数据源dataSourceType为2-基础数据，这个地方用于标识该字段所需要返回的值类型：1：Id，2：Value，3：Text
    //required：是否必填
    //dataType:数据类型，用于检测导入的数据是否出现值类型错误：1：Int，2：Nvarchar，3：Real，4：Bit，5：Decimal，6：DateTime
    var columns = [
              { columnName: form.$pageLang.PoNo, columnSource: "PONo", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },              //采购订单
              { columnName: form.$pageLang.ItemNumber, columnSource: "ItemNumber", dataSourceType: 1, basicDataType: 2, required: false, dataType: 2 },      //物料编号（零件号）
              { columnName: form.$pageLang.TotalUnitPrice, columnSource: "TotalUnitPrice", dataSourceType: 1, basicDataType: 2, required: true, dataType: 5 },      //更新产品总单价
              { columnName: form.$pageLang.ChangeReason, columnSource: "PriceChangeReason", dataSourceType: 2, basicDataType: 1, required: false, dataType: 2 }         //变更原因
    ];
// ReSharper disable once NativeTypePrototypeExtending
    Array.prototype.remove = function (val) {
        //var index = this.indexOf(val);
        //if (index > -1) {
        //    this.splice(index, 1);
        //}
        if (isNaN(val) || val > this.length) {
            return false;
        }
        for (var i = 0, n = 0; i < this.length; i++) {
            if (this[i] !== this[val]) {
                this[n++] = this[i];
            }
        }
        this.length -= 1;
    }
    //var totalUnitPrice;
    form.$page_load = function () {

        //displayAttachment：上传的附件是否展示，默认不展示
        //validateAll：在导入面板中的数据是否通过所有基础验证才可以保存，默认是
        form.import.base = {
            name: "yfvic_pur07_poinfo_details",
            displayAttachment: false,
            template: "SchedulePOupdate.xls",
            allowPaged: true,
            pageSize: 10,
            validateAll: true,
            buttonName: "年度价格更新模板导入 ",
            validate: { changeColumn: "TotalUnitPrice", requiredColumn: "PriceChangeReason", _ValidateError: "", _ValidateWarning: "" },
            validateFunc: function (data) {              //是否调用自定义验证方法
                form.validateFunc(data);
            }
        };

        form.import.columns = columns;
        if (form.pur07d.length > 0) {
            for (var i = 0; i < form.pur07d.length; i++) {
                var data = form.pur07d[i];
                var color = form.totalUnitPrice(data.totalUnitPrice, data.usedTotalUnitPrice);
                data.bgcolor = color ? "changecolor" : "pur07yelloy";
                if (color === "1") {
                    data.bgcolor = "";
                }
                data.totalType = parseFloat(data.totalUnitPrice) !== parseFloat(data.usedTotalUnitPrice) ? true : false;
            }
        }
    }
    form.validateFunc = function (importData) {
        var n = 0;
        var t = false;
        var x = 0;

      
        for (var i = 0; i < importData.length; i++) {
            for (var j = 0; j < pur07D.allpur07.length; j++) {
                if ((importData[i].poNo === pur07D.allpur07[j].snNumber) ||
                    (importData[i].poNo.substring(10, importData[i].poNo.length) === pur07D.allpur07[j].snNumber).substring(10, pur07D.allpur07[j].snNumber.length)) {
                    n++;
                    t = parseFloat(importData[i].totalUnitPrice)  !== parseFloat(pur07D.allpur07[j].totalUnitPrice) && importData[i].priceChangeReason === null ? true : false;
                    break;
                }
            }
            if (n === 0) {
                importData[i]._ValidateError += "单号不存在，请核实单号信息;";
            }
            if (t) {
                importData[i]._ValidateError += "产品总单价有更新价格改变原因必填;\n\r";
            }
            for (var k = 0; k < importData.length; k++) {
                if (importData[i].poNo === importData[k].poNo) {
                    x++;
                }
            }
            if (x > 1) {
                importData[i]._ValidateError += "单号重复，请核实单号信息;";
            }
            x = 0;
        }
    }

    form.importD = function (importData) {
        var color = false;
        if (form.pur07d.length > 0) {
            for (var i = 0; i < form.pur07d.length; i++) {
                var data = form.pur07d[i];
                color = form.totalUnitPrice(data.totalUnitPrice, data.usedTotalUnitPrice);
                data.bgcolor = color ? "changecolor" : "pur07yelloy";
                if (color === "1") {
                    data.bgcolor = "";
                }
                data.totalType = data.totalUnitPrice !== data.usedTotalUnitPrice ? true : false;
                for (var j = 0; j < importData.length; i++) {
                    var item = importData[j];
                    if (data.poNo === item.poNo) {
                        form.pur07d[i].effDate = item.effDate;
                        form.pur07d[i].itemNumber = item.itemNumber;
                        form.pur07d[i].priceChangeReason = item.priceChangeReason;
                        form.pur07d[i].totalUnitPrice = parseFloat(item.totalUnitPrice).toFixed(2);
                        _.remove(importData, { poNo: item.poNo });
                        break;
                    }
                }
            }
        }
        if (importData.length > 0) {
            for (var n = 0; n < importData.length; n++) {
                var itemd = importData[n];
                for (var k = 0; k < pur07D.allpur07.length; k++) {
                    if (pur07D.allpur07[k].snNumber === importData[n].poNo) {
                        var datanew = pur07D.allpur07[k];
                        color = form.totalUnitPrice(importData[n].totalUnitPrice, pur07D.allpur07[k].totalUnitPrice);
                        var bgcolor = color ? "changecolor" : "pur07yelloy";
                        if (color === "1") {
                            bgcolor = "";
                        }
                        form.pur07d.push({
                            mark: false,
                            bgcolor: bgcolor,
                            poNo: datanew.snNumber, //订单编号
                            supplier: datanew.supplierCode, //供应商
                            usedPaymentTerm: datanew.paymentTerm, //付款方式
                            usedDeliveryTerm: datanew.deliveryTerm, //发送方式
                            itemNumber: datanew.partNumber, //零件号
                            usedPartDescription: datanew.partDescription, //品名
                            currency: datanew.currency, //币种
                            usedTotalUnitPrice: datanew.totalUnitPrice === 0 || null ? "0" : datanew.totalUnitPrice, //总价
                            usedLeadTime: datanew.leadTime === 0 || null || "" ? "0" : datanew.leadTime, //交期
                            usedMoq: datanew.moq, //最小订购量
                            usedMpq: datanew.mpq, //最小包装量
                            commodity: datanew.commodity, //产品类别
                            usedCommodity:datanew.usedCommodity,//旧产品类别
                            usedEffDate: datanew.effectiveDate, //生效日期
                            typeid: datanew.id,
                            totalType: false,
                            paymentTerm: itemd.paymentTerm,
                            deliveryTerm: itemd.deliveryTerm,
                            partDescription: itemd.partDescription,
                            totalUnitPrice: itemd.totalUnitPrice,
                            leadTime: itemd.leadTime,
                            moq: itemd.moq,
                            mpq: itemd.mpq,
                            effDate: itemd.effDate,
                            priceChangeReason: itemd.priceChangeReason
                        });
                        form.pur07.itemSupplier = form.pur07.itemSupplier + "," + datanew.id;
                        break;
                    }
                }
            }
        }

    }
    form.$watch('base.areaCode', function () {
        form.pur07.selectCompany = base.areaCode;
        form.selectCompany = base.areaCode;
        if (base.pageStatus === 1) {
            if (form.pur07d.length > 0) {
                form.pur07.itemSupplier = "";
                form.pur07d = [];
                return;
            }
            //form.pur07d = null;
            if (!base.areaCode) {
                pur07D.newpur7d = [];
                return;
            }
        }


        program('GetDataTable', { areaCode: base.areaCode }, function (data) {
            pur07D.allpur07 = !!data ? data : [];
        });

    });
    form.chooseS = function (item) {
        var color = form.totalUnitPrice(item.totalUnitPrice, item.usedTotalUnitPrice);
        item.bgcolor = color ? "changecolor" : "pur07yelloy";
        if (color === "1") {
            item.bgcolor = "";
        }
        item.totalType = parseFloat(item.totalUnitPrice) !== parseFloat(item.usedTotalUnitPrice) ? true : false;
    }

    form.totalUnitPrice = function (newToal, usedToal) {
        var b = parseFloat(newToal);
        var c = parseFloat(usedToal);

 
        if (b === c) {
            return false;
        }
        //var price = (newToal - usedToal) / usedToal;
        var price = (b - c) / b;
        if (price * 100 >= 10 || price * 100 <= (-10)) {
            return true;
        }
  
        return "1";
    }

    //form.$event_submit_before = function () {

    //}

    //点击订单信息 
    form.chooseSupplier = function (selectItem) {
        //退回发起人和审批时阻止事件冒泡
        if (!!base.taskId && base.pageStatus !== 1) {
            if (note++ === 2) {
                return;
            }
        }
        form.supplierType = false;
        if (selectItem.length > 0 && !!selectItem) {
            //filter代替for循环
            _.filter(selectItem, function (data) {
                //判断订单是否存在
                var exist = _.findIndex(form.pur07d, { typeid: data.id }) < 0;
                //不存在push,存在不push
                if (exist) {
                    form.pur07d.push({
                        mark: false,
                        poNo: data.snNumber, //订单编号
                        supplier: data.supplierCode, //供应商
                        usedPaymentTerm: data.paymentTerm, //付款方式
                        usedDeliveryTerm: data.deliveryTerm, //发送方式
                        itemNumber: data.partNumber, //零件号
                        usedPartDescription: data.partDescription, //品名
                        currency: data.currency, //币种
                        usedTotalUnitPrice: data.totalUnitPrice === 0 || null ? "0" : data.totalUnitPrice, //总价
                        usedLeadTime: data.leadTime === 0 || null || "" ? "0" : data.leadTime, //交期
                        usedMoq: data.moq, //最小订购量
                        usedMpq: data.mpq, //最小包装量
                        usedCommodity: data.commodity, //产品类别
                        usedEffDate: data.effectiveDate, //生效日期
                        typeid: data.id,
                        bgcolor: "",
                        totalType: false
                    });
                }

            });
            _.filter(form.pur07d, function (data) {
                if (!!data) {
                    var exist = _.findIndex(selectItem, { id: data.typeid }) < 0;
                    if (exist) {
                        data.removeCheck = true;
                    }
                }
            });
            _.remove(form.pur07d, { removeCheck: true });
            pur07D.newpur7d = selectItem;
        } else {
            if (note !== 1) {
                pur07D.newpur7d = [];
                form.pur07d = [];
            }
        }
    }

    form.add = function () {
        if (base.areaCode == undefined) {
            form.$alert("请选择所属公司");
            return false;
        }
        form.pur07d.push({});
    }
    //form.getlength = function (selectItem) {
    //    var a = selectItem;
    //}
    form.delete = function () {
        debugger;
        var fmModel = form.pur07.itemSupplier.split(",");
        var evens = _.remove(form.pur07d, function (n) {
            if (n.mark) {
                for (var i = 0; i < fmModel.length; i++) {
                    if (n.typeid === fmModel[i]) {
                        fmModel.remove(i);
                    }
                }
            }
            return n.mark;
        });
        form.pur07.itemSupplier = fmModel.join(",");
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }
    form.$event_submit_before = function (context) {
        if (form.pur07d.length > 0) {
            form.$confirm('请对异色价格进一步确认！！', '确认', function(isConfirmed) {
                if (isConfirmed) {
                    return context.$continue();
                }
            });
        } else {
            form.$alert("请填写更新订单信息！");
            return false;
        }

    }


}