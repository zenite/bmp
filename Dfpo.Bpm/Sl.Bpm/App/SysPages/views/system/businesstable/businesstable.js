(function () {
    'use strict';
    var controllerId = "syspages.views.enterprise.businesstable";
    angular.module('syspages').controller(controllerId, [
        '$scope', 'mabp.app.table', 'asdialog', 'dialog', '$state', '$stateParams', 'treeTool', 'mabp.app.enterpriseInfoSync',
        function ($scope, service, asdialog, dialog, $state, $stateParams, treeTool, syncServie) {
            var vm = this;
            vm.models = [];
            vm.rootBusinessTable = { id: null, text: L("MainDatatable") };
            vm.selectedBusinessTableId = null;
            vm.allGroups = [];
            vm.allTableType = ["", "BusinessTable", "BasicTable", "SysTable"];

            _shared.initialPage(vm);

            vm.load = function () {
                vm.isLoaded = false;
                mabp.ui.setLoading('.table_content',
                service.getAllBusinessTableTree().then(function (result) {
                    vm.businessTableArray = result;
                    vm.isLoaded = true;
                    //肯定只会有一个根节点
                    vm.allGroups = treeTool.toFormatTreeJson(_.filter(result, { isRoot: true }), vm.selectedBusinessTableId);
                    vm.loadBusinessTable(vm.selectedBusinessTableId);
                }));
            }

            //加载树形结构图，左边的值被选中后触发 
            $scope.$watch('vm.selectedBusinessTableId', function (newvalue, oldvalue) {
                vm.loadBusinessTable(newvalue);
                $stateParams.parentBusinessTableId = vm.selectedBusinessTableId;
            });

            vm.loadBusinessTable = function (parentTableId) {
                vm.paging.pageSize = 100;
                vm.paging.filters = [
                    { name: "parentTableId", value: parentTableId }
                ];
                mabp.ui.setLoading('.on-load',
                service.getBusinessTablesByParentTableId(vm.paging).then(function (result) {
                    vm.models = result.model;
                    vm.paging.totalCount = result.totalCount;
                }));
            }


            vm.detail = function (m) {
                asdialog.open(app.dialogs.businesstableColumns, m).then(function (result) {
                    if (result) {
                        vm.load();
                        vm.selectedBusinessTableId = m.parentBusinessTableId;
                    }

                });
            }

            vm.list = function () {
                dialog.open(app.dialogs["businesstableList"]).then(function () {
                    vm.load();
                });
            };

            vm.edit = function (m) {
                asdialog.open(app.dialogs["businesstableEdit"], m).then(function (result) {
                    if (result) {
                        vm.load();
                    }
                });
            };

            //进入明细表
            vm.goToDetailTable = function (m) {
                vm.selectedBusinessTableId = m.id;
            }

            vm.getNew = function (i) {
                var ids = [];
                ids.push(i.id);
                if (ids.length > 0) {
                    syncServie.getSelectedBusinessTables(ids).then(function (data) {
                        if (data) {
                            mabp.notify.success(L("SynchronizedSuccess"));
                            vm.load();
                        }
                    });
                }
            }
            vm.applyToDatabase = function (i) {
                angular.element('#applyBusinessTableToDatabase').addClass("icon-spin");
                service.applyToDatabase({ id: i.id }).then(function(data) {
                    if (data) {
                        angular.element('#applyBusinessTableToDatabase').removeClass("icon-spin");
                        mabp.notify.success(L("OperationSucceeded"));
                    }
                }, function() {
                    angular.element('#applyBusinessTableToDatabase').removeClass("icon-spin");
                });
            }
            vm.load();
        }
    ]);
})();