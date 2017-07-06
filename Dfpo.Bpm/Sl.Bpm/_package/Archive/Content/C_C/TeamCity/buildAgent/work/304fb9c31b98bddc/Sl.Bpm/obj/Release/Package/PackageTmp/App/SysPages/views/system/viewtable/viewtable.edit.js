(function () {
    var controllerId = app.dialogs.define('viewtableEdit', '/App/SysPages/views/system/viewtable/viewtable.edit.html');
    app.controller(controllerId, ['$scope', 'params', 'mabp.app.table','$stateParams',
        function ($scope, params, service, $stateParams) {
            var vm = this;
            vm.model = params;

            vm.save = function () {
                vm.isSaving = true;
                mabp.ui.setSaving('variableEdit',
                service.editViewTable(vm.model).then(function () {
                    mabp.notify.success(L("OperationSucceeded"));
                    $scope.$close(true);
                }), L("Saveing"));
            };

            vm.allViewType = enums.get("viewType");

            vm.delete = function () {
                vm.isDeleting = true;
                service.deleteViewTable(vm.model).then(function () {
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