(function () {
    'use strict';
    var controllerId = "syspages.views.my.dashboard";
    angular.module('syspages').controller(controllerId, [
        '$scope', '$modal', 'dialog', 'asdialog', 'mabp.app.module', 'moduleHandler', 'mabp.app.bpm', 'mabp.app.task',
        function ($scope, $modal, dialog, asdialog, service, module, bpmService, taskService) {
            var vm = this;

            vm.filter = {
                searchStartTime: moment(new Date(2016, 5, 28)).startOf('month').format("YYYY-MM-DD") + " 00:00:00"
            }

            function getAllFavouriteWorkflowModules() {
                return bpmService.getUserJobs().then(function (data) {
                    vm.jobs = data;
                    service.getAllFavouriteModules().then(function (result) {
                        vm.favouriteList = result;
                    });
                });
            }

            function getPendingHandleTasks() {
                //待我审批的流程（取前10条
                vm.paging = _shared.initialPage(vm, 1, 10, 'recvTime', false);
                vm.paging.filters = [];
                vm.paging.filters = vm.paging.filters.concat(mabp.toArray(vm.filter));
                return taskService.getPendingHandleTasksDataTable(vm.paging).then(function (data) {
                    vm.pendinghandleList = data.data;
                });
            }
            function getMyRaisedTasks() {
                vm.paging = _shared.initialPage(vm, 1, 10, 'creationTime', false);
                //我发起的流程（取前10条
                vm.paging.filters = [];
                vm.paging.filters = vm.paging.filters.concat(mabp.toArray(vm.filter));
                return taskService.getMyRaisedTasksDataTable(vm.paging).then(function (data) {
                    vm.myraisedList = data.data;
                });
            }
            vm.load = function (isRefresh) {
                if (!isRefresh) {
                    mabp.ui.setLoading(".load_1", getAllFavouriteWorkflowModules());
                    mabp.ui.setLoading(".load_2", getPendingHandleTasks());
                    mabp.ui.setLoading(".load_3", getMyRaisedTasks());
                } else {
                    getAllFavouriteWorkflowModules();
                    getPendingHandleTasks();
                    getMyRaisedTasks();
                }


            }
            vm.openModule = function (m) {
                mabp.ui.setBusying('.load_1',
                module.open(m).then(function (result) {
                    vm.load(true);
                }));
            }

            vm.approveWorkflow = function (wf) {
                module.approve(wf.appPageId, wf.wfdWorkflowNodeId, wf).then(function (result) {
                    //getPendingHandleTasks();
                    vm.load(true);
                });
            }
            vm.checkoutWorkflow = function (wf) {
                module.checkout(wf.appPageId, wf.wfdWorkflowNodeId, wf).then(function (result) {
                    //getPendingHandleTasks();
                    vm.load(true);
                });
            }

            vm.load();
        }
    ]);
})();