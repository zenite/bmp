(function () {
    var controllerId = _shared.dialogs.define('jobDialog', '/App/_shared/component/job/job.dialog.html');
    angular.module('app.shared').controller(controllerId, ['mabp.app.bpm', 'params', '$scope', 'treeTool',
        function (groupService, params, $scope, treeTool) {
            var vm = this;
            vm.selectedGroupId = "";
            vm.jobs = [];
            //查询文本
            vm.selectTxt = "";

            vm.selectJob = function () {
                var arr = [];
                for (var i = 0; i < vm.jobs.length; i++) {
                    if (vm.selectTxt == "") {
                        arr.push(vm.jobs[i]);
                    } else {
                        var isJobName = vm.jobs[i].jobName == null ? false : vm.jobs[i].jobName.indexOf(vm.selectTxt) >= 0;
                        var isJobUsers = vm.jobs[i].jobUsers == null ? false : vm.jobs[i].jobUsers.indexOf(vm.selectTxt) >= 0;
                        if (isJobName || isJobUsers)
                            arr.push(vm.jobs[i]);
                        if (!isJobName && !isJobUsers) {
                             _.filter(vm.allJobs, function(data) {
                                 var isJobName = data.jobName == null ? false : data.jobName.indexOf(vm.selectTxt) >= 0;
                                 var isJobUsers = data.jobUsers == null? false : data.jobUsers.indexOf(vm.selectTxt) >= 0;
                                 if (isJobName || isJobUsers) {
                                     var isHave = _.findIndex(arr, function (o) { return o.id == data.id; }) < 0;
                                     if (isHave)
                                        arr.push(data);
                                }
                            });
                        }
                    }
                }
                return arr;
            }

            //保存并返回
            vm.save = function (data) {
                $scope.$close(data);
            };

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

            groupService.getAllJobs({ GroupId: vm.selectedGroupId == "" ? "8a46cb5c-db94-449f-a05c-6e32720da27b" : vm.selectedGroupId, EnterpriseId: params.enterpriseId }).then(function (data) {
                vm.allJobs = data;
            });


        }
    ]);
})();