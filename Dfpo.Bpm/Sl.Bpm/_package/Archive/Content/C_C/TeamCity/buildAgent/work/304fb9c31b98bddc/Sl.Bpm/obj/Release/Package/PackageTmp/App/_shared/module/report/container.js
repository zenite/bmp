(function () {
    _shared.controller('app.shared.reportmodule', [
        'mabp.app.module', 'mabp.app.task', '$stateParams', '$compile'
        , '$scope', '$timeout', 'formHelper', '$rootScope',
        function (service, taskService, params, $compile, $scope, $timeout, formHelper, $rootScope) {
            var vm = this;
            //表单数据
            vm.pageInfo = params;
            vm.pageInfo.close = function () {
                $scope.$close();
            }

            //初始化容器对象
            var base = $scope.base = formHelper.buildReportBase(vm.pageInfo);
            //初始化表单对象
            var form = $scope.form = formHelper.buildReportForm($scope);
            formHelper.reportStart(base, form, $scope, $rootScope);

        }
    ]);
})();
