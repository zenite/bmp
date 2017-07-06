
function controller(base, form, program) {
    form.$page_load = function () {
        if (form.pur15.baseTitle != "" && form.pur15.baseTitle != null) { 
            base.title = form.pur15.baseTitle;
        }

    }
    form.import = {};

    function getBuyerLeader() {
        //var result = program('GetBaseDataValue', { ID: form.pur15.selectCompany });
        var leader;
        if (form.pur15.selectCompany === "YFVIC") {
            leader = program('GetBuyerLeaderID', { JobName: '战略采购高级经理' });
            form.pur15.buyerLeader = leader;
        }
        else if (form.pur15.selectCompany === "YFVSJ") {
            leader = program('GetBuyerLeaderID', { JobName: '项目采购高级经理' });
            form.pur15.buyerLeader = leader;
        }
    }

    form.$event_submit_before = function (context) {
        
        //form.pur15.deptManager = '11E51C58-DBE4-4860-BA51-CE9DA8BB2BD2';
        //form.pur15.subManager = '5E0D94BC-0C98-4AB5-A39F-32AE4E1293F4';
        //判断是否子公司相关经理有值
        if (form.pur15.subManager == null || form.pur15.subManager === "") {
            form.pur15.isCanPass = 'Y';
        }
        else {
            form.pur15.isCanPass = 'N';
        }

        if (form.pur15d.length === 0) {
            mabp.notify.warn("请填写明细数据");
            return context.$stop();
        }

        //获取采购经理
        //getBuyerLeader();
        return context.$continue();
    }



    form.$event_agree_before = function (context) {
        debugger;
        var result = program('GetNodeName', { nodeId: base.nodeId });
        if (result === "申请人核对审批") {

            //开始更新数据
            var data = program('InsertFrameData', { SnNumber: base.snNumber, TaskID: base.taskId });
            if (data !== "Success") {
                mabp.notify.warn(data);
                return false;
            }
            //alert(base.snNumber)
            //alert(base.taskId)
            //alert(form.pur15.supplierCode)
            //alert(form.pur15.suppliername)
            //alert(form.pur15.buyer)
            //alert(form.pur15.type)
            //alert(form.pur15.startEffective)
            //alert(form.pur15.endEffective)
            //alert(form.pur15.prDept)
            //alert(form.pur15.description)
            //alert(form.pur15.description)
        }
        return context.$continue()
    }




    //获取采购经理
    //grid删除
    form.delete = function () {
        var evens = _.remove(form.pur15d, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }

    //供应商选择
    form.chooseSupplierInfo = function (row) {

        if (row[0] != null) {
            form.pur15.supplierName = row[0].registeredSupplierName; 
        }
    }


    //修改Title
    //form.chooseCompay = function (row) {
    //    //if (form.pur15.selectCompany != null && form.$pageRight.StartNode == 'normal') {
    //    //var result = program('GetBaseDataValue', { ID: form.pur15.selectCompany });
    //    if (form.pur15.selectCompany === "YFVIC") {
    //        form.pur15.baseTitle = "延锋伟世通投资有限公司框架协议审批";
    //        base.title = "延锋伟世通投资有限公司框架协议审批";
    //    }
    //    else if (form.pur15.selectCompany === "YFVSJ") {
    //        form.pur15.baseTitle = "延锋伟世通汽车电子有限公司框架协议审批";
    //        base.title = "延锋伟世通汽车电子有限公司框架协议审批";
    //    }
    //    //}
    //}

    form.$watch('form.pur15.selectCompany', function () {
        //if (form.pur15.selectCompany === "YFVIC") {
        //    form.pur15.baseTitle = "延锋伟世通投资有限公司框架协议审批";
        //    base.title = "延锋伟世通投资有限公司框架协议审批";
        //}
        //else if (form.pur15.selectCompany === "YFVSJ") {
        //    form.pur15.baseTitle = "延锋伟世通汽车电子有限公司框架协议审批";
        //    base.title = "延锋伟世通汽车电子有限公司框架协议审批";
        //}
    });

    form.$watch('base.areaCode', function () {
        form.pur15.selectCompany = base.areaCode;
    });
    //协议生效日期
    function comDate() {
        if (form.pur15.startEffective != null && form.pur15.endEffective != null) {
            debugger;
            var oDate1 = new Date(form.pur15.startEffective);
            var oDate2 = new Date(form.pur15.endEffective);
            if (oDate1.getTime() >= oDate2.getTime()) {
                mabp.notify.warn("协议结束日期不可早于协议生效日期");
                return false;
            }
            return true;
        }
        return true;
    }

    form.$watch('form.pur15.startEffective', function () {
        debugger;
        if (!comDate()) {
            form.pur15.startEffective = null;
        }
    });


    //协议结束日期
    form.$watch('form.pur15.endEffective', function () {
        if (!comDate()) {
            form.pur15.endEffective = null;
        }

    });

    //协议日期比较
    //form.$watch('base.applicant.employeeNumber', function () {
    //    if (base.applicant.employeeNumber != null) {
    //        program("GetApplyInfo", { EmployeeNumber: base.applicant.employeeNumber },
    //        function (Info) {
    //            alert(Info[0].leaderName)
    //            alert(Info[0].CellPhone)
    //        });
    //    }
    //});

    form.getlength = function (data) {
        debugger;
        form.$timeout(function () {
            if (!!data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    debugger;
                    //获取币种ID
                    var result = program('GetCurrency', { data: data[i].currency });
                    //var result = program('GetBaseDataId', { data: data[i].currency, parentId: 'Currency' });
                    if (result == "" || result == null) {
                        mabp.notify.warn("第"+(i+1)+"行币种数据格式不正确！");
                        break;
                    }
                    data[i].currency = result;
                    //获取是否ID
                    //result = program('GetBaseDataId', { data: data[i].tax, parentId: 'YesOrNo' });
                    result = program('GetBaseDataId', { data: data[i].tax, parentId: 'C9080375-B201-41F3-BE58-D690FABA5A30' });
                    if (result == "" || result == null) {
                        mabp.notify.warn("第" + (i + 1) + "行是否含税数据格式不正确！");
                        break;
                    }
                    data[i].tax = result;
                    if (isNaN(data[i].price)) {
                        mabp.notify.warn("第" + (i + 1) + "行单价数据格式不正确！");
                        break;
                    }
                    data[i].price = parseFloat(data[i].price);
                    form.pur15d.push(data[i]);
                }
            }
        });
    }

    form.import.base = {
        name: "yfvic_pur15_framework_agreement_detail",
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
              { columnName: form.$pageLang.Currency, columnSource: "Currency", dataSourceType: 3, basicDataType: 1, required: true, dataType: 2 },          //币种
              { columnName: form.$pageLang.Tax, columnSource: "Tax", dataSourceType: 2, basicDataType: 1, required: true, dataType: 2 },  //是否含税
              { columnName: form.$pageLang.Price, columnSource: "Price", dataSourceType: 1, basicDataType: 2, required: true, dataType: 5 }              //单价
    ];
    form.importD = function (importData) {
        for (var i = 0; i < importData.length; i++) {

            if (importData[i]._ValidateError != "" && importData[i]._ValidateError != null) {
                continue;
            }
            form.pur15d.push({

                product: importData[i].product,
                productionDescription: importData[i].productionDescription,
                currency: importData[i].currency,
                tax: importData[i].tax,
                price: importData[i].price
            });
        }

    }
    //ng-click="form.add()"
    //form.add = function () { 
    //    form.yfvicp15fad.push({
    //        $edit: true,
    //        product: null,
    //        productiondescription: null,
    //        currency: null,
    //        tax: null,
    //        price: null,
    //        lastyearunitprice:null
    //    });
    //}

}