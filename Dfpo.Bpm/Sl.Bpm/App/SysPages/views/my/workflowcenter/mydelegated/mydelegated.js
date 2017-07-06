(function () {
    'use strict';
    var controllerId = "syspages.views.my.workflowcenter.mydelegated";
    angular.module('syspages').controller(controllerId, [
        '$scope', 'workflowModuleTransfer', 'mabp.app.task',
        function ($scope, module, service) {
            var vm = this;
            vm.paging = _shared.initialPage(vm, 1, 12, 'refId', false);

            vm.load = function () {
                vm.paging.filters = [{ name: 'moduleIds', value: vm.moduleIds }, { name: 'filterText', value: vm.filterText }, { name: 'moduleType', value: '8' }];
                service.getMyDelegatedTasks(vm.paging).then(function (data) {
                    vm.models = data.model;
                    _.forEach(vm.models, function (data) {
                        $scope.getTaskStatus(data);
                    });
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