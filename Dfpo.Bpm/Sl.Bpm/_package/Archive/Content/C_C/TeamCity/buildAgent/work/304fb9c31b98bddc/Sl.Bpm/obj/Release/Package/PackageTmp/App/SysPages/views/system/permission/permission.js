(function () {
    'use strict';
    var controllerId = "syspages.views.system.permission";
    angular.module('syspages').controller(controllerId, [
        '$scope', 'mabp.app.permission', 'dialog', '$state', '$stateParams', function ($scope, service, dialog, $state, $stateParams) {
            var vm = this;
            vm.selectedCg = null;
            //获取所有控制组
            vm.load = function () {
                service.getAllPermissionControlGroup().then(function (result) {
                    vm.allCg = result;
                });
            }
            vm.clearCache = function () {
                service.reloadPermissionCache().then(function () {
                    mabp.notify.success("清除成功");
                });
            }
            vm.switchCg = function (item) {
                vm.selectedCg = item;
                service.getAllPermissions(item.id).then(function (result) {
                    _.forEach(result.keys, function (item) {
                        var newOne = _.find(result.permissions, { permissionKey: item.permissionKey });
                        angular.extend(item, { text: result.language[item.permissionKey] || L(item.permissionKey.upperFirst()) || item.permissionKey });
                        if (newOne != null) {
                            angular.extend(item, newOne);
                        }
                    });
                    vm.list = result.keys;
                });
            }

            vm.editCg = function (item) {
                dialog.open(app.dialogs.cgEdit, item).then(function (result) {
                    if (!!result) {
                        vm.load();
                    }
                });
            }

            vm.switchPermissionValue = function (item) {
                if (vm.selectedCg == null || vm.selectedCg.id == null) {
                    return;
                }
                var i = item.permissionValue;
                i = i == null ? 2 : i;
                var newValue = (i + 2) % 3;
                service.addOrUpdatePermission({ controlGroupId: vm.selectedCg.id, permissionKey: item.permissionKey, permissionValue: newValue }).then(function (data) {
                    var newItem = _.find(vm.list, { permissionKey: data.permissionKey });
                    angular.extend(newItem, data);
                });
            }
            //查询用户所拥有的权限
            vm.searchUserRight = function (userAccount) {
                dialog.open(app.dialogs.permissionUserCheckout, userAccount).then(function (result) { });
            }
            vm.load();
        }
    ]);
})();