(function () {
    'use strict';
    var controllerId = "syspages.views.system.chart";
    angular.module('syspages').controller(controllerId, [
        '$scope', '$modal', 'dialog', '$rootScope', '$timeout', '$state', 'appSession',
        function ($scope, $modal, dialog, $rootScope, $timeout, $state, appSession) {
            var vm = this;

            //报表中心菜单配置
            vm.nav = [
                {
                    displayName: "ReportCenter",
                    icon: 'icon-cogs',
                    isDispaly: true,
                    children: [
                        { displayName: "InfoOverview", menu: 'system.chart.infooverview', icon: 'icon-flag', isDispaly: true },
                        { displayName: "WfOverview", menu: 'system.chart.wfoverview', icon: 'icon-pencil', isDispaly: true },
                        { displayName: "WfnInfo", menu: 'system.chart.wfninfo', icon: 'icon-user', isDispaly: true },
                        { displayName: "UserWfInfo", menu: 'system.chart.userwfinfo', icon: 'icon-tasks', isDispaly: true },
                        { displayName: "WfProcess", menu: 'system.chart.wfprocess', icon: 'icon-tasks', isDispaly: true },
                        { displayName: "StandardProcessingTimeSetting", menu: 'system.chart.standardptsetting', icon: 'icon-node', isDispaly: true },
                    ]
                }
            ];

          
            vm.setActiveMenu = function (state) {
                vm.currentActiveMenu = state;
                var curMenu = _.find(vm.menus, { menu: state.name });
                vm.currentMenu = curMenu != null && curMenu.displayName;
            }
            $rootScope.$on('$stateChangeSuccess', function (event, toState) {
                vm.setActiveMenu(toState);
            });
            if (vm.currentActiveMenu == null) {
                vm.setActiveMenu($state.current);
            }
            vm.menus = vm.nav[0].children;

        }
    ]);
})();