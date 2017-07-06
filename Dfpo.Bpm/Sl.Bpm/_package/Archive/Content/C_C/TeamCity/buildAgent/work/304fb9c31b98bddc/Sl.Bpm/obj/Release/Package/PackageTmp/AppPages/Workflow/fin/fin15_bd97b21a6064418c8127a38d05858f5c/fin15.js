
function controller(base, form, program) {  
    //alert(form.fin13.prefundingAmount);
    //form.fin13.prefundingAmount = '9.9'; //金额为0不会在页面上显示
    //alert(base.taskId);  
    if (base.taskId == "" || base.taskId==null) {
        form.fin13.currency = "CNY";
        form.fin13.sopYearlyTax = "1.00";
    } 
    if (form.fin13itemsd.length == 0) {
        form.fin13itemsd.push({});
    }
    //删除行
    form.delete = function () {
        var evens = _.remove(form.fin13itemsd, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }
    //提交验证
    form.$event_submit_before = function (context) {
        if (form.fin13itemsd.length === 0) {
            mabp.notify.warn("请填写明细数据");
            return context.$stop();
        }
        return context.$continue();  
    }
    //金额求和
    form.sum = function (data) {
        //币种金额处理
        var sopYearlyTax = form.fin13.sopYearlyTax;
        if (sopYearlyTax == 0) { sopYearlyTax = 1; } //防止除0 
       
        for (var i = 0; i < form.fin13itemsd.length; i++) {
            if (form.fin13.currency == "USD") {
                //打开美元输入 人民币关闭 
                form.fin13itemsd[i].reqLocalAmount = form.fin13itemsd[i].reqUSDAmount * sopYearlyTax;
            } else {
                form.fin13itemsd[i].reqUSDAmount = form.fin13itemsd[i].reqLocalAmount / sopYearlyTax;
            }
            form.fin13itemsd[i].totalLocalAmount = _$.getInt(form.fin13itemsd[i].preLocalAmount, form.fin13itemsd[i].reqLocalAmount);
            form.fin13itemsd[i].totalUSDAmount = _$.getInt(form.fin13itemsd[i].preUSDAmount, form.fin13itemsd[i].reqUSDAmount);
        } 
        form.fin13.preLocalAmount = _$.getSumOfArray(form.fin13itemsd, 'preLocalAmount');
        form.fin13.preUSDAmount = _$.getSumOfArray(form.fin13itemsd, 'preUSDAmount');
        form.fin13.reqLocalAmount = _$.getSumOfArray(form.fin13itemsd, 'reqLocalAmount');
        form.fin13.reqUSDAmount = _$.getSumOfArray(form.fin13itemsd, 'reqUSDAmount');
        form.fin13.totalLocalAmount = _$.getSumOfArray(form.fin13itemsd, 'totalLocalAmount');
        form.fin13.totalUSDAmount = _$.getSumOfArray(form.fin13itemsd, 'totalUSDAmount');
    }
    //选中小号
    form.chooseSubSN = function (row, item) {
        if (row[0] != null) {
            var josnobj = row[0];debugger
            //alert(JSON.stringify(josnobj)) 
            item.classCode = josnobj.classCode;
            item.className = josnobj.className;
            item.itemCode = josnobj.itemCode;
            item.itemName = josnobj.itemName; 
            form.blurepnumber('ItemAmt',item);
            form.sum();
        }
    }  
    form.blurepnumber = function (varflag, item) {  
        if (typeof (item) == "undefined") {
            form.fin13.prefundingAmount = "0";
            var data = program('GetEpOrItemAmt', { flag: varflag, epNumber: form.fin13.epNumber, itemCode: "" }); //返回的值是object对象 不需要再做joson转换
            if (data.length > 0) {
                if (data[0].errTip == "") {
                    form.fin13.prefundingAmount = data[0].epAmt;
                } else { 
                    mabp.notify.error(data[0].errTip); 
                    form.fin13.epNumber = ""; 
                }
            } 
            for (var i = 0; i < form.fin13itemsd.length; i++) {
                var item = form.fin13itemsd[i];
                form.blurepnumber('ItemAmt', item);
            }
            form.sum();
        } else { 
            var data = program('GetEpOrItemAmt', { flag: varflag, epNumber: form.fin13.epNumber, itemCode: item.itemCode });
            if (data.length > 0) {
                item.preLocalAmount = data[0].epItemAmt;
                item.preUSDAmount = data[0].epItemUSDAmt; 
            } else {
                item.preLocalAmount ='';
                item.preUSDAmount = '';
            }
        }
    }
    form.blurprojectsn = function () { 
        var data = program('GetEpOrItemAmt', { flag: 'CheckProjectNo', epNumber: form.fin13.projectNo, itemCode: "" }); //返回的值是object对象 不需要再做joson转换
        if (data.length > 0) {
            if (data[0].errTip != "") { 
                mabp.notify.error(data[0].errTip);
                form.fin13.projectNo = "";
            }
        } 
    }
    //币种变更 
    form.changcurrency = function (data) {
        form.sum();//计算金额
        if (base.taskId == "" || base.taskId == null) {
            //if (form.fin13.currency == "USD");
            //{
            //    form.fin13.SopYearlyTax = 0;
            //}
        }
    } 
}