(function () {
    'use strict';
    var controllerId = "syspages.views.my.workflowcenter.raise";
    angular.module('syspages').controller(controllerId, [
        '$scope', 'mabp.app.module', 'moduleHandler', 'mabp.app.workflow', 'mabp.app.bpm', 'appSession',
        function ($scope, service, module, wfservice, bpmService, session) {
            var vm = this;
            vm.categories = [];
            vm.allmodules = [];

            vm.load = function () {
                //mabp.ui.setLoading('.data_load',
                //添加键值对参数
                service.loadModuleCategoryWithPage(3).then(function (result) {
                    vm.categorys = _.groupBy(result, 'categoryId');
                    vm.categoryList = [];
                    for (var a in vm.categorys) {
                        _.remove(vm.categorys[a], function (item) { return !session.permissions[item.id] });
                        if (vm.categorys[a].length > 0) {
                            vm.categoryList.push({ name: _.find(result, { categoryId: a }).categoryName, id: a });
                        }
                    }

                    if (vm.activeCategoryId == null) {
                        if (!!vm.categoryList[0]) {
                            if (vm.activeCategoryId == null && vm.categoryList[0] != null) {
                                vm.activeCategoryId = vm.categoryList[0].id;
                            }
                        }
                    }
                });


            }

            vm.setFavourite = function (m, event) {
                module.setFavourite(m, event);
            }

            vm.load();

            vm.openModule = function (m) {
                mabp.ui.setBusying('.raise_block',
                module.open(m).then(function (result) {
                    //if (result)
                    //    vm.load(true);
                }));
            }

        }
    ]);
})();