(function () {
    var controllerId = _shared.dialogs.define('topicDialog', '/App/_shared/module/topic.dialog.html');
    _shared.controller(controllerId, [
         'params', '$scope',
        function (params, $scope) {
            var vm = this;
            vm.model = params;

            vm.save = function () {
                if (!!vm.model.topic) {
                    $scope.$close(vm.model);
                } else {
                    mabp.notify.error("请填写主题");
                }
            }

            vm.cancel = function () {
                $scope.$close(false);
            }

        }
    ]);
})();