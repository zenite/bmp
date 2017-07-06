(function () {
    'use strict';
    var controllerId = "syspages.views.my.file";
    angular.module('syspages').controller(controllerId, [
        '$scope', 'asdialog', 'mabp.app.file', '$state', 'moduleHandler', 'appSession',
        function ($scope, asdialog, service, $state, module, session) {
            var vm = this;
            vm.paging = _shared.initialPage(vm, 1, 10, 'CreationTime DESC ,  DownloadTimes', true);

            vm.filter = {
                searchStartTime: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
                searchEndTime: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"
            }

            vm.load = function () {
                vm.paging.filters = mabp.toArray(vm.filter);
                service.getUserFilesByUserId(vm.paging).then(function (result) {
                    vm.models = result.data;
                    vm.paging.totalCount = result.totalCount;
                });
            }

            vm.downLoadFile = function (item) {
                item = {};
                service.updateUserFileDownloadTimes(item, { responseType: 'blob' });
            }

            //todo:加载数据
            //vm.load();
        }
    ]);
})();