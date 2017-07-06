(function () {
    var controllerId = app.dialogs.define('reportdesignEdit', '/App/SysPages/views/system/reportdesign/reportdesign.edit.html');
    app.controller(controllerId, ['$scope', 'params', 'mabp.app.report','$stateParams',
        function ($scope, params, service, $stateParams) {
            var vm = this;
            vm.model = params;

            vm.save = function () {
                vm.isSaving = true;
                //vm.model.enterpriseId = "cccbca3d-b98f-4684-84dc-5024d854f223";
                mabp.ui.setSaving('reportdesignEdit',
                service.editReport(vm.model).then(function () {
                    mabp.notify.success(L("OperationSucceeded"));
                    $scope.$close(true);
                }), L("Saveing"));
            };


            vm.delete = function () {
                vm.isDeleting = true;
                service.deleteReport(vm.model).then(function () {
                    mabp.notify.success(L("OperationSucceeded"));
                    $scope.$close(true);
                    vm.isDeleting = false;
                }, function () {
                    vm.isDeleting = false;
                });
            }
             
        }
    ]);
})();