
//base = { }
//base.html             //页面HTML
//base.js               //页面Js
//base.moduleIdentity   //页面所属模块标识Id
//base.moduleId         //页面模块Id
//base.fileName         //首页文件名
//base.pageId           //页面Id
//** caller 为后台方法调用器  (第一个参数为类名.方法名, 第二个参数为 简单对象类型)
function controller(base, form, program) {
    debugger;
    form.$event_print_before = function (btn) {
        program('UpdatePrintTime', { taskId: base.taskId });
        window.open("/SysPages/AppPage?nodeId={0}&pageId={1}&jobId={2}&taskId={3}&procId={4}&draftId={5}&isPrint={6}".fill(
               base.nodeId,
               base.pageId,
               base.jobId,
               base.taskId,
               '',
               '',
               '1'
           ));
        btn.noConfirm = true;
        return false;
    }
    //设置维护对象默认值
    form.$page_load = function () {          
        debugger;
        form.it04.code = form.it04.type;
        if (form.it04.maintenanceObject == null) {
            form.it04.maintenanceObject = base.applicant.jobId;
        } debugger;
    }
    //自动带出类型
    form.$watch("form.it04.maintenanceObject", function () {
        form.refreshExpenseTypeSource();
    })
    form.refreshExpenseTypeSource = function () {
        console.log('Start GetAllTypes');
        console.log('GetAllTypes');
        program('GetAllTypes', { language: base.language }, function (data) {
            form.$state.expenseTypeSource = data;
        });
    }
    //带出后续审批人
    form.chooseApproval = function (row) {
        debugger;
        if (row[0] != null) {
            form.it04.approver = row[0].approver;
            form.it04.changeApproval = "1";
            if (form.it04.type == form.it04.code) {
                form.it04.changeApproval = "0";
            }
        }
        debugger;
    }
}