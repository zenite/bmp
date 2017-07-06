(function () {
    'use strict';
    var controllerId = "syspages.views.my.workflowcenter";
    angular.module('syspages').controller(controllerId, [
        '$scope', '$modal', 'dialog', '$rootScope', '$timeout', '$state', 'appSession',
        function ($scope, $modal, dialog, $rootScope, $timeout, $state, appSession) {
            CheckPermission("Menu_My_WorkflowCenter");
            var vm = this;

            //流程中心菜单配置
            vm.nav = [
                {
                    displayName: "WorkflowHandle",
                    icon: 'icon-cogs',
                    isDispaly: true,
                    //menu: 'workflowcenter.handle',
                    children: [
                        { displayName: "LaunchWorkflow", menu: 'my.workflowcenter.raise', icon: 'icon-paint-brush', isDispaly: true },
                        { displayName: "MyPendingHandleWf", menu: 'my.workflowcenter.pendinghandle', icon: 'icon-inbox', isDispaly: true },
                        { displayName: "MyPendingReadWf", menu: 'my.workflowcenter.pendingread', icon: 'icon-bell-alt', isDispaly: true }
                    ]
                },
                {
                    displayName: "WfSearch",
                    //menu: 'workflowcenter.search',
                    icon: 'icon-search',
                    isDispaly: true,
                    children: [
                        { displayName: "MyMarkedWf", menu: 'my.workflowcenter.mymarked', icon: 'icon-flag', isDispaly: true },
                        { displayName: "MyDraftWf", menu: 'my.workflowcenter.mydraft', icon: 'icon-pencil', isDispaly: true },
                        { displayName: "MyRaisedWf", menu: 'my.workflowcenter.myraised', icon: 'icon-user', isDispaly: true },
                        { displayName: "MyHanldeWf", menu: 'my.workflowcenter.myhandled', icon: 'icon-tasks', isDispaly: true },
                        { displayName: "MyWaitingWf", menu: 'my.workflowcenter.mywaiting', icon: 'icon-tasks', isDispaly: true },
                        { displayName: "CopyMeWf", menu: 'my.workflowcenter.mycopied', icon: 'icon-node', isDispaly: true },
                        { displayName: "MyAuthorizedWf", menu: 'my.workflowcenter.myauthorized', icon: 'icon-key', isDispaly: true },
                        { displayName: "MyDelegateWf", menu: 'my.workflowcenter.mydelegated', icon: 'icon-plane', isDispaly: true },
                        { displayName: "WfAdvancedSearch", menu: 'my.workflowcenter.wfadvancedsearch', icon: 'icon-search', isDispaly: appSession.permissions['Menu_My_WorkflowCenter_AdvanceSearch'] }
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
            vm.menus = _.concat(vm.nav[0].children, vm.nav[1].children);
            //获得当前状态
            $scope.getTaskStatus = function (item) {
                if (item.taskStatus == 1) {
                    item.taskTitle = L('TaskFinishStatus');
                }
                if (item.taskStatus == 7) {
                    item.taskTitle = L('TaskRejectStatus');
                }
                if (item.taskStatus == 9) {
                    item.taskTitle = L('TaskCanceled');
                }
                if (item.taskStatus == 0) {
                    item.taskTitle = item.procUserName;
                }
            }
        }
    ]);
})();