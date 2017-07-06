(function () {
    'use strict';
    var controllerId = "syspages.views.my.workflowcenter.myraised";
    angular.module('syspages').controller(controllerId, [
        '$scope', 'workflowModuleTransfer', 'mabp.app.task', 'dialog',
        function ($scope, module, service, dialog) {
            var vm = this;
            vm.paging = _shared.initialPage(vm, 1, 8, 'refId', false);
            vm.paging.filters = [{ name: 'moduleType', value: '4' }];
            vm.moduleId = null;
            vm.taskStatus = enums.get("taskStatus");

            vm.showSearch = false;
            vm.show = function () {
                vm.showSearch = !vm.showSearch;
            }

            function getMyRaisedTasksDataTable() {
                return service.getMyRaisedTasksDataTable(vm.paging).then(function (data) {
                    vm.models = data.data;
                    _.forEach(vm.models, function (data) {
                        $scope.getTaskStatus(data);
                    });
                    vm.paging.totalCount = data.totalCount;
                });
            }

            vm.load = function (isRefresh) {
                vm.paging.filters = [{ name: 'moduleIds', value: vm.moduleIds }, { name: 'filterText', value: vm.filterText }, { name: 'moduleType', value: '4' }];
                vm.paging.filters = vm.paging.filters.concat(mabp.toArray(vm.filter));

                if (isRefresh)
                    mabp.ui.setLoading(".panel-body", getMyRaisedTasksDataTable());
                else
                    getMyRaisedTasksDataTable();
            }

            vm.loadModuleType = function () {
                service.getModuleCountsForType(vm.paging).then(function (data) {
                    vm.moduleTypes = data;
                    vm.load(true);
                });
            }

            vm.loadColumnConfig = function () {
                service.getColumnConfigs(vm.moduleIds).then(function (data) {
                    vm.columnLists = _.filter(data[0].colimnConfigs, function (data) {
                        return data.value = data.value.lowerFirst();
                    });
                });
                vm.filter = {
                    searchStartTime: moment(new Date()).days(0 - 90).format('YYYY-MM-DD') + " 00:00:00",
                    searchEndTime: moment(new Date()).format("YYYY-MM-DD") + " 23:59:59",
                    currentStatus: ''
                }
                vm.paging.currentPage = 1;
                vm.load(true);
            }

            vm.loadModuleType();

            vm.edit = function (wf) {
                service.getHandledNode({ Id: wf.taskId }).then(function (data) {
                    vm.nodes = data;
                    if (vm.nodes.length > 1) {
                        dialog.open(_shared.dialogs['handledNodeSelect'], vm.nodes).then(function (result) {
                            if (result) {
                                module.checkout(wf.appPageId, result, wf);
                            }
                        });
                    } else {
                        module.checkout(wf.appPageId, vm.nodes[0].id, wf);
                    }
                });
            }

            vm.mark = function (m) {
                m.isMarked = m.isMarked === null ? true : false;
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

            vm.recede = function (m) {
                mabp.message.confirm('撤回该任务', null, function (result) {
                    if (result)
                        service.event_Recede(m).then(function () {
                            mabp.notify.success("撤回该任务成功！");
                            vm.load();
                        });
                });
            }

            vm.filter = {
                searchStartTime: moment(new Date()).days(0 - 90).format('YYYY-MM-DD') + " 00:00:00",
                searchEndTime: moment(new Date()).format("YYYY-MM-DD") + " 23:59:59",
                currentStatus: ''
            }

            vm.selectS = function () {
                vm.paging.currentPage = 1;
                vm.load();
            }

            vm.clearS = function () {
                vm.filter = {
                    searchStartTime: moment(new Date()).days(0 - 90).format('YYYY-MM-DD') + " 00:00:00",
                    searchEndTime: moment(new Date()).format("YYYY-MM-DD") + " 23:59:59",
                    currentStatus: ''
                }
                vm.paging.currentPage = 1;
                vm.load();
            }

            vm.exportExcel = function () {
                vm.pagingExport = {};
                vm.pagingExport.filters = [{ name: 'moduleIds', value: vm.moduleIds },
                    { name: 'moduleType', value: '4' }];
                vm.pagingExport.filters = vm.pagingExport.filters.concat(mabp.toArray(vm.filter));
                vm.pagingExport.pageSize = 2147483647;
                vm.pagingExport.currentPage = 1;
                vm.pagingExport.orderByProperty = "refId";
                vm.pagingExport.ascending = false;
                jQuery.download('/File/DownloadWorkflow', vm.pagingExport);
            }


        }
    ]);
})();