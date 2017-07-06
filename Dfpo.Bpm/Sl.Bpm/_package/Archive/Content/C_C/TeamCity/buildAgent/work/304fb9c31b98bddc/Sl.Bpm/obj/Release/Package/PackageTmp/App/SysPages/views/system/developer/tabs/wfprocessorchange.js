﻿(function () {
    var controllerId = app.dialogs.define('wfProcessorChange', '/App/SysPages/views/system/developer/tabs/wfprocessorchange.html');
    angular.module('syspages').controller(controllerId, ['params', 'mabp.app.task', 'dialog', function (params, service, dialog) {
        var vm = this;
        vm.params = params;

        vm.load = function () {
            service.getProcHistory({ Id: vm.params.taskId }).then(function (data) {
                vm.allTaskInfos = data;
            });
        }

        vm.load();

        vm.getProcer = function (i) {
            return i.procUserId === i.procOwnerId ? i.procUserName : i.procUserName + "(" + L("ProxyFor") + i.procOwnerName + ")";
        }

        vm.changeProcessor = function (i) {
            dialog.open(_shared.dialogs.jobUserDialog, { enterpriseId: null }).then(function (data) {
                if (!!data) {
                    //调用ChangeProcessor方法
                    var d = data[0];
                    service.changeProcessor({
                        procId: i.procId, taskId: i.taskId, ProcUserJobId: d.jobId, ProcUserId: d.userId, procOwnerName: i.procOwnerName, procUserName: d.userName
                    }).then(function (val) {
                        i.procUserId = val.procUserId;
                        i.procUserJobId = val.procUserJobId;
                        i.procOwnerId = val.procOwnerId;
                        i.procOwnerJobId = val.procOwnerJobId;
                        i.procUserName = val.procUserName;
                        i.procOwnerName = val.procOwnerName;
                    });
                }
            });
        }

        vm.clearToProposer = function () {
            if (vm.params.taskStatus !== 0) {
                mabp.notify.warn("该流程已结束，不能退回");
                return false;
            }
            mabp.message.confirm("确认清除审批记录并退回发起人？", "确认", function (isConfirmed) {
                if (isConfirmed) {
                    service.clearToProposer({ TaskId: vm.params.taskId, ProcId: vm.lastProcId }).then(function (data) {
                        vm.allTaskInfos = data;
                    });
                }
            });

        }

        vm.backToProposer = function () {
            if (vm.params.taskStatus !== 0) {
                mabp.notify.warn("该流程已结束，不能退回");
                return false;
            }
            mabp.message.confirm("确认退回发起人？", "确认", function (isConfirmed) {
                if (isConfirmed) {
                    service.backToProposer({ TaskId: vm.params.taskId, ProcId: vm.allTaskInfos[vm.allTaskInfos.length - 1].procId }).then(function (data) {
                        vm.allTaskInfos = data;
                    });
                }
            });
        }

    }]);
})();