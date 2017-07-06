(function () {
    'use strict';
    var controllerId = "syspages.views.my.workflowcenter.mycopied";
    angular.module('syspages').controller(controllerId, [
        '$scope', 'workflowModuleTransfer', 'mabp.app.task',
        function ($scope, module, service) {
            var vm = this;
            vm.paging = _shared.initialPage(vm, 1, 8, 'refId', false);

            vm.load = function () {
                vm.paging.filters = [{ name: 'moduleIds', value: vm.moduleIds }, { name: 'filterText', value: vm.filterText }, { name: 'moduleType', value: '6' }];
                service.getMyCopiedTasks(vm.paging).then(function (data) {
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
                module.checkout(wf.appPageId, wf.wfdWorkflowNodeId, wf);
            }

            vm.mark = function (m) {
                m.isMarked = m.isMarked === false ? true : false;
                service.markTask(m).then(function () {
                    if (m.isMarked) {
                        mabp.notify.success("标记成功");
                    } else {
                        mabp.notify.success("取消标记成功");
                    }
                    vm.load();
                }, function () {
                    vm.load();
                });
            }

            vm.select = function () {
                vm.paging.filters = [{ name: 'filterText', value: vm.filterText }];
                vm.paging.currentPage = 1;
                vm.load();
            }

            vm.event_Keydown = function (event) {
                if (event.keyCode == 13) {
                    vm.select();
                }
            }
        }
    ]);
})();