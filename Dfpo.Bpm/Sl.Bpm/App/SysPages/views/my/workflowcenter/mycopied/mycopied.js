(function () {
    'use strict';
    var controllerId = "syspages.views.my.workflowcenter.mycopied";
    angular.module('syspages').controller(controllerId, [
        '$scope', 'workflowModuleTransfer', 'mabp.app.task',
        function ($scope, module, service) {
            var vm = this;
            vm.paging = _shared.initialPage(vm, 1, 8, 'refId', false);
            vm.moduleId = null;
            vm.paging.filters = [
                { name: 'moduleType', value: '6' }
            ];

            function getMyCopiedTasksDataTable() {
                return service.getMyCopiedTasksDataTable(vm.paging).then(function (data) {
                    vm.models = data.data;
                    _.forEach(vm.models, function (data) {
                        $scope.getTaskStatus(data);
                    });
                    vm.paging.totalCount = data.totalCount;
                });
            }

            vm.load = function (isRefresh) {
                vm.paging.filters = [{ name: 'moduleIds', value: vm.moduleIds }, { name: 'filterText', value: vm.filterText }, { name: 'moduleType', value: '6' }];
                vm.paging.filters = vm.paging.filters.concat(mabp.toArray(vm.filter));

                if (isRefresh)
                    mabp.ui.setLoading(".panel-body", getMyCopiedTasksDataTable());
                else
                    getMyCopiedTasksDataTable();
            }

            vm.loadColumnConfig = function () {
                service.getColumnConfigs(vm.moduleIds).then(function (data) {
                    vm.columnLists = _.filter(data[0].colimnConfigs, function (data) {
                        return data.value = data.value.lowerFirst();
                    });
                });

                vm.filter = {
                    currentStatus: ''
                }
                vm.paging.currentPage = 1;
                vm.load(true);
            }

            vm.loadModuleType = function () {
                service.getModuleCountsForType(vm.paging).then(function (data) {
                    vm.moduleTypes = data;
                    vm.load(true);
                });
            }

            vm.loadModuleType();

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


        }
    ]);
})();