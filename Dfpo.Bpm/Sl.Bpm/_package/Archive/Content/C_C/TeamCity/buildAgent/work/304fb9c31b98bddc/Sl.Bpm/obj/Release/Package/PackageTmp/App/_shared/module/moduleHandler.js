//模块跳转器
_shared.service('moduleHandler', [
    'asdialog', 'dialog', 'mabp.app.module', 'appSession', '$rootScope', 'basicDataModuleTransfer', 'reportModuleTransfer', 'workflowModuleTransfer',
    function (asdialog, dialog, service, session, $rootScope, basicDataModule, reportModule, workflowModule) {
        var moduleTransfer = {}
        moduleTransfer.getNum = function () {
            if ($('.data_load').find(".orangered").length >= 6)
                return false;
            return true;
        }
        moduleTransfer.approve = workflowModule.approve;
        moduleTransfer.checkout = workflowModule.checkout;
                
        moduleTransfer.setFavourite = function (m, event) {
            m.moduleId = m.id;
            m.isFavourite = m.isFavourite == 0 ? 1 : 0;
            if (this.getNum() === false && m.isFavourite) {
                mabp.notify.success("常用流程已到上限");
                m.isFavourite = m.isFavourite == 0 ? 1 : 0;
            }
            else {
                service.setFavouriteModule(m).then(function () {
                    if (m.isFavourite) {
                        if (this.getNum() === false) {
                            mabp.notify.success(L("AddToCommonWorkflowSuccessfullyUpToMax"));
                            m.isFavourite = m.isFavourite == 0 ? 1 : 0;
                        } else
                            mabp.notify.success(L("AddToCommonWorkflowSuccessfully"));
                    } else {
                        mabp.notify.success(L("RemoveFromCommonWorkflowSuccessfully"));
                    }
                    //TODO:重新刷新
//                    vm.load();
                }, function () {
//                    vm.load();
                });
                event.stopPropagation();
            }
        }
        //打开基础数据模块，报表模块，流程模块
        moduleTransfer.open = function (m) {
            var promise = {};
            switch (m.type) {
                //基础数据
                case 1:
                    promise = basicDataModule.open(m);
                    break;
                //报表
                case 2:
                    promise = reportModule.open(m);
                    break;
                    //流程
                case 3:
                    promise = workflowModule.raise(m.indexPageId, m.indexNodeId);
                    break;
                default:
                    console.error("No handled module Type");
                    break;
            }
            return promise;
        }
        return moduleTransfer;
    }
]);