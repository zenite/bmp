(function () {
    var controllerId = app.dialogs.define('moduleRight', '/App/SysPages/views/system/module/module.right.html');
    app.controller(controllerId, ['$scope', 'params', 'asdialog', 'dialog', 'mabp.app.module',
        function ($scope, params, asdialog, dialog, service) {
        var vm = this;
        vm.module = params && (params.model || {});
        vm.newRight = { moduleId: vm.module.id };
        vm.moduleRightTypes = enums.get("moduleRightType");
        vm.moduleRightControls = enums.get("moduleRightControl");

        vm.load = function () {
            service.getModuleRights({ id: vm.module.id }).then(function (data) {
                if (!!data) {
                    vm.models = data;
                }
            });
        }

        vm.edit = function (r) {
            if (r == null) {
                r = { moduleId: vm.module.id };
            }
            dialog.open(app.dialogs["moduleRightEdit"], r).then(function (result) {
                    vm.load();
            });
        }

        vm.load();

        //新增岗位
        vm.addJob = function () {
            dialog.open(_shared.dialogs.jobDialog, { enterpriseId: vm.enterpriseId }).then(function (data) {
                if (!!data) {
                    var job = data;
                    vm.newRight.value = job.id;
                    vm.jobName = job.jobName;
                }
            });
        }

        //修改岗位
        vm.editJob = function (j) {
            dialog.open(_shared.dialogs.jobDialog, { enterpriseId: vm.enterpriseId }).then(function (data) {
                if (!!data) {
                    var job = data;
                    j.value = job.id;
                    j.jobName = job.jobName;
                }
            });
        }

        vm.clearRow = function (i) {
            i.value = null;
            return i;
        }

        vm.clearNew = function (i) {
            vm.newRight.value = null;
        }

        $scope.$watch('vm.newRight.type', function (newV, oldV) {
            if (newV !== oldV) {
                vm.newRight.value = null;
            }
        });

        vm.barConfig = {
            animation: 150,
            ghostClass: "selectitem",
            handle: ".handle",
            onSort: function (evt) {
                if (evt.oldIndex != evt.newIndex) {
                    service.updateModuleRightDisplayOrder(vm.models);
                }
            },
            orderMember: "displayOrder"
        };


    }]);
})();