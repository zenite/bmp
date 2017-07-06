(function () {
    'use strict';
    var controllerId = "syspages.views.my.workflowcenter.mydraft";
    angular.module('syspages').controller(controllerId, [
        '$scope', '$modal', 'dialog', 'asdialog', 'mabp.app.task', 'workflowModuleTransfer',
        function ($scope, $modal, dialog, asdialog, service, module) {
            var vm = this;
            vm.paging = _shared.initialPage(vm, 1, 12, 'lastModificationTime', false);

            vm.load = function () {
                vm.paging.filters = [{ name: 'moduleIds', value: vm.moduleIds }, { name: 'filterText', value: vm.filterText }, { name: 'moduleType', value: '3' }];
                service.getMyDraftTasks(vm.paging).then(function (data) {
                    vm.models = data.model;
                    vm.paging.totalCount = data.totalCount;
                });
                vm.loadModuleType();
            }

            vm.loadModuleType = function () {
                service.getModuleCountsForType(vm.paging).then(function (data) {
                    vm.moduleTypes = data;
                });
            }

            vm.load();

            vm.edit = function (wf) {
                var jobs = [{ jobId: wf.createByJobId }];
                if (wf.procId != null) {
                    //单纯保存表单 是无需从草稿箱打开的 这段代码待删除。
                    module.approve(wf.appPageId, wf.wfdWorkflowNodeId, wf).then(function () {
                        vm.load();
                    });
                } else {
                    module.openDraft(wf.appPageId, wf.wfdWorkflowNodeId, jobs, wf).then(function () {
                        vm.load();
                    });
                }
            }

            vm.delete = function (m) {
                service.event_DeleteDraft(m).then(function () {
                    mabp.notify.success("删除草稿成功");
                    vm.load();
                });
            }

        }
    ]);
})();