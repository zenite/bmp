
function controller(base, form, program) { 
    form.$page_load = function () {
        if (!base.taskId) {
            base.$getBasicData("Finance>FinItems>ProfitsItems", function (data) {
                for (var d in data.data) {
                    form.fin13davg.push({
                        profitsType: data.data[d].text
                    });
                }
            });
        }
        //默认值 
        if (base.taskId == "" || base.taskId == null) {
            form.fin13.currency = "CNY";
            form.fin13.sopYearlyTax = "1.00";
        } 
        form.fin13.isPrefunding = 0;//默认值 
        form.isFinNode = base.nodeId == '2c164644-cb05-4f60-b50d-2bc5ac295cf7';//ND06 填写拨款号 
        if (typeof (base.taskId) == "undefined" || base.taskId == null || base.taskId == "" || form.fin13.profitsStartY == null) {
            form.fin13.profitsStartY = new Date().getFullYear();
        }
        //获取人民币对美元汇率
        form.$state.defaultTax = _$.getInt(program('GetTaxForCnyToUsd', {}));
    } 
    //币种变更 
    form.changcurrency = function (data) {
        if (form.fin13.currency == "CNY") {  //人民币永远是1
            form.fin13.sopYearlyTax = "1.00";  
        }
        form.sum();//计算金额  
    } 
    form.fnStartY = function () {
        form.fin13.profitsStartY = Number(form.fin13.profitsStartY);
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
    form.deletefin13p = function () {
        var evens = _.remove(form.fin13p, function (n) {
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
    //金额求和
    form.sump = function (data) {
        for (var i = 0; i < form.fin13p.length; i++) {
            var detp = form.fin13p[i];
            detp.totAmt = _$.getInt(detp.yearAmtA, detp.yearAmtB, detp.yearAmtC, detp.yearAmtD, detp.yearAmtE, detp.yearAmtF, detp.yearAmtG, detp.yearAmtH, detp.yearAmtI);
        }
    }
    //选中小号
    form.chooseSubSN = function (row, item) {
        if (row[0] != null) {
            var josnobj = row[0];
            item.classCode = josnobj.classCode;
            item.className = josnobj.className;
            item.itemCode = josnobj.itemCode;
            item.itemName = josnobj.itemName;
            form.blurepnumber('ItemAmt', item);
            form.sum();
        }
    }
    //控制项目编号为可选或填写 
    form.funcAppType = function (data) {
        form.fin13.projectNo = null;
        //清除明细表 
        form.fin13p.length = 0;
        form.fin13itemsd.length = 0;
        form.sum(); form.sump();
        //===END
        if (form.fin13.appType == "1" || form.fin13.appType == "3") {
            form.fin13.itemAmtChange = null;
        }
    }
    //提交验证 Event_Agree_Before 财务分析岗 输入的项目号是否已经存在 
    form.$event_agree_before = function (context) {
        if (form.isFinNode) {
            var sn = form.fin13.projectNo;
            if (sn != "") {
                var end = program("GetProjectNoCn", { projectNo: sn, taskId: base.taskId });
                //mabp.notify.warn(end[0].projectNoCn);
                if (end.length > 0) {
                    if (end[0].projectNoCn != "0") {
                        mabp.notify.warn("您输入的项目编号" + sn + "已经存在 请尝试其他编号");
                        return context.$stop();
                    }
                }
            }
        }
        return context.$continue();
    }
    //产品线对应的负责人
    form.funcProduct = function (row) {
        if (row[0] != null) {
            var josnobj = row[0];
            form.fin13.productManagerJobId = josnobj.managerJobId;
        }
    }
    //控制项目编号绑定 
    form.funcBindProjectInfo = function (data) {
        var dataProfits = null;  //alert(JSON.stringify(data))  
        if (form.fin13.projectNo != null) {
            data = program('GetProjectInfo', { flag: 'FIN12', projectNo: form.fin13.projectNo }); //返回的值是object对象 不需要再做joson转换
            dataProfits = program('GetProjectInfo', { flag: 'FIN12Profits', projectNo: form.fin13.projectNo }); //返回的值是object对象 不需要再做joson转换
        }
        if (dataProfits.length > 0) {
            form.fin13p.length = 0;
            for (var i = 0; i < dataProfits.length; i++) {
                form.fin13p.push({});
                var item = form.fin13p[i];
                if (form.fin13.profitsStartY == null) {
                    form.fin13.profitsStartY = new Date().getFullYear();
                }
                var diffy = form.fin13.profitsStartY - new Date().getFullYear();
                if (diffy == 0) {
                    item.yearAmtA = dataProfits[i].yearAmtA;
                    item.yearAmtB = dataProfits[i].yearAmtB;
                    item.yearAmtC = dataProfits[i].yearAmtC;
                    item.yearAmtD = dataProfits[i].yearAmtD;
                    item.yearAmtE = dataProfits[i].yearAmtE;
                    item.yearAmtF = dataProfits[i].yearAmtF;
                    item.yearAmtG = dataProfits[i].yearAmtG;
                    item.yearAmtH = dataProfits[i].yearAmtH;
                    item.yearAmtI = dataProfits[i].yearAmtI;
                }
                //if (diffy == 1) {
                //    item.yearAmtA = dataProfits[i].yearAmtB;
                //    item.yearAmtB = dataProfits[i].yearAmtC;
                //    item.yearAmtC = dataProfits[i].yearAmtD;
                //    item.yearAmtD = dataProfits[i].yearAmtE;
                //    item.yearAmtE = null;
                //}
                //if (diffy == 2) {
                //    item.yearAmtA = dataProfits[i].yearAmtC;
                //    item.yearAmtB = dataProfits[i].yearAmtD;
                //    item.yearAmtC = dataProfits[i].yearAmtE;
                //    item.yearAmtD = null;
                //    item.yearAmtE = null;
                //}
            }
        }
        if (data.length > 0) {
            form.fin13.projectName = data[0].projectName;
            form.fin13.profitsStartY = data[0].profitsStartY;
            if (form.fin13.profitsStartY == null) {
                form.fin13.profitsStartY = new Date().getFullYear();
            } 
            //currency, SopYearlyTax
            form.fin13.currency = data[0].currency;
            form.fin13.sopYearlyTax = data[0].sopYearlyTax;
            form.fin13.itemAmtChangeApprovers = data[0].itemAmtChangeApprovers;
            form.fin13.itemAmtChange = data[0].itemAmtChange;
            form.fin13.productManagerJobId = data[0].productManagerJobId;
            form.fin13.inBudget = data[0].inBudget;
            form.fin13.expCloseTime = data[0].expCloseTime;
            form.fin13.projectProperty = data[0].projectProperty;
            form.fin13.productType = data[0].productType;
            form.fin13.profitBeforeTaxPBT = data[0].profitBeforeTaxPBT;
            form.fin13.pretaxMargin = data[0].pretaxMargin;
            form.fin13.afterTaxmargin = data[0].afterTaxmargin;
            form.fin13.internalRate = data[0].internalRate;
            form.fin13.paybackPeriodIncluding = data[0].paybackPeriodIncluding;
            form.fin13.paybackPeriodExcluding = data[0].paybackPeriodExcluding;
            form.fin13.productCycle = data[0].productCycle;
            form.fin13.startingDateForProduction = data[0].startingDateForProduction;
            form.fin13itemsd.length = 0;
            for (var i = 0; i < data.length; i++) {
                form.fin13itemsd.push({});
                var d = form.fin13itemsd[i];
                d.isChange = 1;
                d.classCode = data[i].classCode;
                d.className = data[i].className;
                d.itemCode = data[i].itemCode;
                d.itemName = data[i].itemName;
                d.preLocalAmount = data[i].reqLocalAmount;
                d.preUSDAmount = data[i].reqUSDAmount;
                d.reqLocalAmount = null;
                d.reqUSDAmount = null;
                d.totalLocalAmount = data[i].totalLocalAmount;
                d.totalUSDAmount = data[i].totalUSDAmount;

            }
        } else {
            form.fin13.currency = null;
            form.fin13.sopYearlyTax = null;
            form.fin13.projectName = null;
            form.fin13.profitsStartY = new Date().getFullYear();
            form.fin13.itemAmtChangeApprovers = null;
            form.fin13.itemAmtChange = null;
            form.fin13.productManagerJobId = null;
            form.fin13.inBudget = null;
            form.fin13.expCloseTime = null;
            form.fin13.projectProperty = null;
            form.fin13.productType = null;
            form.fin13.profitBeforeTaxPBT = null;
            form.fin13.pretaxMargin = null;
            form.fin13.afterTaxmargin = null;
            form.fin13.internalRate = null;
            form.fin13.paybackPeriodIncluding = null;
            form.fin13.paybackPeriodExcluding = null;
            form.fin13.productCycle = null;
            form.fin13.startingDateForProduction = null;
            for (var i = 0; i < form.fin13itemsd.length; i++) {
                form.fin13itemsd[i].classCode = null;
                form.fin13itemsd[i].rmbAmountB = null;
                form.fin13itemsd[i].itemCode = null;
                form.fin13itemsd[i].itemName = null;
                form.fin13itemsd[i].preLocalAmount = null;
                form.fin13itemsd[i].preUSDAmount = null;
                form.fin13itemsd[i].reqLocalAmount = null;
                form.fin13itemsd[i].reqUSDAmount = null;
            }
            for (var i = 0; i < form.fin13p.length; i++) {
                form.fin13p[i].yearAmtA = null;
                form.fin13p[i].yearAmtB = null;
                form.fin13p[i].yearAmtC = null;
                form.fin13p[i].yearAmtD = null;
                form.fin13p[i].yearAmtE = null;

            }
        }
        form.sum(); form.sump();
    }

}