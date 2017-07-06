
function controller(base, form, program) {
    debugger;
    //选中资产编号
    form.chooseFixAssetId = function (row, item) {
        if (row[0] != null) {
            var josnobj = row[0];
            //alert(JSON.stringify(josnobj)) 
            item.fixAssetName = josnobj.fixAssetName;
            item.costValue = josnobj.originalValue;
            item.chiefEngineer = josnobj.orgChiefEngineerName;
            item.location = josnobj.orgLocation;
            item.equipmentNo = josnobj.equipmentNo;
            item.isEquipment = josnobj.isEquipment == "1" ? "是" : "否";
        }
    }
    //删除行
    form.delete = function () {
        var evens = _.remove(form.fin03s, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }
    //提交验证
    form.$event_submit_before = function (context) {
        if (form.fin03s.length === 0) {
            mabp.notify.warn("请填写明细数据");
            return context.$stop();
        }
        return context.$continue();
    }

    //金额求和
    form.sum = function (data) { 
        form.fin03.totalCost = _$.getSumOfArray(form.fin03s, 'costValue');
        form.fin03.totalNet  = _$.getSumOfArray(form.fin03s, 'netValue'); 
    }
}