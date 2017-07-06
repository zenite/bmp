function controller(base, form, program) {
    debugger;
    //页面加载时，相关明细数据Push一行，实现默认展示一行的效果
    form.$page_load = function () {
        if (form.fin09currency.length == 0) {
            form.fin09currency.push({});
            form.fin09allow.push({});
            form.fin09proj.push({});
            form.fin09costcenter.push({});
            form.fin09pay.push({});
        }
        program("GetUsdRate", {},
            function (usdRate) {
                form.$UsdRate = usdRate;
            });
        //在Cashier节点，付款明细表自动添加一行数据
        if (form.$pageRight.ShowPayer == 'normal' && form.fin09pay.length == 0) {
            form.fin09pay.push({});
        }
    }

    //报告类型设置默认值为差旅费
    if (!form.fin09.reportType) {
        form.fin09.reportType = 'c65c6951-b373-4f6a-91cc-3f1825269052';
        form.fin09.noneOfAbove = '2fc6f782-6e0e-42b1-8dbf-5ff3ae0d2e16';
        form.fin09.project = 'D17A7445-9082-4A80-80E4-F47B4D19049E';
        form.fin09.expenseAllocation = '7f436e8b-5dd3-413e-86eb-7c70e9dfab6d';
        var currentDate = new Date().format("yyyy-MM-dd");
        form.fin09.projectDate = currentDate;
    }

    //选择以上都不是，uncheck招待费，交通费，通信费
    form.chooseNoneOfAbove = function () {
        if (form.fin09.noneOfAbove == '2fc6f782-6e0e-42b1-8dbf-5ff3ae0d2e16') {
            form.fin09.entertainment = null;
            form.fin09.transportation = null;
            form.fin09.telephone = null;
            form.chooseEntertainment();
            form.chooseTransportation();
            form.chooseTelephone();
        }
    }

    //选择招待费，Uncheck以上都不是
    form.chooseEntertainment = function () {
        if (form.fin09.entertainment == 'f0553232-4b08-4a7d-bafc-81651a5f0d21') {
            form.fin09.noneOfAbove = null;
            form.fin09ed.push({});
        } else {
            form.fin09ed = [];
            form.fin09.businessReason = null;
            form.fin09.expenseDate = null;
            form.fin09.currencyType = null;
        }
    }

    //选择交通费，Uncheck以上都不是
    form.chooseTransportation = function () {
        if (form.fin09.transportation == '2a81e4fa-73d9-40eb-8432-08b6349f5867') {
            form.fin09.noneOfAbove = null;
            form.fin09td.push({});
        } else {
            form.fin09td = [];
        }
    }

    //选择电话费，Uncheck以上都不是
    form.chooseTelephone = function () {
        if (form.fin09.telephone == '2ea96c54-955f-4df4-909d-1c8a22a9e655') {
            form.fin09.noneOfAbove = null;
            form.fin09btc.push({});
        } else {
            form.fin09btc = [];
        }
    }

    //费用承担方选择本公司时，清除选择其他时填写的说明数据
    form.changeExpenseAllocation = function () {
        if (form.fin09.expenseAllocation == '7f436e8b-5dd3-413e-86eb-7c70e9dfab6d') {
            form.fin09.details = null;
        }
    }

    //修改是否选择项目，选择否时，清除项目相关数据
    form.changeProject = function () {
        if (form.fin09.project == '51B9F2E4-FBE9-400A-A789-A296E30177BF') {
            form.fin09proj = [];
            form.fin09proj.push({});
            form.fin09.projectAdjustment = null;
            form.fin09.projectTotal = null;
            form.fin09.projectDescription = null;
            form.fin09.projectDate = null;
        } else if (form.fin09.project == 'D17A7445-9082-4A80-80E4-F47B4D19049E') {
            var currentDate = new Date().format("yyyy-MM-dd");
            form.fin09.projectDate = currentDate;
        }
    }

    //币种明细选择币种获取税率  
    form.chooseRate = function (selectItem, item) {
        if (selectItem.length > 0) {
            item.rate = selectItem[0].rate;
        }
    }

    //出差明细选择币种获取税率  
    form.chooseCurrency = function (selectItem, item) {
        if (selectItem.length > 0) {
            item.rate = selectItem[0].rate;
        }
        form.sum();
    }

    //交通费明细选择币种获取税率  
    form.chooseFin09TdCurrency = function (selectItem, item) {
        if (selectItem.length > 0) {
            item.rate = selectItem[0].rate;
        } else {
            item.rate = 1;
        }
        form.sum();
    }

    //电话费明细选择币种获取税率  
    form.chooseFin09BtcCurrency = function (selectItem, item) {
        if (selectItem.length > 0) {
            item.rate = selectItem[0].rate;
        } else {
            item.rate = 1;
        }
        form.sum();
    }

    //计算出差天数以及对应补贴
    form.changeDate = function () {
        debugger;
        _.forEach(form.fin09allow, function (val) {
            if (moment(val.toDate).isBefore(moment(val.fromDate), 'day')) {
                form.$toast("开始时间不能晚于结束时间");
                val.toDate = null;
            }
            val.travelDays = moment(val.toDate).diff(moment(val.fromDate), "days") + 1;
            if (val.travelDays > 0) {
                //差旅地点为国内且发起人为非怡东公司
                if (form.fin09.travelLoc == '7a16c7f7-68ba-4c34-9fbb-5eac0dfe4e37' && base.areaCode !== 'YFVSX') {
                    val.allows = _$.getMultiply(val.travelDays, 100);
                }
                    //差旅地点为国外且发起人为非怡东公司
                else if (form.fin09.travelLoc == '9d9d029b-bd9b-4537-8d6e-04e3b6a95446' && base.areaCode !== 'YFVSX') {
                    if (val.travelDays <= 10)
                        val.allows = 50;
                    else {
                        val.allows = 50 + 5 * (val.travelDays - 10);
                    }
                }
                //发起人为怡东公司
                else if (base.areaCode === 'YFVSX') {
                    //do nothing...
                }
            } else {
                val.allows = null;
            }
        });
        form.fin09.travelDays = _$.getSumOfArray(form.fin09allow, 'travelDays');
        form.changeAllows();
    }

    //手动修改出差天数
    form.changeTravelDays = function () {
        _.forEach(form.fin09allow, function (val) {
            if (val.travelDays > 0) {
                //差旅地点为国内且发起人为非怡东公司
                if (form.fin09.travelLoc == '7a16c7f7-68ba-4c34-9fbb-5eac0dfe4e37' && base.areaCode !== 'YFVSX') {
                    val.allows = _$.getMultiply(val.travelDays, 100);
                }
                    //差旅地点为国外且发起人为非怡东公司
                else if (form.fin09.travelLoc == '9d9d029b-bd9b-4537-8d6e-04e3b6a95446' && base.areaCode !== 'YFVSX') {
                    if (val.travelDays <= 10)
                        val.allows = 50;
                    else {
                        val.allows = 50 + 5 * (val.travelDays - 10);
                    }
                }
                 //发起人为怡东公司
                else if (base.areaCode !== 'YFVSX') {
                    //do nothing...
                }
            } else {
                val.allows = null;
            }
        });
        form.fin09.travelDays = _$.getSumOfArray(form.fin09allow, 'travelDays');
        form.changeAllows();
    }

    //出差补贴变动后计算金额
    form.changeAllows = function() {
        var travelAllowanceBeforeRate = _$.getSumOfArray(form.fin09allow, 'allows');
        if (form.fin09.travelLoc == '7a16c7f7-68ba-4c34-9fbb-5eac0dfe4e37') {
            form.fin09.travelAllowance = travelAllowanceBeforeRate;
        } else if (form.fin09.travelLoc == '9d9d029b-bd9b-4537-8d6e-04e3b6a95446') {
            form.fin09.travelAllowance = _$.getMultiply(travelAllowanceBeforeRate, form.$UsdRate);;
        }
        form.sum();
    }

    //修改报告类型
    form.changeReportType = function () {
        //差旅费
        if (form.fin09.reportType == 'c65c6951-b373-4f6a-91cc-3f1825269052') {
            form.fin09.travelLoc = '7a16c7f7-68ba-4c34-9fbb-5eac0dfe4e37';
            form.fin09.travelType = '249de7db-b380-4166-b0b6-e22d08a457f8';
            form.fin09.longdistanceTickets = '0b80146d-c09d-490b-8e83-da88e19a4763';
        }
            //招待费
        else if (form.fin09.reportType == '2946dc2c-bdee-40c8-8734-cc742fcf1781') {
            form.fin09.travelLoc = null;
            form.fin09.travelType = null;
            form.fin09.longdistanceTickets = null;
            form.fin09allow = [];
            form.fin09allow.push({});
            form.fin09.totalTravels = null;
            form.fin09.travelDays = null;
            form.fin09.travelAllowance = null;
            form.fin09.lodging = null;
            form.fin09.airTickets = null;
            form.fin09.laundry = null;
            form.fin09.miscellaneous = null;
            form.fin09.taNumber = null;
        }
    }

    //修改差旅地点
    form.changeTravelLoc = function () {
        form.fin09allow = [];
        form.fin09allow.push({});
        form.fin09.totalTravels = null;
        form.fin09.travelDays = null;
        form.fin09.travelAllowance = null;
        form.fin09.lodging = null;
        form.fin09.airTickets = null;
        form.fin09.laundry = null;
        form.fin09.miscellaneous = null;
    }

    //金额求和
    form.sum = function () {
        var fin09Lunch = _.filter(form.fin09ed, ['expenseType', '6e33c60f-371f-48be-a137-c408701e8143']);
        var fin09Dinner = _.filter(form.fin09ed, ['expenseType', '376771b0-15bb-4938-8124-78a934807269']);
        var fin09Drink = _.filter(form.fin09ed, ['expenseType', '4f98f4f8-4f3b-46a2-a4a2-cd61a7722a08']);
        var fin09Gift = _.filter(form.fin09ed, ['expenseType', 'ee908bf1-0be2-43b2-aebc-8203647e5d0b']);
        form.fin09.lunchAmount = _$.getSumOfArray(fin09Lunch, 'amount'); //中餐费总金额
        form.fin09.dinnerAmount = _$.getSumOfArray(fin09Dinner, 'amount'); //晚餐费总金额
        form.fin09.drinkAmount = _$.getSumOfArray(fin09Drink, 'amount'); //饮料费总金额
        form.fin09.giftAmount = _$.getSumOfArray(fin09Gift, 'amount'); //礼品费总金额
        form.fin09.totalEntertainmentExpense = _$.getSumOfArray(form.fin09ed, 'amount'); //招待费总金额 

        _.forEach(form.fin09td, function (val) {
            val.amountAfterRate = _$.getMultiply(val.amount, val.rate);
        });
        form.fin09.tdTotal = _$.getSumOfArray(form.fin09td, 'amountAfterRate'); //交通费通过汇率换算后的总金额 

        _.forEach(form.fin09btc, function (val) {
            val.amountAfterRate = _$.getMultiply(val.amount, val.rate);
        });
        form.fin09.bTCTotal = _$.getSumOfArray(form.fin09btc, 'amountAfterRate'); //电话费通过汇率换算后的总金额 

        _.forEach(form.fin09allow, function (val) {
            if (!val.rate) {
                val.lodgingAfterRate = _$.getMultiply(val.lodging, 1);
                val.tickeyFeeAfterRate = _$.getMultiply(val.tickeyFee, 1);
                val.laundryAfterRate = _$.getMultiply(val.laundry, 1);
                val.miscellaneousAfterRate = _$.getMultiply(val.miscellaneous, 1);
            } else {
                val.lodgingAfterRate = _$.getMultiply(val.lodging, val.rate);
                val.tickeyFeeAfterRate = _$.getMultiply(val.tickeyFee, val.rate);
                val.laundryAfterRate = _$.getMultiply(val.laundry, val.rate);
                val.miscellaneousAfterRate = _$.getMultiply(val.miscellaneous, val.rate);
            }
        });
        form.fin09.lodging = _$.getSumOfArray(form.fin09allow, 'lodgingAfterRate');
        form.fin09.airTickets = _$.getSumOfArray(form.fin09allow, 'tickeyFeeAfterRate');
        form.fin09.laundry = _$.getSumOfArray(form.fin09allow, 'laundryAfterRate');
        form.fin09.miscellaneous = _$.getSumOfArray(form.fin09allow, 'miscellaneousAfterRate');
        form.fin09.totalTravels = _$.getInt(form.fin09.travelAllowance, form.fin09.lodging,
            form.fin09.airTickets, form.fin09.laundry, form.fin09.miscellaneous);
        form.fin09.totalExpense = _$.getInt(form.fin09.totalTravels, form.fin09.totalEntertainmentExpense,
            form.fin09.tdTotal, form.fin09.bTCTotal);
        form.fin09.projectTotal = _$.getInt(_$.getSumOfArray(form.fin09proj, 'amount'), form.fin09.projectAdjustment); //项目总金额（含税额）
        form.fin09.costTotal = _$.getInt(_$.getSumOfArray(form.fin09costcenter, 'amount'), form.fin09.costAdjustment); //成本中心总金额（含税额）
        form.fin09.companyPaid = _$.getMinus(form.fin09.cashPaidAdvance, form.fin09.totalExpense); //员工支付给公司 
        if (form.fin09.companyPaid < 0) {
            form.fin09.companyPaid = '0';
        }
        form.fin09.employeePaid = _$.getMinus(form.fin09.totalExpense, form.fin09.cashPaidAdvance); //公司需支付给员工 
        if (form.fin09.employeePaid < 0) {
            form.fin09.employeePaid = '0';
        }
    }

    //收款人设置默认值为申请人
    if (!form.fin09.payTo) {
        form.fin09.payTo = base.applicant.userId;
        form.fin09.payToNo = base.applicant.employeeNumber;
    }

    //选择付款人，带出付款人工号
    form.selectPayTo = function (selectItem) {
        if (selectItem.length > 0) {
            form.fin09.payToNo = selectItem[0].employeeNumber;
        }
    }

    //选择项目名称，带出项目信息
    form.selectProjectInfo = function (item, selectItem) {
        item.projectNo = selectItem[0].projectNo; //项目编号
        item.budgetItemsSelection = selectItem[0].projectType; //预算项目类别
        item.projectMgr = selectItem[0].projectManager; //项目经理姓名
        item.projectMgrJob = selectItem[0].projectManagerJobId; //项目经理岗位Id
        //item.projectController = selectItem[0].projectController; //项目控制员姓名
        item.projectControllerJobId = selectItem[0].auditJobId; //项目控制员岗位Id
    }

    //选择成本中心，带出成本中心信息
    form.selectCostCenter = function (item, selectItem) {
        item.expenseType = selectItem[0].accountDesc;
        item.account = selectItem[0].account;
        item.ownerMgr = selectItem[0].manager;
        item.ownerMgrJob = selectItem[0].managerJobId;
        item.costGroupId = selectItem[0].costGroupId;
    }

    //选择出差单号，带出出差单费用合计
    form.selectTravelAuthority = function (selectItem) {
        if (form.fin09.tANumber != null && selectItem.length > 0) {
            form.fin09.cashPaidAdvance = selectItem[0].sumofAmount;
        }
        form.sum();
    }

    //币种明细中删除行
    form.deleteCurrency = function () {
        var evens = _.remove(form.fin09currency, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }

    //招待费明细中删除行
    form.deleteEd = function () {
        var evens = _.remove(form.fin09ed, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }

    //交通费明细中删除行
    form.deleteTd = function () {
        var evens = _.remove(form.fin09td, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }

    //通信费用明细中删除行
    form.deleteBtc = function () {
        var evens = _.remove(form.fin09btc, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }

    //出差补贴明细中删除行
    form.deleteAllow = function () {
        var evens = _.remove(form.fin09allow, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }

    //项目费用明细中删除行
    form.deleteProj = function () {
        var evens = _.remove(form.fin09proj, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }

    //成本中心费用明细中删除行
    form.deleteCc = function () {
        var evens = _.remove(form.fin09costcenter, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }

    //付款明细中删除行
    form.deletePay = function () {
        var evens = _.remove(form.fin09pay, function (n) {
            return n.checked;
        });
        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
        form.sum();
    }

    //提交验证
    form.$event_submit_before = function (context) {
        if (form.fin09.totalExpense !== form.fin09.costTotal) {
            mabp.notify.warn("成本中心金额总计与费用总计应该相等!");
            return context.$stop();
        }
        return context.$continue();
    }
}