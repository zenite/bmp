
function controller(base, form, program) {
    debugger;
    form.HaveBlankPO = false;
    form.$page_load = function () {
        //发票信息编辑权限控制 AP和发起节点才可编辑
        //alert(base.AreaCode);
        form.IsND15 = form.$nodeCode == "ND15" || form.$nodeCode == "ND16";
        form.invread = (!form.IsND15) && base.pageState != 1;//nodeCode 不稳定 常没有 
        form.fincertshow = base.pageState == 3 || form.IsND15; //凭证信息控制 AP和以后才显示 找不到标记流程是否结束的属性 就用pageState表示
        if (typeof (base.taskId) == "undefined" || base.taskId == null || base.taskId == "" || form.fin06.paidThrough == null) {
            form.fin06.paidThrough = "3"; //默认汇款 // alert(JSON.stringify(form))
        }
    }
    form.BindCourseFlows = function (row) { //课程信息
        if (row[0] != null) {
            var item = row[0];
            form.fin06.courseProvider = item.courseProvider;//学校名称
            form.fin06.courseName = item.courseName;        //课程名称
            form.fin06.creditHours = item.creditHours;      //总学时
            form.fin06.startDate = item.startDate;          //起始日期
            form.fin06.endDate = item.endDate;              //结束日期
            form.fin06.courseAmount = item.expectedExpenses;//申请报销数额
            form.fin06.currency = item.currency;            //币种
            form.fin06.department = item.applicationGroupId;//部门 
        }
    }

    form.changeAdvanceType = function () {//预付款
        var adv = form.fin06.advanceBy;
        if (adv != 1) {
            form.fin06.advanceNo = null;  //预付款单号
            form.fin06.closeDate = null;  //预计关闭日期
        }
    }

    form.changeSupplierName = function () {  //供应商信息 
        form.fin06.supplierCode = form.fin06.supplierNameInput;
        form.fin06.supplierName = form.fin06.supplierNameInput;
        //2017.01.16 触发了这个函数的  按照手动输入的处理 
        form.fin06.paymentTerm = null;        //付款条件
        form.fin06.paymentTermInput = null;  //付款条件
    }

    form.chooseSupplierName = function (row) {  //供应商信息
        if (row[0] != null) {
            form.fin06.supplierCode = row[0].id;
            form.fin06.paymentTerm = row[0].crTerms;       //付款条件
            form.fin06.paymentTermInput = row[0].crTerms;  //付款条件
            //草稿打开会触发了chooseSupplierName 付款方式值会背覆盖
            //if (!form.fin06.paymentTerm) { //先选了付款方式 后面选供应商中付款条件又覆盖了 所以为空的时候再赋值 （没办法 看用户怎么要求了）
            //    form.fin06.paymentTerm = row[0].crTerms;       //付款条件
            //    form.fin06.paymentTermInput = row[0].crTerms;  //付款条件
            //}
        } else {
            form.fin06.paymentTerm = null;        //付款条件
            form.fin06.paymentTermInput = null;  //付款条件
        }
    }

    form.BindLineRate = function (row, item) {  //行内 汇率信息  
        if (row[0] != null) {
            item.rate = row[0].rate;
        }
    }

    form.ControlMaxPayAmount = function (item) { //控制最高输入金额 
        if ((item.payAmount - item.restAmount) > 0) {
            item.payAmount = item.restAmount;
        }
    }

    form.ControlRestAmount = function (item) { //控制最高输入金额 
        if ((item.restAmount - item.poAmount) > 0) {
            item.restAmount = item.poAmount;
        }
    }

    form.changePoNbr = function (item) {
        item.poNbr = item.poNbrInput;
        form.fin06cc.length = 0;//清除成本中心信息

        var data = program('GetPO', { posn: item.poNbr }); //返回的值是object对象 不需要再做joson转换
        if (data.length > 0) {
            var dsource = data[0];
            item.poNbr = dsource[0].id;
            item.potype = dsource[0].potype;
            item.poNbrInput = dsource[0].id;
            item.projectNo = dsource[0].projectCode;
            item.currency = dsource[0].currency;
            item.poAmount = dsource[0].totalCny;
            item.restAmount = dsource[0].restAmount;
            item.payAmount = dsource[0].restAmount;
            item.isInput = 0;
        } else {
            item.isInput = 1;
            item.poAmount = 0;
            item.restAmount = 0;
            item.payAmount = 0;
        }
        for (var i = 0; i < form.fin06po.length; i++) {
            if (form.fin06po[i].poNbr == "BLANK") {
                form.HaveBlankPO = true;
            }
        }
        form.sum();//计算总计 
    }
    //选择PO，带出PO信息
    form.selectPoNbr = function (item, selectItem) {
        if (!!selectItem[0]) {
            //alert(JSON.stringify(selectItem[0]));
            item.poNbr = selectItem[0].id;
            form.HaveBlankPO = false;
            for (var i = 0; i < form.fin06po.length; i++) {
                if (form.fin06po[i].poNbr == "BLANK") {
                    form.HaveBlankPO = true;
                }
            }

            item.poNbrInput = selectItem[0].id;
            item.potype = dsource[0].potype;
            item.projectNo = selectItem[0].projectCode;
            item.currency = selectItem[0].currency;
            item.poAmount = selectItem[0].totalCny;
            item.restAmount = selectItem[0].restAmount;
            item.payAmount = selectItem[0].restAmount;
            form.fin06cc.length = 0;//清除成本中心信息
            item.isInput = 0;
            form.sum();//计算总计 
            //for (var i = 0; i < form.fin06po.length; i++) {
            //    if (form.fin06po[i].poNbr == "BLANK") {
            //        form.HaveBlankPO = true;
            //    }
            //    alert(form.fin06po[i].poNbr);
            //}
        }
    }
    //选择成本中心，带出成本中心信息
    form.selectCostCenter = function (item, selectItem) {
        //alert(JSON.stringify(selectItem[0])) 
        //明细表里面只要有任何一行选择了培训类成本中心，则可选择外课
        debugger;
        if (!!selectItem[0]) {
            var v = selectItem[0];
            if (v.account === '66023315' && (v.costCenter === 'YFVIC26' || v.costCenter === 'YFVSJ32' || v.costCenter === 'NJTC2')) {
                form.$state.allowExternalCourse = true;
            }
        }
        if (!form.$state.allowExternalCourse) {
            form.needExternalCourse();
        }

        item.expenseType = selectItem[0].accountDesc;
        item.costCenter = selectItem[0].costCenter;
        item.accountDesc = selectItem[0].accountDesc;
        item.account = selectItem[0].account;
        item.ownerName = selectItem[0].manager;
        item.ownerJobId = selectItem[0].managerJobId;
        item.costGroupId = selectItem[0].costGroupId;
        form.fin06po.length = 0;//清除PO信息
    }
    //删除行
    form.delete = function (detmodelid) {
        var evens = null;
        var detevens = null;
        if (detmodelid == "fin06cc") { //成本中心明细
            detevens = form.fin06cc;
        }
        if (detmodelid == "fin06fn") {//凭证信息
            detevens = form.fin06fn;
        }
        if (detmodelid == "fin06iv") {//发票明细
            detevens = form.fin06iv;
        }
        if (detmodelid == "fin06po") {//订单项目明细
            detevens = form.fin06po;
        }
        evens = _.remove(detevens, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
        form.needExternalCourse();
    }

    form.detadd = function (controlid) {
        if (controlid == "fin06cc") { //成本中心
            //var end = confirm("将删除PO订单信息 是否继续");
            //if (end) {
            form.fin06po.length = 0;//清除PO信息
            form.fin06cc.push({})
            // } 
        }
        else if (controlid == "fin06po") { //PO 
            form.fin06cc.length = 0;//成本中心
            form.fin06po.push({})
        }
    }
    //金额求和
    form.sum = function (data) {
        for (var i = 0; i < form.fin06iv.length; i++) {
            form.fin06iv[i].hasTaxAmount = _$.getInt(form.fin06iv[i].noTaxAmount, form.fin06iv[i].taxAmount);
        }
        form.fin06.sumInvNoTaxAmt = _$.getSumOfArray(form.fin06iv, 'noTaxAmount');
        form.fin06.sumInvTaxAmt = _$.getSumOfArray(form.fin06iv, 'taxAmount');
        form.fin06.sumInvHasTaxAmt = _$.getSumOfArray(form.fin06iv, 'hasTaxAmount');
        form.sum06ccAmt = _$.getSumOfArray(form.fin06cc, 'amount');
        form.sum06poAmt = _$.getSumOfArray(form.fin06po, 'payAmount');
        form.fin06.total = _$.getInt(form.fin06.adjustment, form.sum06ccAmt, form.sum06poAmt);
    }

    form.$event_submit_before = function (context) {
        if (form.fin06iv.length == 0) {
            form.$toast("请填写发票数据")
            return context.$stop();
        }
        var cclen = form.fin06cc.length; //成本中心明细
        var polen = form.fin06po.length; //订单项目明细
        var fnlen = form.fin06fn.length; //凭证号
        if (cclen == 0 && polen == 0) {
            form.$toast("请填写成本中心或订单数据")
            return context.$stop();
        }
        //校验必填凭证号
        if (form.$nodeCode == "ND16") {
            if (form.fin06fn.length == 0) {
                form.$toast("请填写凭证号")
                return context.$stop();
            }
            else {
                _.each(form.fin06fn, function (i) {
                    if (!form.fin06fn[i].voNbr || form.fin06fn[i].voNbr == "") {
                        form.$toast("请填写凭证号")
                        return context.$stop();
                    }
                });
            }
        }
        //有成本中心时 发票金总计和成本中心下的总计校验
        if (cclen > 0 && form.fin06.total - form.fin06.sumInvHasTaxAmt != 0) {
            form.$toast("总计金额和发票含税金额合计不相等！")
            return context.$stop();
        }
        return context.$continue();
    }

    form.$event_agree_before = function (context) {
        if (form.IsND15) {
            if (form.fin06iv.length == 0) {
                form.$toast("请填写发票数据")
                return context.$stop();
            }
            var fnlen = form.fin06fn.length; //凭证号

            if (fnlen == 0) {
                form.$toast("请填写凭证数据")
                return context.$stop();
            }
            if (form.fin06cc.length > 0 && form.fin06.total - form.fin06.sumInvHasTaxAmt != 0) {
                form.$toast("金额合计和发票含税金额合计不相等！")
                return context.$stop();
            }
        }
        return context.$continue();
    }
    //验证是否需要链接外课
    form.needExternalCourse = function () {
        var val = _.find(form.fin06cc, function (v) {
            if (v.account === '66023315' && (v.costCenter === 'YFVIC26' || v.costCenter === 'YFVSJ32' || v.costCenter === 'NJTC2')) {
                return v;
            }
        });
        if (!!val) {
            form.$state.allowExternalCourse = true;
        } else {
            form.$state.allowExternalCourse = false;
            form.fin06.externalCourseFlowNum = null;
        }
    }
}