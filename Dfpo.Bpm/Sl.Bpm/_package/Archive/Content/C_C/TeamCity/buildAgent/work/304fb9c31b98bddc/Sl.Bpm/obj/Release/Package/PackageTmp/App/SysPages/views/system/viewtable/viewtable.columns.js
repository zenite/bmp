(function () {
    var controllerId = app.dialogs.define('viewtableColumns', '/App/SysPages/views/system/viewtable/viewtable.columns.html');
    app.controller(controllerId, ['$scope', 'params', 'mabp.app.table', '$stateParams',
        function ($scope, params, service, $stateParams) {
            var vm = this;
            vm.models = [];
            vm.paging = _shared.initialPage(vm, 1, 8, 'DisplayOrder', true);
            vm.paging.pageSize = 2147483647;

            vm.load = function () {
                vm.paging.filters = [{ name: 'filterText', value: vm.selectTxt }, { name: 'tableId', value: params.id }];
                service.getAllViewTableColumns(vm.paging).then(function (result) {
                    vm.models = result.model;
                    vm.paging.totalCount = result.totalCount;
                    vm.isLoaded = true;
                });
            }
            vm.load();
            vm.saveLang = function(model) {
                service.editViewTableColumn(model).then(function () {

                });
            }
            vm.saveColumn = function (model) {
                service.editViewTableColumn(model).then(function() {
                    
                });
            }

            vm.barConfig = {
                animation: 150,
                ghostClass: "selectitem",
                handle: ".handle",
                onSort: function (evt) {
                    if (evt.oldIndex != evt.newIndex) {
                        service.updateViewTableColumnDisplayOrder(vm.models);
                    }
                },
                orderMember: "displayOrder"
            };
        }
    ]);
})();