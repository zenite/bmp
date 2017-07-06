(function () {
    'use strict';
    var controllerId = "syspages.views.enterprise.viewtable";
    angular.module('syspages').controller(controllerId, [
        '$scope', 'mabp.app.table', 'asdialog', 'dialog', '$state', '$stateParams', function ($scope, service, asdialog, dialog, $state, $stateParams) {
            var vm = this;
            vm.models = [];
            _shared.initialPage(vm);
            vm.load = function (isRefresh) {
                vm.paging.pageSize = 120;
                var loading = service.getAllViewTable(vm.paging).then(function (result) {
                    vm.models = result.model;
                    vm.isLoaded = true;
                });
                if (!isRefresh)
                    mabp.ui.setLoading('.view_content', loading);

            }

           
            vm.columns = function (m) {
                asdialog.open(app.dialogs.viewtableColumns, m).then(function (result) {
                   
                });
            }
            vm.edit = function (m) {
                asdialog.open(app.dialogs.viewtableEdit, m).then(function (result) {
                    if (result)
                        vm.load(true);
                });
            }


            vm.load();
        }
    ]);
})();