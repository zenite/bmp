_shared
/*复选框/切换框列表指令*/
.directive('fmRadiolist', [
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
                    return '<div fm-model="' + attr.fmModel + '" class="fm-checklist input-sm" ng-class="state" ids="{{fmModel}}{{random}}" ng-blur="event_Blur()">' +
                               '<div style="width:' + columnwidth + '%;" class="fm-checklist-checkbox" ng-repeat="r in items track by $index">' +
                                   '<label><input ng-disabled="state == \'disabled\' || state == \'readonly\' || r.' + attr.disabledMember + ' === true" ng-checked="isChecked(r)" name="' + attr.name + '{{random}}" type="radio" value="{{r.' + attr.valueMember + '}}" ng-click="event_ChangeValue(r, $event)" />{{r.' + attr.displayMember + '}}</label>' +
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
                    callbackFunc: '&',
                    fmBlur: '='
                },
                compile: function (tElement, tAttrs, transclude) {
                    return {
                        pre: function preLink(scope, element, attr, ctrl) {
                        },
                        post: function postLink(scope, element, attr, ctrl) {
                            scope.random = _$.getGUID().substr(0, 4);
                            if (attr.fmModel == 'form.pur01.expenseSource') {
                                console.log(scope.fmModel + scope.state);
                            }
                            fmTool.setScopeState(scope, attr);

                            fmTool.setDataSource(scope, attr, service);

                            scope.$watch("filter", function (newvalue, oldvalue) {
                                if (!!newvalue && newvalue != oldvalue) {
                                    fmTool.setDataSource(scope, attr, service, bpmService);
                                }
                            }, true);

                            scope.isChecked = function (item) {
                                return scope.fmModel === item[attr.valueMember];
                            }

                            fmTool.setDefaultWatch(attr, scope, element);

                            /*加载初始数据*/
                            fmTool.LoadInitData(scope, attr);

                            scope.$watch("fmModel", function (newvalue, oldvalue) {
                                //if (oldvalue != undefined) {
                                //    scope.Init = true;
                                //}
                                if (!scope.Init) {
                                    if (!!scope.fmModel && !!scope.items) {
                                        var _isTrue = true;
                                        for (var i = 0; i < scope.items.length; i++) {
                                            if (scope.fmModel == scope.items[i][attr.valueMember]) {
                                                scope.selectItem = [scope.items[i]];
                                                _isTrue = false;
                                                break;
                                            }
                                        }
                                        if (_isTrue) scope.selectItem = [];
                                        if (attr.codeMember && !!scope.selectItem) {
                                            var _tempCode = [];
                                            for (var i = 0; i < scope.selectItem.length; i++) {
                                                _tempCode.push(scope.selectItem[i][attr.codeMember]);
                                            }
                                            scope.fmCode = _tempCode.join(',');
                                        } else {

                                        }
                                    }
                                }
                            });

                            scope.$watch("items", function (newvalue, oldvalue) {
                                if (!!scope.items) {
                                    var ids = scope.fmModel;
                                    scope.selectItem = [], _tempCode = [];
                                    for (var i = 0; i < scope.items.length; i++) {
                                        if (ids == scope.items[i][attr.valueMember]) {
                                            scope.selectItem.push(scope.items[i]);
                                            _tempCode.push(scope.items[i][attr.codeMember]);
                                            break;
                                        }
                                    }
                                    scope.fmCode = _tempCode.join(',');
                                }
                            }, true);

                            //修改值
                            scope.event_ChangeValue = function (item) {
                                scope.fmModel = item[attr.valueMember];
                                console.info(item[attr.displayMember], item[attr.valueMember], item[attr.codeMember]);
                                if (scope.state == "normal") {
                                    $timeout(function () {
                                        scope.callbackFunc({ selectItem: item, fmModel: scope.fmModel });
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