_shared
/*复选框/切换框列表指令*/
.directive('fmChecklist', [
        'fmTool', 'mabp.app.module', '$timeout', function (fmTool, service, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                template: function (elem, attr) {
                    fmTool.setDefaultMember(attr);
                    if (!attr.name) {
                        attr.name = attr.fmModel.toString().substring(attr.fmModel.lastIndexOf(".") + 1);
                    }
                    var columnwidth = ((100 / attr.columncount).getPrecision(1) - 1);
                    return '<div fm-model="' + attr.fmModel + '" class="fm-checklist input-sm" ng-class="state" ids="{{fmModel}}" ng-blur="event_Blur()">' +
                               '<div style="width:' + columnwidth + '%;" class="fm-checklist-checkbox" ng-repeat="item in items">' +
                                   '<label><input ng-disabled="state == \'disabled\' || state == \'readonly\' || item.' + attr.disabledMember + ' === true" ng-checked="isChecked(item)" name="' + attr.name + '" type="checkbox" value="{{item.' + attr.valueMember + '}}" ng-click="event_ChangeValue(item, $event)" />{{item.' + attr.displayMember + '}}</label>' +
                               '</div>' +
                           '</div>';
                },
                scope: {
                    fmModel: '=',
                    /*只有在基础数据的时候才会使用，返回基础数据Value*/
                    fmCode: '=',
                    items: '=',
                    selectItem: '=',
                    fmNormal: '=',
                    fmRequired: '=',
                    fmDisabled: '=',
                    fmReadonly: '=',
                    filter: '=',
                    callbackFunc: '&'
                },
                compile: function (tElement, tAttrs, transclude) {
                    return {
                        pre: function preLink(scope, element, attr, ctrl) {
                        },
                        post: function postLink(scope, element, attr, ctrl) {
                            scope.selectItem = [];
                            fmTool.setScopeState(scope, attr);

                            fmTool.setDataSource(scope, attr, service);

                            scope.$watch("filter", function (newvalue, oldvalue) {
                                if (!!newvalue && newvalue != oldvalue) {
                                    fmTool.setDataSource(scope, attr, service, bpmService);
                                }
                            }, true);

                            scope.isChecked = function (item) {
                                return (scope.fmModel || "").split(",").indexOf(item[attr.valueMember]) >= 0;
                            }

                            fmTool.setDefaultWatch(attr, scope, element);

                            /*加载初始数据*/
                            fmTool.LoadInitData(scope, attr);

                            scope.$watch("fmModel", function (newvalue, oldvalue) {
                                //if (oldvalue != undefined) {
                                //    scope.Init = true;
                                //}
                                if (!scope.Init) {
                                    scope.selectItem = [];
                                    if (!!scope.items) {
                                        var _ids = !scope.fmModel ? [] : scope.fmModel.split(",");
                                        for (var i = 0; i < scope.items.length; i++) {
                                            if (_ids.indexOf(scope.items[i][attr.valueMember]) >= 0) {
                                                scope.selectItem.push(scope.items[i]);
                                            }
                                        }
                                        if (attr.codeMember && !!scope.selectItem) {
                                            var _tempCode = [];
                                            for (var i = 0; i < scope.selectItem.length; i++) {
                                                _tempCode.push(scope.selectItem[i][attr.codeMember]);
                                            }
                                            scope.fmCode = _tempCode.join(',');
                                        }
                                    }
                                }
                            });

                            scope.$watch("items", function (newvalue, oldvalue) {
                                if (!!scope.items) {
                                    var ids = !!scope.fmModel ? scope.fmModel.split(",") : [];
                                    scope.selectItem = [], _tempCode = [];
                                    for (var i = 0; i < scope.items.length; i++) {
                                        if (ids.indexOf(scope.items[i][attr.valueMember]) >= 0) {
                                            scope.selectItem.push(scope.items[i]);
                                            _tempCode.push(scope.items[i][attr.codeMember]);
                                        }
                                    }
                                    scope.fmCode = _tempCode.join(',');
                                }
                            }, true);

                            //修改值
                            scope.event_ChangeValue = function (item) {
                                var _ids = !scope.fmModel ? [] : (scope.fmModel || "").split(",");
                                var _index = _ids.indexOf(item[attr.valueMember]);
                                if (_index >= 0) _ids.splice(_index, 1);
                                else _ids.push(item[attr.valueMember]);
                                scope.fmModel = _ids.join(",");
                                console.info(item[attr.displayMember], item[attr.valueMember], item[attr.codeMember]);
                                if (scope.state == "normal") {
                                    $timeout(function () {
                                        scope.callbackFunc({ selectItem: item, fmModel: scope.fmModel, fmCode: scope.fmCode });
                                    });
                                }
                            }

                            scope.event_Blur = function () {
                                $(element).removeClass("focus");
                            }
                        }
                    }
                }
            }
        }
])