(function () {
    'use strict';
    var controllerId = "syspages.views.my.workflowcenter.pendinghandle";
    angular.module('syspages').controller(controllerId, [
        '$scope', '$modal', 'dialog', 'asdialog', 'mabp.app.task', 'workflowModuleTransfer', '$interval', '$timeout',
        function ($scope, $modal, dialog, asdialog, service, module, $interval, $timeout) {
            var vm = this;
            vm.paging = _shared.initialPage(vm, 1, 8, 'refId', false);
            vm.paging.filters = [{ name: 'moduleType', value: '1' }];
            vm.moduleId = null;
            vm.allThDom = [];
            //设置排序样式
            function setClass(dm, addedClass) {
                vm.allThDom.removeClass('up');
                vm.allThDom.removeClass('down');
                vm.allThDom.addClass('both');
                dm.removeClass('up');
                dm.removeClass('down');
                dm.removeClass('both');
                dm.addClass(addedClass);
            }

            function setOrderByAscending(dom) {
                if (dom == null) return true;
                if (dom.hasClass('up')) {
                    setClass(dom, 'down');
                    return false;
                } else if (dom.hasClass('down')) {
                    setClass(dom, 'up');
                    return true;
                } else if (dom.hasClass('both')) {
                    setClass(dom, 'up');
                    return true;
                }
                return true;
            }

            vm.bindedDom = false;
            vm.bindSort = function () {
                if (vm.bindedDom) return;
                vm.bindedDom = true;
                vm.allThDom = $('th.order');
                vm.allThDom.on('click', function (event) {
                    var dom = $(this);
                    var propName = dom.attr('name');
                    vm.paging.orderByProperty = propName;
                    vm.paging.ascending = setOrderByAscending(dom);;
                    vm.load();
                });

                //todo:多列排序，正反序；2个参数，排序字段，排序正反
                //                vm.paging.orderByProperty = dd;
                //                vm.paging.ascending = true;
                //                vm.load();
            }



            vm.showSearch = false;
            vm.show = function () {
                vm.showSearch = !vm.showSearch;
            }

            function getPendingHandleTasksDataTable() {
                return service.getPendingHandleTasksDataTable(vm.paging).then(function (data) {
                    vm.models = data.data;
                    _.forEach(vm.models, function (data) {
                        $scope.getTaskStatus(data);
                    });
                    vm.paging.totalCount = data.totalCount;
                    $timeout(function () {
                        vm.bindSort();
                    }, 100);
                });
            }
            //五秒一刷
            //var refreshPending = $interval(function () {
            //    vm.load();
            //}, 5000);
            //$scope.$on('$destroy', function () {
            //    $interval.cancel(refreshPending);
            //});

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
            //            window._$refresh = function () {
            //                vm.load();
            //            }
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
                    //searchStartTime: moment(new Date()).days(0 - 90).format('YYYY-MM-DD') + " 00:00:00",
                    //searchEndTime: moment(new Date()).format("YYYY-MM-DD") + " 23:59:59",
                    currentStatus: ''
                }
                vm.paging.currentPage = 1;
                vm.load(true);
            }

            vm.loadModuleType();

            vm.edit = function (wf) {
                wf.reloadTasks = vm.loadModuleType;
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
                //searchStartTime: moment(new Date()).days(0 - 90).format('YYYY-MM-DD') + " 00:00:00",
                //searchEndTime: moment(new Date()).format("YYYY-MM-DD") + " 23:59:59",
                currentStatus: ''
            }

            vm.selectS = function () {
                vm.paging.currentPage = 1;
                vm.load();
            }

            vm.clearS = function () {
                vm.filter = {
                    //searchStartTime: moment(new Date()).days(0 - 90).format('YYYY-MM-DD') + " 00:00:00",
                    //searchEndTime: moment(new Date()).format("YYYY-MM-DD") + " 23:59:59",
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
                vm.pagingExport.ascending = false;
                jQuery.download('/File/DownloadWorkflow', vm.pagingExport);
            }
        }
    ]);
})();