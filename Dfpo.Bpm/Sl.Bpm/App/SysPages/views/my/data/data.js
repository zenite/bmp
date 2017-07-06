(function () {
    'use strict';
    var controllerId = "syspages.views.my.data";
    angular.module('syspages').controller(controllerId, [
        '$scope', 'mabp.app.module', '$state', 'moduleHandler', 'appSession',
        function ($scope, service, $state, module, session) {
            CheckPermission("Menu_My_DataMaintanance");
            var vm = this;
            vm.models = [
                { displayName: 'User', state: 'my.user', icon: 'icon icon-user', permission: 'SysModule_Data_User' },
                { displayName: 'Group', state: 'my.group', icon: 'icon icon-group', permission: 'SysModule_Data_Group' },
                { displayName: 'GroupExtension', state: 'my.groupExtension', icon: 'icon icon-group', permission: 'SysModule_Data_GroupExtension' },
                { displayName: 'SystemEnumeration', state: 'my.enum', icon: 'icon icon-list-alt', permission: 'SysModule_Data_Enum' },
                { displayName: 'Role', state: 'my.role', icon: 'icon icon-github', permission: 'SysModule_Data_Role' },
                //{ displayName: 'InterfaceConfig', state: 'my.integrationConfig', icon: 'icon icon-carousel', permission: 'SysModule_Data_Interface' },
                { displayName: 'BasicDataConfig', state: 'my.basicDataConfig', icon: 'icon icon-magic', permission: 'SysModule_Data_BasicData' }
            ];

            vm.load = function () {
                mabp.ui.setLoading('.data_load',
                service.loadModuleCategoryWithPage(1).then(function (result) {
                    for (var i = 0; i < result.length; i++) {
                        switch (i % 6) {
                            case 0:
                                result[i].icon = "icon icon-user";
                                break;
                            case 1:
                                result[i].icon = "icon icon-group";
                                break;
                            case 2:
                                result[i].icon = "icon icon-list-alt";
                                break;
                            case 3:
                                result[i].icon = "icon icon-github";
                                break;
                            case 4:
                                result[i].icon = "icon icon-carousel";
                                break;
                            case 5:
                                result[i].icon = "icon icon-magic";
                                break;
                            default:

                        }
                    }
                    vm.categorys = _.groupBy(result, 'categoryId');
                    vm.categoryList = [];
                    for (var a in vm.categorys) {
                        _.remove(vm.categorys[a], function (item) { return !session.permissions[item.id] });
                        if (vm.categorys[a].length > 0) {
                            vm.categoryList.push({ name: _.find(result, { categoryId: a }).categoryName, id: a });
                        }
                    }


                    if (vm.activeCategoryId == null && vm.categoryList[0] != null) {
                        vm.activeCategoryId = vm.categoryList[0].id;
                    }
                }));
            }

            vm.setFavourite = function (m, event) {
                module.setFavourite(m, event);
            }

            vm.openModule = function (m) {
                module.open(m);
            }
            vm.load();
        }
    ]);
})();