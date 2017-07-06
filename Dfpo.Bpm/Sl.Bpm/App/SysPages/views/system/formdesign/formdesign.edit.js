(function () {
    var controllerId = app.dialogs.define('formdesignEdit', '/App/SysPages/views/system/formdesign/formdesign.edit.html');
    app.controller(controllerId, ['$scope', 'params', 'mabp.app.bpm', '$stateParams',
        function ($scope, params, service, $stateParams) {
            var vm = this;
            vm.model = params || {};

            vm.allType = enums.get("formDesignType");

            service.getDatatable({ Id: vm.model.id }).then(function(data) {
                vm.model.dataTableName = data;
            });

        }
    ]);
})();