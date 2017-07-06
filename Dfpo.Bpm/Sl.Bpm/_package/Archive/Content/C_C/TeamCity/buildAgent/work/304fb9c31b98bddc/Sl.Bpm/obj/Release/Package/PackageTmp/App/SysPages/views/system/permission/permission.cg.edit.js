(function () {
    var controllerId = app.dialogs.define('cgEdit', '/App/SysPages/views/system/permission/permission.cg.edit.html');
    app.controller(controllerId, ['$scope', 'params', 'mabp.app.permission', '$stateParams',
        function ($scope, params, service, $stateParams) {
            var vm = this;
            vm.model = _.cloneDeep(params);
            vm.detail = [];
            vm.newItem = {};
            vm.load = function () {
                if (vm.model != null && vm.model.id != null)
                    service.getAllPermissionControlGroupItem(vm.model.id).then(function(data) {
                        vm.detail = data;
                    });
            }
            vm.save = function () {
                vm.isSaving = true;
                if (vm.model.displayOrder == null) {
                    vm.model.displayOrder = 0;
                }
                mabp.ui.setSaving('enterpriseRoleEdit',
                service.addOrUpdatePermissionGroupControl({ master: vm.model, detail: vm.detail}).then(function () {
                    mabp.notify.success(L("OperationSucceeded"));
                    $scope.$close(true);
                }), L("Saveing"));
            };
            vm.delete = function () {
                if (vm.model.id != null)
                    service.deleteControlGroup(vm.model.id).then(function() {
                        mabp.notify.success("删除成功");
                        $scope.$close(true);
                    });
            }
            vm.deleteItem = function (item) {
                if (item.id == null) {
                    _.remove(vm.detail, item);
                } else {
                    service.removePermissionGroupControlItem(item.id).then(function () {
                        _.remove(vm.detail, item);
                    });
                }
            }
            vm.saveItem = function () {
                vm.detail.push(vm.newItem);
                vm.newItem = {};
            }

            vm.load();
        }
    ]);
})();