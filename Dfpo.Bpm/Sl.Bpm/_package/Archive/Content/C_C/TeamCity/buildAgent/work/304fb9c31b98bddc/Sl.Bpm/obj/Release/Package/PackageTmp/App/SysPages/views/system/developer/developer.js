(function () {
    'use strict';
    var controllerId = "syspages.views.system.developer";
    angular.module('syspages').controller(controllerId, [
        '$scope', 'mabp.app.task', 'mabp.app.bpm', 'workflowModuleTransfer', 'dialog', 'mabp.app.file',
        function ($scope, service, bpmservice, module, dialog, fileService) {
            var vm = this;
            vm.activeTab = 0;
            vm.selectModel = {};
            vm.pageOne = {};

            $scope.$watch('vm.activeTab', function (newValue, oldValue) {
                if (newValue && newValue == 1)
                    vm.loadIntegration();
            });
            vm.pageOne.paging = _shared.initialPage(vm.pageOne, 1, 12, "RefId", false);

            vm.load = function () {
                service.getMyAdvancedTasks({ pageInput: vm.pageOne.paging, TaskSelectDto: vm.selectModel }).then(function (data) {
                    if (!!data) {
                        vm.models = data.model;
                        vm.paging.totalCount = data.totalCount;
                    }
                });
            }

            vm.check = function (wf) {
                module.checkout(wf.appPageId, wf.wfdWorkflowNodeId, wf);
            }

            vm.edit = function (item) {
                dialog.open(app.dialogs.wfProcessorChange, item).then(function () {
                    vm.load();
                });
            }

            //获取所有数据库中的文件 加载到table上
            vm.code_loadAllFiles = function() {
                fileService.getCodeFiles().then(function(data) {
                    vm.codeFiles = data;
                });
            }
            //更新某个具体的文件
            vm.code_refresh = function (item) {
                fileService.updateCodeFile({ data: item.fileRelativePath }).then(function(data) {
                    item = data;
                    mabp.notify.success("更新成功");
                });
            }

            //编辑某个代码文件
            vm.code_edit = function(item) {
                mabp.message.info("<div class='col-lg-12'> <pre>"+item.content+"</pre></div>", null, {size:"lg", html: true});
            }

            //更新所有文件
            vm.code_refreshAllFiles = function() {
                fileService.refreshAllFiles().then(function() {
                    vm.code_loadAllFiles();
                    mabp.notify.success("更新成功");
                });
            }
            vm.code_loadAllFiles();

        }]);
})();