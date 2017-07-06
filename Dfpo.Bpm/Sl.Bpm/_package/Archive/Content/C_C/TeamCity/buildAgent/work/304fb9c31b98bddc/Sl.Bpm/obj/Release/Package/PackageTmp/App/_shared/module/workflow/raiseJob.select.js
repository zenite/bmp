(function () {
    var controllerId = _shared.dialogs.define('jobSelect', '/App/_shared/module/workflow/raiseJob.select.html'); 
    _shared.controller(controllerId, [
         'params', '$scope', 'dialog',
        function (params, $scope, dialog) {
            var vm = this;
            vm.models = params;

            vm.save = function () {
                if (vm.selectJobId) {
                    $scope.$close(vm.selectJobId);
                } else {
                    mabp.notify.warn("请选择一个岗位！");
                }
            }

            vm.select = function (i) {
                vm.selectJobId = i.jobId;
            }

            vm.cancel = function () {
                $scope.$close(false);
            }

        }
    ]);
})();