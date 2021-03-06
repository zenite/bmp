﻿(function () {
    var controllerId = _shared.dialogs.define('fmJobSelectDialog', '/App/_shared/component/job/fm.job.select.html');
    angular.module('app.shared').controller(controllerId, ['mabp.app.bpm', 'params', '$scope', 'treeTool',
        function (groupService, params, $scope, treeTool) {
            var vm = this;
            vm.selectedGroupId = "";
            vm.jobs = [];
            //查询文本
            vm.selectTxt = "";
            vm.ismulti = params.ismulti;
            vm.hideUser = params.hideUser;
            vm.data = [];
            var _arr = [];
            for (var i = 0; i < params.data.length; i++) {
                vm.data.push({ id: params.data[i].id, text: params.data[i].text });
                _arr.push(params.data[i].id);
            }
            vm.fmModel = _arr.join(",");

            vm.selectJob = function () {
                var arr = [];
                for (var i = 0; i < vm.jobs.length; i++) {
                    if (vm.selectTxt == "") {
                        arr.push(vm.jobs[i]);
                    } else {
                        if (vm.jobs[i].jobName.indexOf(vm.selectTxt) >= 0 || vm.jobs[i].jobUsers.indexOf(vm.selectTxt) >= 0) arr.push(vm.jobs[i]);
                    }
                }
                return arr;
            }

            //单选情况下保存并返回
            vm.trCheck = function (data) {
                if (!params.ismulti) {
                    $scope.$close(data.id);
                } else {
                    var arr = (vm.fmModel ? vm.fmModel.split(",") : []);
                    if (vm.isCheck(data)) {
                        for (var i = 0; i < vm.data.length; i++) {
                            if (vm.data[i].id == data.id) {
                                vm.data.splice(i, 1);
                                break;
                            }
                        }
                        arr.splice(arr.indexOf(data.id), 1);
                        
                    } else {
                        arr.push(data.id);
                        vm.data.push({ id: data.id, text: data.jobName + '(' + data.jobUsers + ')' });
                    }
                    vm.fmModel = arr.join(",");
                }
            };

            //保存并返回
            vm.save = function () {
                $scope.$close(vm.fmModel);
            }

            //判断是否已选择
            vm.isCheck = function (item) {
                return !!item ? ((vm.fmModel || "").split(",").indexOf(item["id"]) >= 0) : false;
            }

            groupService.getGroupTree().then(function (data) {
                vm.groupArray = data;
                //肯定只会有一个根节点
                var groupsJson = treeTool.toFormatTreeJson(_.filter(data, { isRoot: true }), vm.selectedGroupId)[0];
                vm.allGroups = treeTool.toFormatTreeJson(_.filter(data, { isRoot: false }), vm.selectedGroupId);
                vm.allGroups.push(groupsJson);
            });

            $scope.$watch("vm.selectedGroupId", function (newvalue, oldvalue) {
                if (!!newvalue) {
                    groupService.getJobs({ GroupId: vm.selectedGroupId, EnterpriseId: params.enterpriseId }).then(function (data) {
                        vm.jobs = data;
                    });
                }
            });
        }
    ]);
})();