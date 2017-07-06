﻿(function () {
    'use strict';
    var controllerId = "syspages.views.my.workflowcenter.wfsearch";
    angular.module('syspages').controller(controllerId, [
        '$scope', 'mabp.app.task', 'mabp.app.workflow', 'workflowModuleTransfer',
        function ($scope, service, wfService, module) {
            var vm = this;
            vm.statusDetails = enums.get("procStatus");
            vm.paging = _shared.initialPage(vm, 1, 10, 'refId', false);

            vm.load = function () {
                wfService.getAllCategories().then(function (data) {
                    if (!!data) {
                        vm.categories = data;
                        vm.categories.splice(0, 0, { id: '', text: '' });
                    }
                });
            }

            vm.load();

            vm.selectModel = {
                creationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD"),//申请开始时间
                creationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD")//申请结束时间
                //finishTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",//完成开始时间
                //finishTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"//完成结束时间
            };

            vm.select = function () {
                service.getMyAdvancedTasks({ pageInput: vm.paging, TaskSelectDto: vm.selectModel }).then(function (data) {
                    if (!!data) {
                        vm.models = data.model;
                        vm.paging.totalCount = data.totalCount;
                    }
                });
            }

            vm.clear = function () {
                vm.selectModel = {
                    status: '',
                    wfdWorkflowId: '',
                    categoryId: '',
                    creationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD"),//申请开始时间
                    creationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") //申请结束时间
                    //finishTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",//完成开始时间
                    //finishTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"//完成结束时间
                };
            }

            vm.loadWf = function (i) {
                if (!!i[0]) {
                    wfService.getAllWorkflows({ id: i[0].id }).then(function (data) {
                        if (!!data) {
                            vm.wfs = data;
                            vm.wfs.splice(0, 0, { id: '', text: '' });
                        }
                    });
                }
            }

            vm.edit = function (wf) {
                module.checkout(wf.appPageId, wf.wfdWorkflowNodeId, wf);
            }

        }
    ]);
})();