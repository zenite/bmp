(function () {
    'use strict';
    var controllerId = "syspages.views.my.workflowcenter.pendingread";
    angular.module('syspages').controller(controllerId, [
        '$scope', '$modal', 'dialog', 'asdialog', 'mabp.app.task', 'workflowModuleTransfer',
        function ($scope, $modal, dialog, asdialog, service, module) {
            var vm = this;
            vm.paging = _shared.initialPage(vm, 1, 12, 'refId', false);

            vm.load = function () {
                vm.paging.filters = [{ name: 'moduleIds', value: vm.moduleIds }, { name: 'moduleType', value: '9' }];
                vm.paging.filters = vm.paging.filters.concat(mabp.toArray(vm.filter));

                service.getPendingReadTasksDataTable(vm.paging).then(function (data) {
                    vm.models = data.data;
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
                service.updatePendingReadTask({ Id: wf.readId }).then(function () {
                    vm.load();
                });
            }

            //vm.select = function () {
            //    vm.paging.filters = [{ name: 'filterText', value: vm.filterText }];
            //    vm.paging.currentPage = 1;
            //    vm.load();
            //}

            //vm.event_Keydown = function (event) {
            //    if (event.keyCode == 13) {
            //        vm.select();
            //    }
            //}

            vm.filter = {
                currentStatus: ''
            }

            vm.showSearch = false;
            vm.show = function () {
                vm.showSearch = !vm.showSearch;
            }

            vm.taskStatus = enums.get("taskStatus");

            vm.selectS = function () {
                vm.paging.currentPage = 1;
                vm.load();
            }

            vm.clearS = function () {
                vm.filter = {
                    currentStatus: ''
                }
                vm.paging.currentPage = 1;
                vm.load();
            }

            vm.readAll = function () {
                service.updatePendingReadTasks().then(function () {
                    vm.load();
                });
            }

        }
    ]);
})();