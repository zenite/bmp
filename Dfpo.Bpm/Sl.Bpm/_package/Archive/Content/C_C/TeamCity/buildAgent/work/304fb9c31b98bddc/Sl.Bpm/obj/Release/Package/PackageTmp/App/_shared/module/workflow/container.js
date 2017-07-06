(function () {
    var controllerId = _shared.dialogs.define('moduleManagement', '/App/_shared/module/workflow/container.html');
    _shared.controller(controllerId, [
        'mabp.app.module', 'mabp.app.task', 'params', '$compile'
        , '$scope', '$timeout', 'formHelper', '$rootScope',
        function (service, taskService, params, $compile, $scope, $timeout, formHelper, $rootScope) {
            var vm = this;
            //表单数据
            vm.pageInfo = params;
            vm.pageInfo.close = function () {
                $scope.$close();
            }
            vm.pageInfo.isPrint = false;
            //初始化容器对象
            var base = $scope.base = formHelper.buildBase(vm.pageInfo);
            console.log('taskId:' + base.taskId);
            //初始化表单对象
            var form = $scope.form = formHelper.buildForm($scope);
            formHelper.pageStart(base, form, $scope, $rootScope);
        }
    ]);
})();
