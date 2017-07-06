function controller(base, form, program) {
    debugger;
    //是否暂支设置默认值为是
    if (!form.fin07.advance) {
        form.fin07.advance = 'D17A7445-9082-4A80-80E4-F47B4D19049E';
        form.fin07.currency2 = 'CNY';//暂支合计币种
        form.fin07.exchangeRate2 = 1;//暂支合计币种汇率
        form.fin07.lessTheCashAdvanced = '0.00';//扣减原已暂支现金
        form.fin07.currency = 'CNY';//扣减原已暂支现金币种
    }

    //收款人设置默认值为申请人
    if (!form.fin07.nameForPayee) {
        form.fin07.nameForPayee = base.applicant.userId; 
        form.fin07.payeeBadgeNo = base.applicant.employeeNumber;
    }

    //选择付款人，带出付款人工号
    form.selectNameForPayee = function (selectItem) {
        //var allEmpNo = [];
        //for (var i = 0; i < selectItem.length; i++) allEmpNo.push(selectItem[i].employeeNumber);
        //form.fin07.payeeBadgeNo = allEmpNo.join(',');       
        if (selectItem.length > 0) {
            form.fin07.payeeBadgeNo = selectItem[0].employeeNumber;
            form.fin07.payeeUserId = selectItem[0].id;
            form.readAdvance(form.fin07.payeeUserId);
        }
    }

    form.readAdvance = function (id) {
        if (!form.advanceList || form.advanceList.length == 0) {
            //读取收款人所有的暂支单
            base.$readViewData('GetAdvanceAmountInPettyCash', { payee: id }, function (data) {
                form.advanceList = data;
            });
        }
    }
    form.readAdvance(form.fin07.payeeUserId);

    form.$page_load = function () {
        //在Cashier节点，付款明细表自动添加一行数据
        if (form.$pageRight.ShowPayer == 'normal' && form.fin07pay.length == 0) {
            form.fin07pay.push({});
        }
    }

    //切换是否暂支时，对应字段设置默认值
    form.changeAdvanceType = function () {
        //暂支为是时
        if (form.fin07.advance == 'D17A7445-9082-4A80-80E4-F47B4D19049E') {
            form.fin07.currency2 = 'CNY';//暂支合计币种
            form.fin07.exchangeRate2 = 1;//暂支合计币种汇率
            form.fin07.lessTheCashAdvanced = '0.00';//扣减原已暂支现金
            form.fin07.currency = 'CNY';//扣减原已暂支现金币种
            form.fin07.reimbursementType = null; //报销类型           
            form.fin07.refundTrainingFees = null; //是否课程报销
            form.fin07invoice = []; //发票明细          
            form.fin07.purposeDescription1 = null; //非交通费用途描述
            form.fin07.overtime = null; //是否加班
            form.fin07overtime = [];//加班明细
            form.fin07proj = [];//项目明细
            form.fin07costcenter = []; //成本中心
            form.fin07.costAdjustment = null; //税额
            form.fin07.costTotal = null; //总计
            form.fin07.costDescription = null; //描述
            form.fin07.theSumOfAmount = null;//合计信息金额
            form.fin07.sumAll = null;//合计信息金额大写
            form.fin07.mustPay = null;//需支付金额
            form.fin07.mustPaySumAll = null;//需支付金额大写  
        }//暂支为否时
        else if (form.fin07.advance == '51B9F2E4-FBE9-400A-A789-A296E30177BF') {
            form.fin07.currency1 = 'CNY';//币种
            form.fin07.exchangeRate1 = 1;//汇率
            form.fin07.refundTrainingFees = '51B9F2E4-FBE9-400A-A789-A296E30177BF';//是否课程报销
            form.fin07.project = '51B9F2E4-FBE9-400A-A789-A296E30177BF';//是否是项目
            form.fin07.amount2 = null;//暂支合计
            form.fin07.currency2 = null;//暂支合计币种
            form.fin07.exchangeRate2 = null;//暂支合计币种汇率
            //form.fin07.lessTheCashAdvanced = null;//扣减原已暂支现金
            form.fin07.estimatedClosingTime = null;//预计关闭时间
            form.fin07.purposeDescription2 = null;//暂支用途描述
            form.fin07.theSumOfAmount = null;//合计信息金额
            form.fin07.sumAll = null;//合计信息金额大写
            form.fin07.mustPay = null;//需支付金额
            form.fin07.mustPaySumAll = null;//需支付金额大写              
            form.fin07.advanceNumber = null;//暂支凭证号          
            if (base.pageState == 1 && form.fin07invoice.length == 0) {
                form.fin07invoice.push({});
            }
            if (base.pageState == 1 && form.fin07overtime.length == 0) {
                form.fin07overtime.push({});
            }
            if (base.pageState == 1 && form.fin07proj.length == 0) {
                form.fin07proj.push({});
            }
            if (base.pageState == 1 && form.fin07costcenter.length == 0) {
                form.fin07costcenter.push({});
            }
        }
    }

    form.changeReFundTrainingFeesType = function() {
        //是否课程报销为否时
        if (form.fin07.refundTrainingFees == '51B9F2E4-FBE9-400A-A789-A296E30177BF') {
            form.fin07.externalCourseFlowNum = null;
            form.$state.UploadAttachment = [];//附件清空
            form.fin07.schoolName = null;
            form.fin07.courseName = null;
            form.fin07.startDate = null;
            form.fin07.endDate = null;
            form.fin07.creditHours = null;
            form.fin07.amountClaimed = null;
        }
    }

    //form.changeOvertimeType = function () {
    //    //是否加班为否时
    //    if (form.fin07.overtime == '51B9F2E4-FBE9-400A-A789-A296E30177BF' || !form.fin07.overtime) {
    //        form.fin07overtime = [];
    //        form.fin07overtime.push({});
    //    }
    //}

    form.changeProjectType = function () {
        //是否项目为否时
        if (form.fin07.project == '51B9F2E4-FBE9-400A-A789-A296E30177BF') {
            form.fin07proj = [];
            form.fin07proj.push({});
        }
    }

    //明细表中金额求和
    form.sum = function () {
        form.fin07.amount1 = _$.getSumOfArray(form.fin07invoice, 'invoiceAmount');//发票总金额
        form.fin07.total1 = _$.getSumOfArray(form.fin07overtime, 'amount');//交通费总金额
        form.fin07.projectTotal = _$.getInt(
            _$.getSumOfArray(form.fin07proj, 'amount'),
            form.fin07.projectAdjustment);//项目总金额（含税额）
        form.fin07.costTotal = _$.getInt(
            _$.getSumOfArray(form.fin07costcenter, 'amount'),
            form.fin07.costAdjustment);//成本中心总金额（含税额）
        if (form.fin07.advance == 'D17A7445-9082-4A80-80E4-F47B4D19049E') {
            form.fin07.theSumOfAmount = form.fin07.amount2;//发票总金额        
            form.fin07.mustPay = form.fin07.amount2;//需支付金额
        } else {
            form.fin07.theSumOfAmount = form.fin07.amount1;//发票总金额        
            form.fin07.mustPay = _$.getMinus(form.fin07.theSumOfAmount, form.fin07.lessTheCashAdvanced);//需支付金额    
        }
        form.fin07.sumAll = _$.changeRMBToCH(form.fin07.theSumOfAmount);//发票总金额大写
        form.fin07.mustPaySumAll = _$.changeRMBToCH(form.fin07.mustPay);//需支付金额大写
    }

    //选择外课单号，带出相关字段的值
    form.selectExternalCourse = function (selectItem) {
        if (form.fin07.externalCourseFlowNum != null && selectItem.length > 0) {
            form.fin07.schoolName = selectItem[0].courseProvider; //学校名称
            form.fin07.courseName = selectItem[0].courseName; //课程名称
            form.fin07.startDate = selectItem[0].startDate; //起始日期
            form.fin07.endDate = selectItem[0].endDate; //结束日期
            form.fin07.creditHours = selectItem[0].creditHours; //总学时
            form.fin07.amountClaimed = selectItem[0].expectedExpenses; //申请报销数额(不含差旅费)
            form.fin07.cpEmployee = selectItem[0].cpEmployee; //公司员工
            form.fin07.badgeNo = selectItem[0].badgeNo; //员工号
            form.fin07.cpDepartment = selectItem[0].cpDepartment; //部门
        }
    }

    //选择暂支凭证号，带出相关字段的值
    form.selectAdvanceNumber = function (selectItem) {
        if (form.fin07.advanceNumber != null && selectItem.length > 0) {            
            form.fin07.lessTheCashAdvanced = selectItem[0].restAmount; //扣减原已暂支现金
            form.sum();
        }
    }

    //选择项目名称，带出项目信息
    form.selectProjectInfo = function (item, selectItem) {
        item.budgetItemsSelection = selectItem[0].id;
        item.projectNo = selectItem[0].projectNo; //项目编号
        item.projectItemNo = selectItem[0].item_code; //预算项目类别
        item.projectItem = selectItem[0].item_desc; //预算项目类别
        item.projectMgr = selectItem[0].projectManager; //项目经理姓名
        item.projectMgrJob = selectItem[0].projectManagerJobId; //项目经理岗位Id
        item.projectController = selectItem[0].projectController; //项目控制员 
        item.projectControllerJob = selectItem[0].projectControllerJobId; //项目控制员岗位Id
    }

    //选择成本中心，带出成本中心信息
    form.selectCostCenter = function (item, selectItem) {
        item.expenseType = selectItem[0].accountDesc; 
        item.account = selectItem[0].account;
        item.ownerMgr = selectItem[0].manager;
        item.ownerMgrJob = selectItem[0].managerJobId;
        item.costGroupId = selectItem[0].costGroupId;
    }

    //判断报销类型中的交通费报销是否有勾选中
    form.selectReimbursementType = function (data, fmModel) {        
        showOverTime = (fmModel || "").indexOf('165cc891-0c3a-472a-8b71-b9fee07c3d06') >= 0;
        if (showOverTime) {
            form.fin07.overtime = '51B9F2E4-FBE9-400A-A789-A296E30177BF';
        } else {
            form.fin07overtime = [];
            form.fin07overtime.push({});
        }        
    }

    //发票明细中删除行
    form.deleteInvoice = function () {
        var evens = _.remove(form.fin07invoice, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }

    //交通费明细中删除行
    form.deleteOvertime = function () {
        var evens = _.remove(form.fin07overtime, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }

    //项目明细中删除行
    form.deleteProj = function () {
        var evens = _.remove(form.fin07proj, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }

    //成本中心明细中删除行
    form.deleteCostcenter = function () {
        var evens = _.remove(form.fin07costcenter, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }

    //付款明细中删除行
    form.deletePay = function () {
        var evens = _.remove(form.fin07pay, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }

    //提交验证
    form.$event_submit_before = function (context) {
        if (form.fin07.theSumOfAmount !== form.fin07.costTotal
            && form.fin07.advance === '51B9F2E4-FBE9-400A-A789-A296E30177BF') {
            mabp.notify.warn("成本中心金额总计与合计信息中的金额应该相等!");
            return context.$stop();
        }
        return context.$continue();
    }

}