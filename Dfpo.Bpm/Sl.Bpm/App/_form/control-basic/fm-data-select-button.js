_shared
/*下拉列表指令*/
.directive("fmDataSelectButton", ['fmTool', '$timeout', 'dialog', 'mabp.app.module', 'mabp.app.bpm', function (fmTool, $timeout, dialog, service, bpmService) {
    return {
        restrict: 'E',
        replace: true,
        template: function (elem, attr) {
            fmTool.setDefaultMember(attr);
            var _validate = fmTool.setValidate(attr);
            //设置单选/多选
            if (attr.ismulti !== undefined && attr.ismulti !== "false") {
                attr.ismulti = true;
            } else attr.ismulti = false;
            return '<button class="btn-sm btn btn-info select-data-button ' + attr.class + '" ng-class="state" type="button" ng-click="event_SelectData()" >' + (attr.text ? '{{text}}' : '{{(\'Choose\' | translate)}}') + '</button>';
        },
        scope: {
            text: '=',
            fmModel: '=',
            fmCode: '=',
            columns: '=',
            isOpen: '=',
            datacode: '=',
            fmNormal: '=',
            fmRequired: '=',
            fmDisabled: '=',
            fmReadonly: '=',
            filter: '=',
            defaultModel: '=',
            callbackFunc: '&'
        },
        compile: function (tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, element, attr, ctrl) {
                },
                post: function postLink(scope, element, attr, cacheCtrl) {
                    //设置单选/多选
                    if (!!attr.ismulti && attr.ismulti !== "false" && scope.ismulti === undefined) {
                        scope.ismulti = true;
                    } else scope.ismulti = false;

                    fmTool.setScopeState(scope, attr);

                    fmTool.setDefaultWatch(attr, scope, element);

                    scope.event_SelectData = function () {
                        if (scope.state == "normal") {
                            switch (scope.datatype) {
                                case "source":
                                    dialog.open(_shared.dialogs['formSelect'], { data: [], datatype: "source", filter: scope.filter, selectData: "", column: scope.columns, title: attr.placeholder, ismulti: scope.ismulti, valueMember: attr.valueMember, size: attr.size }).then(function (data) {
                                        if (data !== null) {
                                            var fmModel = (data.selectItem || "").split(",");
                                            var result = [];
                                            for (var i = 0; i < data.items.length; i++) {
                                                if (fmModel.indexOf(data.items[i][attr.valueMember]) >= 0) {
                                                    result.push(data.items[i]);
                                                }
                                            }
                                            scope.callbackFunc({ selectItem: result });
                                        }
                                    });
                                    break;
                                case "view":
                                    dialog.open(_shared.dialogs['formSelect'], { datacode: scope.datacode, datatype: "view", filter: scope.filter, selectData: "", column: scope.columns, title: attr.formTitle, ismulti: scope.ismulti, valueMember: attr.valueMember, size: attr.size }).then(function (data) {
                                        if (data !== null) {
                                            var fmModel = (data.selectItem || "").split(",");
                                            var result = [];
                                            for (var i = 0; i < data.items.length; i++) {
                                                if (fmModel.indexOf(data.items[i][attr.valueMember]) >= 0) {
                                                    result.push(data.items[i]);
                                                }
                                            }
                                            scope.callbackFunc({ selectItem: result });
                                        }
                                    });
                                    break;
                                case "dataitem":
                                    dialog.open(_shared.dialogs['treeSelect'], { datacode: scope.datacode, datatype: "dataitem", filter: scope.filter, selectData: "", column: scope.columns, title: attr.formTitle, ismulti: scope.ismulti, mustleaf: attr.mustleaf, size: attr.size }).then(function (data) {
                                        if (data !== undefined) {
                                            var ids = [];
                                            if (!!data.selectItem && data.selectItem.length > 0) {
                                                for (var i = 0; i < data.selectItem.length; i++) {
                                                    ids.push(data.selectItem[i][attr.valueMember]);
                                                }
                                            }
                                            scope.callbackFunc({ selectItem: data.selectItem });
                                            scope.IsSelectData = true;
                                        }
                                    });
                                    break;
                                case "group":
                                    dialog.open(_shared.dialogs['treeSelect'], { data: scope.items, datatype: "group", selectData: angular.copy(scope.selectItem), column: scope.columns, title: attr.formTitle, ismulti: scope.ismulti, mustleaf: attr.mustleaf }).then(function (data) {
                                        if (data !== null && data !== undefined) {
                                            var ids = [];
                                            if (!!data.selectItem && data.selectItem.length > 0) {
                                                for (var i = 0; i < data.selectItem.length; i++) {
                                                    ids.push(data.selectItem[i][attr.valueMember]);
                                                }
                                            }
                                            scope.fmModel = ids.join(",");
                                            scope.callbackFunc({ selectItem: data.selectItem, fmModel: ids.join(",") });
                                        }
                                    });
                                    break;
                                case "joblevel":
                                    dialog.open(_shared.dialogs.jobLevelDialog, { value: scope.fmModel }).then(function (data) {
                                        if (!!data) {
                                            data.id = data.value;
                                            data.text = data.name;
                                            var ids = [];
                                            if (!!scope.selectItem && scope.selectItem.length > 0) {
                                                for (var i = 0; i < scope.selectItem.length; i++) {
                                                    ids.push(scope.selectItem[i][attr.valueMember]);
                                                }
                                            }
                                            scope.fmModel = ids.join(",");
                                            scope.callbackFunc({ selectItem: [data], fmModel: ids.join(",") });
                                        }
                                    });
                                    break;
                                default:
                            }
                        }
                    }
                }
            }
        }
    }
}])