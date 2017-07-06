(function () {
    var controllerId = app.dialogs.define('businesstableEdit', '/App/SysPages/views/system/businesstable/businesstable.edit.html');
    app.controller(controllerId, ['$scope', 'params', 'mabp.app.workflow', '$stateParams',
        function ($scope, params, service, $stateParams) {
            var vm = this;
            vm.model = params || {};

            vm.allTableType = enums.get("businessTableType");

        }
    ]);
})();