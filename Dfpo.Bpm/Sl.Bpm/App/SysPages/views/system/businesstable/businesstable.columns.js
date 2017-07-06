(function () {
    var controllerId = app.dialogs.define('businesstableColumns', '/App/SysPages/views/system/businesstable/businesstable.columns.html');
    app.controller(controllerId, ['$scope', 'params', 'mabp.app.table', '$stateParams',
        function ($scope, params, service, $stateParams) {
            var vm = this;
            vm.model = params;
            vm.paging = _shared.initialPage(vm, 1, 100);
            vm.alignment = [
                { text: "左", value: "L" },
                { text: "中", value: "M" },
                { text: "右", value: "R" }
            ];

            vm.sourceTypes = enums.get("sourceType");

            vm.load = function () {
                vm.paging.filters = [{ name: "BusinessTableId", value: vm.model.id }];
                service.getAllBusinessTableColumns(vm.paging).then(function (data) {
                    vm.models = data.model;
                    vm.paging.totalCount = data.totalCount;

                });
            }

            vm.load();

            vm.saveColumn = function (model) {
                service.editBusinessTableColumn(model).then(function (data) {

                });
            };

        }
    ]);
})();