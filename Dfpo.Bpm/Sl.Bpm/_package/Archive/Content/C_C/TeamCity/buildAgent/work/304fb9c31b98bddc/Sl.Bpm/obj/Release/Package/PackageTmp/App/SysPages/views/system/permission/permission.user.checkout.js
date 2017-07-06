(function () {
    var controllerId = app.dialogs.define('permissionUserCheckout', '/App/SysPages/views/system/permission/permission.user.checkout.html');
    app.controller(controllerId, ['$scope', 'params', 'mabp.app.permission', '$stateParams',
        function ($scope, params, service, $stateParams) {
            var vm = this;
            vm.userAccount = _.cloneDeep(params);
           
            vm.load = function () {
                if (vm.userAccount != null)
                    service.getUserPermissionsByAccount(vm.userAccount).then(function (data) {
                        var permissions = [];
                        for (var item in data.permissions) {
                            var permissionItem = {};
                            permissionItem.text = data.language[item] || L(item.upperFirst()) || item;
                            permissionItem.value = data.permissions[item];
                            permissions.push(permissionItem);
                        }
                        vm.permissions = permissions;
                    });
            }
        
            vm.load();
        }
    ]);
})();