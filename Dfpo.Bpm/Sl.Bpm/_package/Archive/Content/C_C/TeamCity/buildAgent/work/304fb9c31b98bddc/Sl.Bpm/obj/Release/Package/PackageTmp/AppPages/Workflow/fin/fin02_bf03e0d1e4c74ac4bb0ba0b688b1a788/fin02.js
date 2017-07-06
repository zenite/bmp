
function controller(base, form, program) {
   
    //选中资产编号
    form.chooseFixAssetId = function (row, item) {
        if (row[0] != null) {
            var josnobj = row[0];
            //alert(JSON.stringify(josnobj));   
            item.fixAssetId = josnobj.id;
            item.fixAssetName = josnobj.fixAssetName;
            item.equipmentNo = josnobj.equipmentNo;
            item.orgChiefEngineer = josnobj.orgChiefEngineer;
            item.orgDepartment = josnobj.orgDepartment;
            item.orgChiefEngineerName = josnobj.orgChiefEngineerName;
            item.orgDepartmentName = josnobj.orgDepartmentName;
            item.orgLocation = josnobj.orgLocation;
        }
    }
    //删除行
    form.delete = function () {
        var evens = _.remove(form.fin02c, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }
    //提交验证
    form.$event_submit_before = function (context) {
        if (form.fin02c.length === 0) {
            mabp.notify.warn("请填写明细数据");
            return context.$stop();
        }
        return context.$continue();
    }
    form.selectjob = function (selectItem, item) {
        debugger;
        if (selectItem.length > 0) {
            program("GetGroup", { jobid: (selectItem[0].id || "") },
       function (linemanagers) {
           debugger;
           item.newDepartment = linemanagers;
         
       });
        }

    }
}