 
function controller(base, form, program) {
    
    if (form.$nodeCode == 'ND01' && base.taskId == undefined) {
        form.pur06det.push({});
 
    }
    
    //提交验证
    form.$event_agree_before = function (context) {
        debugger;
        if (context.btn.name == "提交给下一步") {
            form.pur06.agreeType = "2";
        } else if (context.btn.name == "提交给自己") {
            form.pur06.agreeType = "1";
        }
        return context.$continue();
    }


    form.AllProjectNumbers = function (row) {
        if (row[0] != null) {
            form.pur06.programName = row[0].projectDesc;
        }
    }
    form.chooseSupplierCode = function (row) {
        if (row[0] != null) {
            form.pur06.supplier = row[0].text;
        }
    }
    form.add = function () {
        form.pur06det.push({});
    }
    form.delete = function () {
        var evens = _.remove(form.pur06det, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        var totalQuantity = 0.0;
        angular.forEach(form.pur06det, function (data, index, array) {
            if (data.partQuantity != undefined) {
                totalQuantity += parseFloat(data.partQuantity);
            }
        });
        form.pur06.totalParts = totalQuantity;
    }
    form.Calc = function (items) {
        var totalQuantity = 0.0;
        angular.forEach(form.pur06det, function (data, index, array) {
            if (data.partQuantity != undefined) {
                totalQuantity += parseFloat(data.partQuantity);
            }
        });
        form.pur06.totalParts = totalQuantity;
    }
    form.SetComplaintNumRequired = function (items) {
        debugger;
        if (items[0].value == "2") {//客户书面投诉则显示且必填
            form.pur06.isNeedRequied = "2";
        } else {
            form.pur06.isNeedRequied = "1";
            form.pur06.writtenComplaintNum = "";
        }
    }

 
    
}