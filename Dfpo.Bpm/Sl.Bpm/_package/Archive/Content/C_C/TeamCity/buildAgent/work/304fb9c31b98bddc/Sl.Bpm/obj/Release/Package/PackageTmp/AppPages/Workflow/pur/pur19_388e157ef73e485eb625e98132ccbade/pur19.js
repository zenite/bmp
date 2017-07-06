
function controller(base, form, program) {
    var loadcount = 0;
    var loadcountSelectCompany = 0;
    form.import = {};
    form.$page_load = function () {
        form.pur19.points = 'Before 更改前数据'
        form.pur19.pointsAfter = 'After 更改后数据'
        if (form.pur19.baseTitle != "" && form.pur19.baseTitle != null) {
            base.title = form.pur19.baseTitle;
        }
        //if (form.pur19.selectCompany != "" && form.pur19.selectCompany != null) {
        //    form.pur19.selectCompany = program('GetArea', { userID: base.applicant.userId, groupId: base.applicant.groupId });
        //    base.areaCode = form.pur19.selectCompany;
        //}
        
    }
    form.$event_agree_before = function (context) {
        debugger;
        var result = program('GetNodeName', { nodeId: base.nodeId });
        if (result === "申请人核对") {

            //开始更新数据
            var data = program('InsertFrameData', { SnNumber: form.pur19.selectFrameworkAgree, TaskID: base.taskId, keepType: form.pur19.keepType });
            if (data !== "Success") {
                mabp.notify.warn(data);
                return false;
            }
        }
        return context.$continue()
    }
    base.submit = function (btn) {
        if (form.$pageRight.StartNode == 'normal') {

            var isValidate = that.validate($scope);
            if (!isValidate) return;
            if ((form.pur19.startEffectiveAfter != null && form.pur19.startEffectiveAfter != "") || (form.pur19.endEffectiveAfter != null && form.pur19.endEffectiveAfter != "")) {
                if (form.pur19.startEffectiveAfter == null || form.pur19.startEffectiveAfter == "") {
                    mabp.notify.warn("请填写协议生效日期");
                    return false;
                }
                if (form.pur19.endEffectiveAfter == null || form.pur19.endEffectiveAfter == "") {
                    mabp.notify.warn("请填写协议结束日期");
                    return false;
                }
            }

            if (form.pur19faud.length == 0) {
                mabp.notify.warn("请填写明细数据");
                return false;
            }
        }
        that.submit(btn, $scope, function () {
            base.close(true);
        });

    }
    form.$event_submit_before = function (context) {
        debugger;







        //form.pur19.deptManager = '11E51C58-DBE4-4860-BA51-CE9DA8BB2BD2'
        //form.pur19.subManager = '5E0D94BC-0C98-4AB5-A39F-32AE4E1293F4'
        //判断是否子公司相关经理有值
        if (form.pur19.subManager == null || form.pur19.subManager == "") {
            form.pur19.isCanPass = 'Y'
        }
        else {
            form.pur19.isCanPass = 'N'
        }
        //获取采购经理
        //GetBuyerLeader()
        return context.$continue()
    }


    //获取采购经理
    function GetBuyerLeader() {
        //var result = program('GetBaseDataValue', { ID: form.pur19.selectCompany })
        if (form.pur19.selectCompany == "YFVIC") {
            var leader = program('GetBuyerLeaderID', { JobName: '战略采购高级经理' })
            form.pur19.buyerLeader = leader
        }
        else if (form.pur19.selectCompany == "YFVSJ") {
            var leader = program('GetBuyerLeaderID', { JobName: '项目采购高级经理' })
            form.pur19.buyerLeader = leader
        }
    }



    //修改Title
    //form.chooseCompay = function (row) {
    //    debugger 
    //    //var result = program('GetBaseDataValue', { ID: form.pur19.selectCompany }) 
    //    if (form.pur19.selectCompany == "YFVIC") {
    //        form.pur19.baseTitle = "延锋伟世通投资有限公司框架协议更新流程";
    //        base.title = "延锋伟世通投资有限公司框架协议更新流程";
    //    }
    //    else if (form.pur19.selectCompany == "YFVSJ") {
    //        form.pur19.baseTitle = "延锋伟世通汽车电子有限公司框架协议更新流程";
    //        base.title = "延锋伟世通汽车电子有限公司框架协议更新流程"
    //    }
    //    if (base.pageState == 3 || ((base.pageState == 2 && form.$pageRight.StartNode != 'normal'))) {
    //        return false;
    //    }
    //    if (base.pageState == 2 && form.$pageRight.StartNode == 'normal' && loadcountSelectCompany <2) {
    //        loadcountSelectCompany = 1 + loadcountSelectCompany;
    //        return false;
    //    }
    //    form.pur19.supplierCode = null;
    //    form.pur19.supplierName = null;
    //    form.pur19.buyer = null;
    //    form.pur19.buyerName = null;
    //    form.pur19.typeName = null;
    //    form.pur19.type = null;
    //    form.pur19.startEffective = null;
    //    form.pur19.endEffective = null;
    //    form.pur19.prDept = null;
    //    form.pur19.prDeptCode = null;
    //    form.pur19.description = null;
    //    form.pur19.keepType = null;
    //    form.pur19.linkTaskId = null;
    //    form.pur19.selectFrameworkAgree = null;
    //    //删除明细数据
    //    _.remove(form.pur19faud, function (n) {
    //        if (form.pur19faud.length > 0) {

    //        }
    //        for (var i = 0; i < form.pur19faud.length;) {
    //            if (form.pur19faud[i].currencyCode != null) {
    //                form.pur19faud.remove(i)
    //            }
    //            else {
    //                i++
    //            }
    //        }
    //    });
    //}



    form.$watch('form.pur19.selectCompany', function () {
        //if (form.pur19.selectCompany == "YFVIC") {
        //    form.pur19.baseTitle = "延锋伟世通投资有限公司框架协议更新流程";
        //    base.title = "延锋伟世通投资有限公司框架协议更新流程";
        //}
        //else if (form.pur19.selectCompany == "YFVSJ") {
        //    form.pur19.baseTitle = "延锋伟世通汽车电子有限公司框架协议更新流程";
        //    base.title = "延锋伟世通汽车电子有限公司框架协议更新流程"
        //}
        debugger;
        if (base.pageState == 3 || ((base.pageState == 2 && form.$pageRight.StartNode != 'normal'))) {
            return false;
        }
        if ((base.pageState == 2 || base.pageState == 1) && form.$pageRight.StartNode == 'normal' && loadcountSelectCompany < 2) {
            loadcountSelectCompany = 1 + loadcountSelectCompany;
            return false;
        }
        form.pur19.supplierCode = null;
        form.pur19.scId = null;
        form.pur19.supplierName = null;
        form.pur19.buyer = null;
        form.pur19.buyerName = null;
        form.pur19.typeName = null;
        form.pur19.type = null;
        form.pur19.startEffective = null;
        form.pur19.endEffective = null;
        form.pur19.prDept = null;
        form.pur19.prDeptCode = null;
        form.pur19.description = null;
        form.pur19.keepType = null;
        form.pur19.linkTaskId = null;
        form.pur19.selectFrameworkAgree = null;
        //删除明细数据
        _.remove(form.pur19faud, function (n) {
            if (form.pur19faud.length > 0) {

            }
            for (var i = 0; i < form.pur19faud.length;) {
                if (form.pur19faud[i].currencyCode != null) {
                    form.pur19faud.remove(i)
                }
                else {
                    i++
                }
            }
        });
    });


    form.$watch('base.areaCode', function () {
        //var result = program('GetArea', { userID: base.applicant.userId, groupId: base.applicant.groupId }); 
        //if (base.areaCode != result && base.areaCode != null) {
        //    base.areaCode = result;
        //    mabp.notify.warn("申请人公司与所选公司不一致！");
            
        //}
        form.pur19.selectCompany = base.areaCode;
    });



    //框架协议选择
    form.chooseSelectFrameworkAgree = function (row) {
        if (row[0] != null) {

            form.pur19.linkTaskId = row[0].taskId;

            if (base.pageState == 3 || ((base.pageState == 2 && form.$pageRight.StartNode != 'normal'))) {
                return false;
            }
            if ((base.pageState == 2 || base.pageState == 1) && form.$pageRight.StartNode == 'normal' && loadcount == 0) {
                loadcount = 1;
                return false;
            }
            form.pur19.supplierCode = row[0].supplierCode;
            form.pur19.supplierName = row[0].supplierName;
            form.pur19.buyer = row[0].buyer;
            form.pur19.buyerName = row[0].buyerName;
            form.pur19.typeName = row[0].typeName;
            form.pur19.type = row[0].type;
            form.pur19.startEffective = row[0].sartEffective;
            form.pur19.endEffective = row[0].endEffective;
            form.pur19.prDept = row[0].prDeptName;
            form.pur19.prDeptCode = row[0].prDept;
            form.pur19.description = row[0].description;
            form.pur19.keepType = row[0].keepType;
            form.pur19.scId = row[0].scId;
            Array.prototype.remove = function (dx) {
                if (isNaN(dx) || dx > this.length) { return false; }
                for (var i = 0, n = 0; i < this.length; i++) {
                    if (this[i] != this[dx]) {
                        this[n++] = this[i]
                    }
                }
                this.length -= 1
            }
            //删除明细数据
            _.remove(form.pur19faud, function (n) {
                if (form.pur19faud.length > 0) {

                }
                for (var i = 0; i < form.pur19faud.length;) {
                    if (form.pur19faud[i].currencyCode != null) {
                        form.pur19faud.remove(i)
                    }
                    else {
                        i++
                    }
                }
            });
            //获取明细数据 
            var result = program('GetFraAgr', { ID: row[0].idhide })
            var Data = eval('(' + result + ')')
            for (var i = 0; i < Data.Table1.length; i++) {
                form.pur19faud.push({
                    $edit: true,
                    product: Data.Table1[i].Product,
                    productionDescription: Data.Table1[i].ProductionDescription,
                    currencyCode: Data.Table1[i].Currency,
                    currency: Data.Table1[i].CurrencyName,
                    taxCode: Data.Table1[i].Tax,
                    tax: Data.Table1[i].TaxName,
                    price: Data.Table1[i].Price,
                    lastyearunitprice: Data.Table1[i].Lastyearunitprice,
                    currencyAfter: null,
                    taxAfter: null,
                    priceAfter: null

                });


            }
            //debugger;


        }
    }
    //form.getlength = function (data) {
    //    debugger;
    //    form.$timeout(function () {
    //        if (!!data && data.length > 0) {
    //            for (var i = 0; i < data.length; i++) {
    //                debugger;
    //                //获取币种ID
    //                var result = program('GetCurrency', { data: data[i].currency });
    //                if (result == "" || result == null) {
    //                    mabp.notify.warn("第" + (i + 1) + "行币种数据格式不正确！");
    //                    break;
    //                }
    //                //var result = program('GetBaseDataId', { data: data[i].currency, parentId: 'Currency' });
    //                data[i].currency = result;
    //                //获取是否ID
    //                //result = program('GetBaseDataId', { data: data[i].tax, parentId: 'YesOrNo' });
    //                result = program('GetBaseDataId', { data: data[i].tax, parentId: 'C9080375-B201-41F3-BE58-D690FABA5A30' });
    //                if (result == "" || result == null) {
    //                    mabp.notify.warn("第" + (i + 1) + "行是否含税数据格式不正确！");
    //                    break;
    //                }
    //                data[i].tax = result;
    //                data[i].price = parseFloat(data[i].price);
    //                if (isNaN(data[i].price)) {
    //                    mabp.notify.warn("第" + (i + 1) + "行单价数据格式不正确！");
    //                    break;
    //                }
    //                form.pur19faud.push(data[i]);
    //            }
    //        }
    //    });
    //}

    //grid删除
    form.delete = function () {
        var evens = _.remove(form.pur19faud, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }
    form.import.base = {
        name: "yfvic_pur19_framework_agreement_update_detail",
        displayAttachment: true,
        template: "Frame Type Template.xls",
        allowPaged: true,
        pageSize: 10,
        validateAll: false,
        buttonName: "模版下载导入"
    };

    form.import.columns = [
              { columnName: form.$pageLang.Product, columnSource: "Product", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },      //品名
              { columnName: form.$pageLang.ProductionDescription, columnSource: "ProductionDescription", dataSourceType: 1, basicDataType: 2, required: false, dataType: 2 },      //品名描述
              { columnName: form.$pageLang.Currenc, columnSource: "Currency", dataSourceType: 3, basicDataType: 1, required: true, dataType: 2 },          //币种
              { columnName: form.$pageLang.Ta, columnSource: "Tax", dataSourceType: 2, basicDataType: 1, required: true, dataType: 2 },  //是否含税
              { columnName: form.$pageLang.Pric, columnSource: "Price", dataSourceType: 1, basicDataType: 2, required: true, dataType: 5 }              //单价
    ];
    form.importD = function (importData) {
        for (var i = 0; i < importData.length; i++) {

            if (importData[i]._ValidateError != "" && importData[i]._ValidateError != null) {
                continue;
            }
            form.pur19faud.push({

                product: importData[i].product,
                productionDescription: importData[i].productionDescription,
                currency: importData[i].currency,
                tax: importData[i].tax,
                price: importData[i].price
            });
        }

    }
    form.open = function () {
        if (form.pur19.linkTaskId != null) {
            var result = program('GetWorkFlowInfo', { TaskID: form.pur19.linkTaskId })
            window.open("/SysPages/AppPage/" + result);
        }
    }

    //协议生效日期
    form.$watch('form.pur19.startEffectiveAfter', function () {
        if (!ComDate()) {
            form.pur19.startEffectiveAfter = null

        }
    });


    //协议结束日期
    form.$watch('form.pur19.endEffectiveAfter', function () {
        if (!ComDate()) {
            form.pur19.endEffectiveAfter = null
        }

    });

    //协议日期比较
    function ComDate() {
        if (form.pur19.startEffectiveAfter != null && form.pur19.endEffectiveAfter != null) {
            debugger;
            var oDate1 = new Date(form.pur19.startEffectiveAfter);
            var oDate2 = new Date(form.pur19.endEffectiveAfter);
            if (oDate1.getTime() >= oDate2.getTime()) {
                mabp.notify.warn("协议结束日期不可早于协议生效日期");
                return false;
            }
            return true;
        }
        return true;
    }



}