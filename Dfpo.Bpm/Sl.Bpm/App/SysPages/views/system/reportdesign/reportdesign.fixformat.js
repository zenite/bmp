(function () {
    var controllerId = app.dialogs.define('reportdesignFixFormat', '/App/SysPages/views/system/reportdesign/reportdesign.fixformat.html');
    app.controller(controllerId, ['$scope', 'params', 'mabp.app.report','$stateParams',
        function ($scope, params, service, $stateParams) {
            var vm = this;
            vm.model = params;

             
        }
    ]);
})();