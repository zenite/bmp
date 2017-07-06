(function () {
    var controllerId = _shared.dialogs.define('topicDialog', '/App/_shared/module/topic.dialog.html');
    _shared.controller(controllerId, [
         'params', '$scope', 
        function (params, $scope) {
            var vm = this;
            vm.model = params;

            vm.save = function () {
               $scope.$close(vm.model);
            }

            vm.cancel = function () {
                $scope.$close(false);
            }

        }
    ]);
})();