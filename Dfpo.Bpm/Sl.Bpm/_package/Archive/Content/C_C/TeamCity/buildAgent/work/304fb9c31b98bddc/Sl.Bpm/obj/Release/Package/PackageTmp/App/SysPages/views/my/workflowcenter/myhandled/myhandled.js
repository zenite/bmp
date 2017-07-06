(function () {
    'use strict';
    var controllerId = "syspages.views.my.workflowcenter.myhandled";
    angular.module('syspages').controller(controllerId, [
        '$scope', '$modal', 'dialog', 'asdialog', 'mabp.app.task', 'workflowModuleTransfer',
        function ($scope, $modal, dialog, asdialog, service, module) {
            var vm = this;
            vm.moduleId = null;
            vm.paging = _shared.initialPage(vm, 1, 8, 'ProcTime', false);
            vm.paging.filters = [
                { name: 'moduleType', value: '5' }
            ];

            vm.showSearch = false;
            vm.show = function () {
                vm.showSearch = !vm.showSearch;
            }

            vm.taskStatus = enums.get("taskStatus");

            function getMyHandledTasksDataTable() {
                return service.getMyHandledTasksDataTable(vm.paging).then(function (data) {
                    vm.models = data.data;
                    _.forEach(vm.models, function (data) {
                        if (data.taskStatus == 1) {
                            data.taskTitle = L('TaskFinishStatus');
                        }
                        if (data.taskStatus == 7) {
                            data.taskTitle = L('TaskRejectStatus');
                        }
                        if (data.taskStatus == 9) {
                            data.taskTitle = L('TaskCanceled');
                        }
                        if (data.taskStatus == 0) {
                            data.taskTitle = data.procUserName;
                        }
                    });
                    vm.paging.totalCount = data.totalCount;
                });
            }

            vm.load = function (isRefresh) {
                vm.paging.filters = [
                { name: 'moduleIds', value: vm.moduleIds },
                { name: 'moduleType', value: '5' }
                ];
                vm.paging.filters = vm.paging.filters.concat(mabp.toArray(vm.filter));

                if (isRefresh)
                    mabp.ui.setLoading(".panel-body", getMyHandledTasksDataTable());
                else
                    getMyHandledTasksDataTable();
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
                    searchStartTime: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
                    searchEndTime: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
                    currentStatus: ''
                }
                vm.paging.currentPage = 1;
                vm.load(true);
            }

            vm.loadModuleType();

            vm.edit = function (wf) {
                module.checkout(wf.appPageId, wf.wfdWorkflowNodeId, wf);
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
                searchStartTime: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
                searchEndTime: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
                currentStatus: ''
            }

            vm.selectS = function () {
                vm.paging.currentPage = 1;
                vm.load();
            }

            vm.clearS = function () {
                vm.filter = {
                    searchStartTime: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
                    searchEndTime: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
                    currentStatus: ''
                }
                vm.paging.currentPage = 1;
                vm.load();
            }

            vm.exportExcel = function () {
                vm.pagingExport = {};
                vm.pagingExport.filters = [{ name: 'moduleIds', value: vm.moduleIds },
                    { name: 'moduleType', value: '5' }];
                vm.pagingExport.filters = vm.pagingExport.filters.concat(mabp.toArray(vm.filter));
                vm.pagingExport.pageSize = 2147483647;
                vm.pagingExport.currentPage = 1;
                vm.pagingExport.orderByProperty = "ProcTime";
                vm.pagingExport.Ascending = false;
                jQuery.download('/File/DownloadWorkflow', vm.pagingExport);
            }


        }
    ]);
})();