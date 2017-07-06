(function () {
    'use strict';
    var controllerId = "syspages.views.my.workflowcenter.pendinghandle";
    angular.module('syspages').controller(controllerId, [
        '$scope', '$modal', 'dialog', 'asdialog', 'mabp.app.task', 'workflowModuleTransfer',
        function ($scope, $modal, dialog, asdialog, service, module) {
            var vm = this;
            vm.paging = _shared.initialPage(vm, 1, 8, 'refId', false);
            vm.paging.filters = [{ name: 'moduleType', value: '1' }];
            vm.moduleId = null;

            vm.showSearch = false;
            vm.show = function () {
                vm.showSearch = !vm.showSearch;
            }

            function getPendingHandleTasksDataTable() {
                return service.getPendingHandleTasksDataTable(vm.paging).then(function (data) {
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
                vm.paging.filters = [{ name: 'moduleIds', value: vm.moduleIds }, { name: 'filterText', value: vm.filterText }, { name: 'moduleType', value: '1' }];
                vm.paging.filters = vm.paging.filters.concat(mabp.toArray(vm.filter));

                if (isRefresh)
                    mabp.ui.setLoading(".panel-body", getPendingHandleTasksDataTable());
                else
                    getPendingHandleTasksDataTable();

                //service.getPendingHandleTasks(vm.paging).then(function (data) {
                //    vm.models = data.model;
                //    vm.paging.totalCount = data.totalCount;
                //    _.forEach(vm.models, function (item) {
                //        //item.tasks = mabp.toObject(item.columnValueList);
                //        item.tasks = JSON.parse(item.columnJson);
                //    });
                //});
            }

            vm.loadModuleType = function () {
                service.getModuleCountsForType(vm.paging).then(function (data) {
                    vm.moduleTypes = data;
                    vm.load();
                });
            }

            vm.loadColumnConfig = function () {
                service.getColumnConfigs(vm.moduleIds).then(function (data) {
                    vm.columnLists = _.filter(data[0].colimnConfigs, function (data) {
                        return data.value = data.value.lowerFirst();
                    });
                });
                vm.filter = {
                    //searchStartTime: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
                    //searchEndTime: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
                    currentStatus: ''
                }
                vm.paging.currentPage = 1;
                vm.load(true);
            }

            vm.loadModuleType();

            vm.edit = function (wf) {
                module.approve(wf.appPageId, wf.wfdWorkflowNodeId, wf).then(function (result) {
                    if (result)
                        vm.loadModuleType();
                });
            }

            vm.submit = function (wf) {
                mabp.notify.info("同意方法未完成");
            }

            vm.reject = function (wf) {
                mabp.notify.info("拒绝方法未完成");
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

            vm.waiting = function (m) {
                m.isWaiting = m.isWaiting === 1 ? 0 : 1;
                service.event_Waiting(m).then(function () {
                    if (m.isWaiting == 1) {
                        mabp.notify.success("挂起成功，请到我挂起的流程中查看！");
                    } else {
                        mabp.notify.success("启动成功，请到待办流程中处理！");
                    }
                    vm.loadModuleType();
                }, function () {
                    vm.loadModuleType();
                });
            }

            vm.filter = {
                //searchStartTime: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
                //searchEndTime: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
                currentStatus: ''
            }

            vm.selectS = function () {
                vm.paging.currentPage = 1;
                vm.load();
            }

            vm.clearS = function () {
                vm.filter = {
                    //searchStartTime: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
                    //searchEndTime: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
                    currentStatus: ''
                }
                vm.paging.currentPage = 1;
                vm.load();
            }

            vm.exportExcel = function () {
                vm.pagingExport = {};
                vm.pagingExport.filters = [{ name: 'moduleIds', value: vm.moduleIds }, { name: 'moduleType', value: '1' }];
                vm.pagingExport.filters = vm.pagingExport.filters.concat(mabp.toArray(vm.filter));
                vm.pagingExport.pageSize = 2147483647;
                vm.pagingExport.currentPage = 1;
                vm.pagingExport.orderByProperty = "refId";
                vm.pagingExport.Ascending = false;
                jQuery.download('/File/DownloadWorkflow', vm.pagingExport);
            }



        }
    ]);
})();