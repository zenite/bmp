(function () {
    var controllerId = app.dialogs.define('userEdit', '/App/SysPages/views/my/data/user/user.edit.html');
    app.controller(controllerId, ['$scope', 'params', 'mabp.app.bpm', '$stateParams',
        function ($scope, params, service, $stateParams) {
            var vm = this;
            vm.model = params;

            vm.save = function () {
                vm.isSaving = true;
                vm.model.enterpriseId = $stateParams.enterpriseId;
                mabp.ui.setSaving('enterpriseUserEdit',
                service.editEnterpriseUser(vm.model).then(function () {
                    mabp.notify.success(L("OperationSucceeded"));
                    $scope.$close(true);
                }), L("Saveing"));
            };

            vm.loadJobGroup = function () {
                if (vm.model) {
                    service.getSelectedUserJobs({ Id: vm.model.id }).then(function (data) {
                        vm.jobGroups = data;
                    });
                }
            }

            vm.loadRoleJob = function () {
                if (vm.model) {
                    service.getSelectedRoleJobs({ Id: vm.model.id }).then(function (data) {
                        vm.roleJobs = data;
                    });
                }
            }

            vm.loadJobGroup();
            vm.loadRoleJob();
        }
    ]);
})();