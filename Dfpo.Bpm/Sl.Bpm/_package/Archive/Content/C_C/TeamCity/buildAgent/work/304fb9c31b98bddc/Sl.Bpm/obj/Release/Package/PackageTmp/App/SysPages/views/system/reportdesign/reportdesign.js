(function () {
    'use strict';
    var controllerId = "syspages.views.enterprise.reportdesign";
    angular.module('syspages').controller(controllerId, [
        '$scope', 'mabp.app.report', 'asdialog', 'dialog', '$state', '$stateParams', function ($scope, service, asdialog, dialog, $state, $stateParams) {
            var vm = this;
            vm.models = [];
            _shared.initialPage(vm);
            vm.load = function () {
                vm.paging.pageSize = 12;
                vm.paging.filters = [{ name: "enterpriseId", value: "cccbca3d-b98f-4684-84dc-5024d854f223" }];
                mabp.ui.setLoading('.report_content',
                service.getAllReport(vm.paging).then(function (result) {
                    vm.models = result.model;
                    vm.isLoaded = true;
                }));
            }

           
            vm.edit = function (m) {
                asdialog.open(app.dialogs.reportdesignEdit, m).then(function (result) {
                    if (result)
                        vm.load();
                });
            }

            vm.designFixFormat = function (m) {
                dialog.open(app.dialogs.reportdesignFixFormat, m).then(function (result) {
                    if (result)
                        vm.load();
                });
            }



            vm.load();
        }
    ]);
})();