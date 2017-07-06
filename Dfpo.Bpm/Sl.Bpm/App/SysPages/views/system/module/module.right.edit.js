(function () {
    var controllerId = app.dialogs.define('moduleRightEdit', '/App/SysPages/views/system/module/module.right.edit.html');
    app.controller(controllerId, ['$scope', 'params', 'mabp.app.module',
        function ($scope, params, service) {
            var vm = this;
            vm.model = params || {};
            vm.moduleRightTypes = enums.get("moduleRightType");
            vm.moduleRightControls = enums.get("moduleRightControl");


            vm.save = function () {
                service.editModuleRight(vm.model).then(function () {
                    $scope.$close(true);
                });
            }

            vm.delete = function () {
                service.deleteModuleRight(vm.model).then(function () {
                    $scope.$close(true);
                });
            }

        }]);
})();