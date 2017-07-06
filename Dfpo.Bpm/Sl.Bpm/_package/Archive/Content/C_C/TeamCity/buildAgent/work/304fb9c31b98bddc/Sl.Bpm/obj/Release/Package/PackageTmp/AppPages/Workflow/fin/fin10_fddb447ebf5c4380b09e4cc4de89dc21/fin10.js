
function controller(base, form, program) {
    //根据项目编号带出项目经理
    //var chargeCustomer = form.fin10.chargeCustomer;
    form.chooseProjectManager = function (item) {
        debugger;
        if (!!item && item[0] != null) {
            var row = item[0];
            form.fin10.projectManager = row.projectManagerJobId;
        }
    }
   //form.fin10.projectManager = row.userName;
    form.fin10.usingDept = base.initiator.groupId;
    form.$event_submit_before = function (context) {
        //如果明细数据少于一行则阻止提交
        if (form.fin10s.length == 0) {
            form.$toast("请填写明细数据")
            return context.$stop();
        }
        return context.$continue();
    }
    //判断申领数与实领数
    //form.$event_submit_before = function (context) {
    //    debugger;
    //    var num1 = form.fin10s.reqQty;
    //        var num2 = form.fin10s.actQty;
    //        if (num1 <= num2) {
    //            form.$toast("实领数不能大于申领数！")
    //            return context.$stop();
    //        }
    //        return context.$continue();   
    //}
     //明细数据全选
    form.selectAll = function (ischecked, items) {
        for (var i = 0; i < items.length; i++) items[i].checked = !!form.fin10sAllChecked;
    }
    form.delete = function () {
        debugger;
        var evens = _.remove(form.fin10s, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }
    form.add = function () {
        debugger;
        form.fin10s.push({});
        
    }
    //模板导入
    form.import = {};
    form.import.base = {
        name: "yfvic_fin10_details",
        displayAttachment: true,
        template: "fin10 type template.xls", //模板地址
        allowPaged: true,
        pageSize: 10,
        validateAll: false,
        buttonName: "模版下载导入"
    }

    form.import.columns = [
              { columnName: form.$pageLang.PartNo, columnSource: "PartNo", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },      //零件号
              { columnName: form.$pageLang.PartName, columnSource: "PartName", dataSourceType: 1, basicDataType: 2, required: true, dataType: 2 },      //零件名称
              { columnName: form.$pageLang.ReqQty, columnSource: "ReqQty", dataSourceType: 1, basicDataType: 2, required: true, dataType: 5 },          //零件数量
              //{ columnName: form.$pageLang.whLocation, columnSource: "whLocation", dataSourceType: 1, basicDataType: 2, required: false, dataType: 2 },  //库位
              //{ columnName: form.$pageLang.LotNo, columnSource: "LotNo", dataSourceType: 1, basicDataType: 2, required: false, dataType: 2 },             //批号
              //{ columnName: form.$pageLang.ActQty, columnSource: "ActQty", dataSourceType: 1, basicDataType: 2, required: false, dataType: 2 },  //实领数
              { columnName: form.$pageLang.UseApplication, columnSource: "UseApplication", dataSourceType: 1, basicDataType: 2, required: false, dataType: 2 }              //用途
    ]
    form.importD = function (importData) {
        for (var i = 0; i < importData.length; i++) {

            if (importData[i]._ValidateError != "" && importData[i]._ValidateError != null) {
                continue;
            }
            form.fin10s.push({

                partNo: importData[i].partNo,
                partName: importData[i].partName,
                reqQty: importData[i].reqQty,
                //whLocation: importData[i].whLocation,
                //lotNo: importData[i].lotNo,
                //actQty: importData[i].actQty,
                useApplication: importData[i].useApplication
            })
        }

    }

    //根据新品分类带出账号
    form.chooseAccounts = function (item) {
        debugger;
        if (!!item && item[0] != null) {
            var row = item[0];
            form.fin10.accounts = row.value;
        }
    }
}