//说明： 后续枚举类型都以 text id 的格式来进行定义, 然后可以引用 enumfilter 过滤器来实现枚举转换
//全局枚举
var enums = {
    get: function (enumKey) {
        var list = [];
        var enumList = $.extend(true, {}, this[enumKey]);
        _.forEach(enumList, function (item) {
            list.push({
                id: item.id,
                text: L(item.text) || item.text
            });
        });
        return list;
    },
    //临时用的颜色图标
    mainIcons: [
        {icon:'icon-stack',color:'#FB9678'},
        {icon:'icon-usecase',color:'#01C0C8'},
        {icon:'icon-hdd',color:'#AB8CE4'},
        {icon:'icon-newspaper-o',color:'#00C292'},
        {icon:'icon-folder-close-alt',color:'#03A9F3'},
        {icon:'icon-newspaper-o',color:'#FEC107'}
    ],
    //表字段类型
    tableColumnType: [
        { text: "Int", id: 1 }, //整型
        { text: "Nvarchar", id: 2 }, //可变字符串
        { text: "Real", id: 3 }, //浮点型
        { text: "Bit", id: 4 }, //布尔型
        { text: "Decimal", id: 5 }, //定点精度浮点型
        { text: "DateTime", id: 6 } //日期时间类型 
    ],
    //动作栏事件组
    actionButtons: {
        ////撤回
        //event_Recede: { type: "event_Recede", nodeRestrict: 0, style: "btn-danger", isEnable: false, displayText: "撤回" },
        ////除开始节点外撤回
        //event_FormRecede: { type: "event_Recede", nodeRestrict: 1, style: "btn-danger", isEnable: false, displayText: "撤回" },
        //开始节点挂起
        event_Waiting: { type: "event_Waiting", nodeRestrict: 0, style: "btn-primary", isEnable: false, displayText: "挂起" },
        //除开始节点外挂起
        event_FormWaiting: { type: "event_Waiting", nodeRestrict: 1, style: "btn-primary", isEnable: false, displayText: "挂起" },
        //提交
        event_Submit: { type: "event_Submit", nodeRestrict: 0, style: "btn-primary", isEnable: false, displayText: "提交" },
        //重新提交
        //event_ReSubmit: { type: "event_Resubmit", nodeRestrict: 0, style: "btn-primary", isEnable: false, displayText: "重新提交" },
        //保存草稿
        event_SaveToDraft: { type: "event_SaveToDraft", nodeRestrict: 0, style: "btn-success", isEnable: false, displayText: "保存草稿" },
        //审批中保存草稿
        event_SaveToDraftOne: { type: "event_SaveToDraft", nodeRestrict: 1, style: "btn-success", isEnable: false, displayText: "保存草稿" },
        //审批中保存数据
        event_SaveForm: { type: "event_SaveForm", nodeRestrict: 1, style: "btn-success", isEnable: false, displayText: "保存" },
        //保存模板
        event_SaveToTemplate: { type: "event_SaveToTemplate", nodeRestrict: 0, style: "btn-default", isEnable: false, displayText: "保存模板" },
        //删除
        event_Delete: { type: "event_Delete", nodeRestrict: 0, style: "btn-danger", isEnable: false, displayText: "删除" },
        //同意
        event_Agree: { type: "event_Agree", nodeRestrict: 1, style: "btn-primary", isEnable: false, displayText: "同意" },
        //拒绝
        event_Reject: { type: "event_Reject", nodeRestrict: 1, style: "btn-danger", isEnable: false, displayText: "拒绝" },
        //转发
        event_TurnOver: { type: "event_TurnOver", nodeRestrict: 1, style: "btn-default", isEnable: false, displayText: "转发" },
        //抄送
        event_Copy: { type: "event_Copy", nodeRestrict: 1, style: "btn-default", isEnable: false, displayText: "抄送" },
        //撤销
        //event_Cancel: { type: "event_Cancel", nodeRestrict: 1, style: "btn-default", isEnable: false, displayText: "撤销" },
        
        event_AdditionalSigner: { type: "event_AdditionalSigner", nodeRestrict: 1, style: "btn-default", isEnable: false, displayText: "加签" },
        //退回发起人
        event_RecedeToProposer: { type: "event_RecedeToProposer", nodeRestrict: 1, style: "btn-primary", isEnable: false, displayText: "退回发起人" },
        //退回上一步
        event_RecedeToPreviousStep: { type: "event_RecedeToPreviousStep", nodeRestrict: 1, style: "btn-primary", isEnable: false, displayText: "退回上一步" },
        //退回任意节点
        event_RecedeToAnyStep: { type: "event_RecedeToAnyStep", nodeRestrict: 1, style: "btn-primary", isEnable: false, displayText: "退回任意节点" },
        //退回指定节点
        event_RecedeToSepcificStep: { type: "event_RecedeToSepcificStep", nodeRestrict: 1, style: "btn-primary", isEnable: false, displayText: "退回指定节点" },
        //自动处理完成
        event_AutoHandle: { type: "event_AutoHandle", nodeRestrict: 2, style: "btn-primary", isEnable: false, displayText: "自动处理完成" },
        //与节点处理完成
        event_And: { type: "event_And", nodeRestrict: 3, style: "btn-primary", isEnable: false, displayText: "与节点处理完成" },
        //连接节点处理完成
        event_Connect: { type: "event_Connect", nodeRestrict: 4, style: "btn-primary", isEnable: false, displayText: "连接节点处理完成" },
        //判断节点处理完成
        event_Judge: { type: "event_Judge", nodeRestrict: 5, style: "btn-primary", isEnable: false, displayText: "判断节点处理完成" },
        //流程结束
        event_Finish: { type: "event_Finish", nodeRestrict: 6, style: "btn-primary", isEnable: false, displayText: "流程结束" },
        //结束节点打印
        event_FinishPrint: { type: "event_Print", nodeRestrict: 6, style: "btn-primary", isEnable: false, displayText: "打印" },
        //打印
        event_Print: { type: "event_Print", nodeRestrict: 1, style: "btn-primary", isEnable: false, displayText: "打印" },
        //打印
        event_PrintStart: { type: "event_Print", nodeRestrict: 0, style: "btn-primary", isEnable: false, displayText: "打印" }
    },
    //通知方式
    informType: {
        //邮件方式
        email: { text: "邮件", id: 1 },
        //短信方式
        sms: { text: "短信", id: 2 }
    },
    //通知类型
    noticeType: {
        //邮件方式
        Handle: { text: "处理", id: 1 },
        //短信方式
        notice: { text: "通知", id: 2 }
    },
    //模块类型
    moduleType: [{ text: 'BasicData', id: 1, count: 0 }, { text: 'Report', id: 2, count: 0 }, { text: 'Workflow', id: 3, count: 0 }, { text: 'Undefined', id: 0, count: 0 }],
    formDesignType: [{ id: 1, text: "BasicData" }, { id: 2, text: "Report" }, { id: 3, text: "Workflow" }], //表单类型
    businessTableType: [{ id: 2, text: "BusinessDatatable" }, { id: 3, text: "BasicDatatable" }, { id: 1, text: "SysDatatable" }], //数据表类型
    modulePageStatus: [{ id: 1, text: 'Launch' }, { id: 2, text: 'Approval' }, { id: 3, text: 'Check' }], //模块表单状态 1 打开 / 2 审批 / 3 查看
    controlStatus: [{ id: 'normal', text: 'Editable' }, { id: 'disabled', text: 'Disabled' }, { id: 'readonly', text: 'Readonly' }, { id: 'hidden', text: 'Hidden' }], //控件状态
    interfaceConfigProcessType: [{ text: "TotalQuantity", id: 1 }, { text: "Increment", id: 2 }],
    interfaceConfigLoopType: [{ text: "FixedTimePerDay", id: 1 }, { text: "FixedTimeInterval", id: 2 }, { text: "FixedTimeOfWorkingDay", id: 3 }, { text: "FixedTimeIntervalOfWorkingDay", id: 4 }],
    moduleRightType: [{ text: "All", id: 1 }, { text: "Group", id: 2 }, { text: "Job", id: 3 }, { text: "Role", id: 4 }, { text: "JobLevel>=", id: 5 }, { text: "JobLevel<=", id: 6 }
        //, { text: "JobLevel=", id: 7 }
    ],
    globalModuleOpenType: [{ id: 1, text: 'Embedded' }, { id: 2, text: 'NewWindow' }],
    moduleOpenType: [{ id: 0, text: 'Inherit' }, { id: 1, text: 'Embedded' }, { id: 2, text: 'NewWindow' }],
    moduleRightControl: [{ text: "Allow", id: 1 }, { text: "Disabled", id: 2 }],
    taskStatus: [{ id: '', text: '全部' }, { id: '0', text: '等待审批' }, { id: '1', text: '审批完成' }, { id: '7', text: '已拒绝' }, { id: '9', text: '已取消' }],


    procStatus: [{ id: '', text: '' }, { id: '1', text: 'TaskFinishStatus' }, { id: '0', text: 'Approving' }, { id: '7', text: 'Refused' }],
    //purchaseStatus: [{ id: 0, text: 'PendingPurchase' }, { id: 1, text: 'AlreadyPurchase' }, { id: 7, text: 'Refused' }],
    purchaseStatus: [{ id: '', text: '全部' }, { id: '2', text: '已订购' }, { id: '0', text: '待处理' }, { id: '1', text: '已处理' }, { id: '7', text: '已拒绝' }],
    cashierWorkflow: [{ id: '', text: '全部' }, { id: '9ef84c0d-5c5b-40d9-9044-887b3f6e3687', text: '出差报销流程' }, { id: 'eb7995e7-7fed-4fa8-bf20-fb711988f9e4', text: '业务招待报销流程' }, { id: '30250859-e917-4776-bcce-ee4b5abedb9f', text: '礼品报销流程' }, { id: 'ff09cfc1-6206-453c-b69f-1ba4a83eb264', text: '其他费用报销申请流程' }],
    sourceType: [{ id: '', text: "" }, { id: '1', text: 'BasicData' }, { id: '2', text: 'DataView' }],
    cashierStatus: [{ id: '', text: '全部' }, { id: '0', text: '待审批' }, { id: '1', text: '已审批' }],
    popcStatus: [{ id: '', text: '全部' }, { id: '1', text: '未做合同' }, { id: '2', text: '已做合同' }],
    expenseType: [{ id: '', text: '' }, { id: '1', text: '住宿费' }, { id: '2', text: '伙食费' }, { id: '3', text: '其他杂费' }, { id: '4', text: '手续费/保险费' }, { id: '5', text: '出租车/市内交通费' }, { id: '6', text: '车船费' }],
    viewType: [{ id: 1, text: '系统视图' }, { id: 2, text: '数据源视图' }, { id: 3, text: '报表视图' }, { id: 4, text: '匹配视图' }]

};
