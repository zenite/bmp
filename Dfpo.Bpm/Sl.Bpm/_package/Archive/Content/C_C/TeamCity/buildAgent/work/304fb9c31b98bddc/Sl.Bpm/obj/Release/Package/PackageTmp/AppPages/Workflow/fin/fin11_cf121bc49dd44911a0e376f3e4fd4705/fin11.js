
function controller(base, form, program) {
    debugger;
    form.fin11.location = "非生产性仓库";
    //选择类别带出科目默认值
    form.chooseAccounts = function (item) {
        debugger;
        if (!!item && item[0] != null) {
            var row = item[0];
            form.fin11.accounts = row.value;
        }
    }
    //使用部门默认选择登录人所在组织
    form.fin11.usingDept = base.applicant.groupId;
    //如果明细数据少于一行则阻止提交
    form.$event_submit_before = function (context) {
        if (form.fin11s.length ==0) {
            form.$toast("请填写明细数据");
            return context.$stop();
        }
        return context.$continue();
    }
    //明细数据全选
    form.selectAll = function (ischecked, items) {
        for (var i = 0; i < items.length; i++) items[i].checked = !!form.fin11sAllChecked;
    }

    form.delete = function () {
        var evens = _.remove(form.fin11s, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }
    form.add = function () {       
        form.fin11s.push({});
    }
    //模板导入
    form.import = {};
    form.import.base = {
        name: "yfvic_fin11_details",
        displayAttachment: true,
        template: "fin11 type template.xls", //模板地址
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
            form.fin11s.push({

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
    //根据登录人所在部门带出使用部门
    //initintor的groupid赋值到使用部门就好了
}