(function () {
    var controllerId = _shared.dialogs.define('handledNodeSelect', '/App/_shared/module/workflow/handledNode.select.html');
    _shared.controller(controllerId, [
         'params', '$scope', 'dialog',
        function (params, $scope, dialog) {
            var vm = this;
            vm.models = params;

            vm.save = function () {
                if (vm.selectNodeId) {
                    $scope.$close(vm.selectNodeId);
                } else {
                    mabp.notify.warn("请选择一个节点！");
                }
            }

            vm.select = function (i) {
                vm.selectNodeId = i.id;
            }

            vm.cancel = function () {
                $scope.$close(false);
            }

        }
    ]);
})();