_shared
/*下拉列表指令*/
.directive("fmSelect", ['fmTool', '$timeout', 'mabp.app.module', 'mabp.app.bpm',
    function (fmTool, $timeout, service, bpmService) {
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
                if (!attr.name) {
                    attr.name = attr.fmModel.toString().substring(attr.fmModel.lastIndexOf(".") + 1);
                }
                return '<div fm-model="' + attr.fmModel + '" field-text="{{getShadeText()}}" tabindex="-1" class="input-sm ma-select ' + (attr.ismulti ? 'multi' : 'single') + ' ' + attr.class + '" ng-class="state" ng-mousedown="openSelect($event)" ng-blur="blur()" ng-focus="focus()">' +
                    '<div class="placeholder" ng-hide="!fmPlaceholder" ng-class="{\'hide\':!!fmModel}">{{fmPlaceholder}}</div>' +
                    '<div class="select-value">' +
                    '<div class="item" ng-repeat="item in selectItem" ng-mousedown="event_removeSelectItem(item, $event)"><span> {{item.' + attr.displayMember + '}}' + (attr.ismulti ? '' : '<i ng-hide="!iClear" class="icon-times remove" ng-mousedown="event_ClearItem($event)"></i></span>') + '</div>' +
                    '</div>' +
                    '<div class="option" title="">' +
                    '<input ng-hide="!hasItem(15)" type="text" placeholder="Select" ng-model="findText" ng-mousedown="stopPropagation($event)" />' +
                    '<div class="option-item" ng-mousedown="stopPropagation($event)" >' +
                    '<ul>' +
                    '<li ng-mousedown="event_selectItem(item, $event)" ng-class="{\'active\': isCheck(item)}" ng-repeat="item in items | filter: {' + attr.displayMember + ':findText} track by $index">{{item.' + attr.displayMember + '}}</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '<input type="hidden" ' + (!!attr.name ? ('name="' + attr.name + '"') : '') + ' ' + _validate.join(' ') + ' ng-model="fmModel" ma-dynamic-element />' +
                    '</div>';
            },
            scope: {
                fmModel: '=',
                /*只有在基础数据的时候才会使用，返回基础数据Value*/
                fmCode: '=',
                items: '=',
                selectItem: '=',
                isOpen: '=',
                findText: '=',
                datacode: '=',
                fmNormal: '=',
                fmRequired: '=',
                fmDisabled: '=',
                fmReadonly: '=',
                filter: '=',
                callbackFunc: '&',
                fmBlur: '&'
            },
            require: '?^fmCache',
            link: function (scope, element, attr, cacheCtrl) {
                scope.fmPlaceholder = attr.fmPlaceholder;

                scope.iClear = (scope.iClear && scope.iClear !== false) || (attr.iClear != undefined && attr.iClear != "false") && true;
                //设置可空
                if (attr.isnull == undefined) isnull = true;
                else isnull = attr.isnull != undefined && attr.isnull != "false";

                fmTool.setScopeState(scope, attr);

                $timeout(function () {
                    if (scope.state == "normal") {
                    } else {
                    }
                }, 100);

                scope.$watch("filter", function (newvalue, oldvalue) {
                    if (!!newvalue && newvalue != oldvalue) {
                        fmTool.setDataSource(scope, attr, cacheCtrl);
                    }
                }, true);

                var option = element.find(".option");
                scope.selectItem = [];
                scope.isShow = false;

                fmTool.setDefaultWatch(attr, scope, element);

                /*加载初始数据*/
                fmTool.LoadInitData(scope, attr);

                scope.$watch("items", function (newvalue, oldvalue) {
                    if (!!scope.items) {
                        var maxsize = 0;
                        if (scope.items.length == 0) {
                            element.addClass("zeroitem");
                        } else {
                            element.removeClass("zeroitem");
                        }
                        var ids = !!scope.fmModel ? scope.fmModel.toString().split(",") : [];
                        scope.selectItem = [], _tempCode = [];
                        for (var i = 0; i < scope.items.length; i++) {
                            if (scope.items[i] == null) {
                                continue;
                            }
                            if (!!scope.items[i][attr.displayMember] && scope.items[i][attr.displayMember].length > maxsize) maxsize = scope.items[i][attr.displayMember].length;
                            if (ids.indexOf(scope.items[i][attr.valueMember]) >= 0) {
                                scope.selectItem.push(scope.items[i]);
                                _tempCode.push(scope.items[i][attr.codeMember]);
                            }
                        }
                        scope.fmCode = _tempCode.join(',');
                        option.css("width", (maxsize + 3) + "em");
                    }
                }, true);

                scope.$watch("datacode", function (newvalue, oldvalue) {
                    if (!!attr.datacode) {
                        if (newvalue != oldvalue && !!newvalue && !!oldvalue) {
                            scope.selectItem = null;
                            scope.ngModel = null;
                            scope.selectText = "";
                        }
                        var _dataCode = scope.datacode;
                        if (!!attr.datacodeFormat) {
                            _dataCode = attr.datacodeFormat.fill(scope.datacode);
                        }
                        if (scope.state == "normal") {
                            switch (scope.datatype) {
                                case "source":
                                    break;
                                case "view":
                                    fmTool.getView(scope.datacode, scope.filter, function (data) {
                                        if (!!data) {
                                            var _obj = {};
                                            for (var i = 0; i < data.displayColumList.length; i++) {
                                                data.displayColumList[i].displayColumn = data.displayColumList[i].displayColumn.substring(0, 1).toLowerCase() + data.displayColumList[i].displayColumn.substring(1);
                                                _obj[data.displayColumList[i].displayColumn] = data.displayColumList[i].name;
                                            }
                                            scope.items = data;
                                        }
                                    }, null, cacheCtrl);
                                    break;
                                case "dataitem":
                                    fmTool.getBasicdata(_dataCode, scope.filter, function (data) {
                                        //if (!!data) scope.items = data[0].children;
                                        if (!!data) scope.items = data.data;
                                    }, cacheCtrl);
                                    break;
                                default:
                            }
                        } else {
                            fmTool.getOne(scope, attr, service, cacheCtrl);
                        }
                    }
                });

                scope.$watch("selectItem", function (newV, oldV) {
                    if (newV != null && oldV != null && newV.length == 0 && oldV.length == 0) {
                        return;
                    }
                    scope.fmBlur({ item: scope.$parent.item || null });
                    //新增初始化时无需调用
                    if (scope.state == "normal" && fmTool.isInitialed(scope, element, attr)) scope.callbackFunc({ selectItem: scope.selectItem, fmModel: scope.fmModel });
                    var _tempCode = [];
                    if (!!scope.selectItem) {
                        for (var i = 0; i < scope.selectItem.length; i++) {
                            _tempCode.push(scope.selectItem[i][attr.codeMember]);
                        }
                        scope.fmCode = _tempCode.join(',');
                    }
                }, true);

                //刷新数据
                scope.dataUpdate = function () {
                    if (scope.state == "normal" && !!scope.items && scope.fmModel !== undefined) {
                        if (attr.ismulti) {
                            var _tempValue = (scope.fmModel || "").split(",");
                            var _tempCode = [];
                            scope.selectItem = [];
                            for (var i = 0; i < scope.items.length; i++) {
                                if (_tempValue.indexOf(scope.items[i][attr.valueMember]) >= 0) {
                                    scope.selectItem.push(scope.items[i]);
                                }
                            }
                        } else {
                            var _isTrue = true;
                            for (var i = 0; i < scope.items.length; i++) {
                                if (scope.items[i][attr.valueMember] == scope.fmModel) {
                                    scope.selectItem = [scope.items[i]];
                                    _isTrue = false;
                                    break;
                                }
                            }
                            if (_isTrue) scope.selectItem = [];
                        }
                        if (attr.codeMember && !!scope.selectItem) {
                            var _tempCode = [];
                            for (var i = 0; i < scope.selectItem.length; i++) {
                                _tempCode.push(scope.selectItem[i][attr.codeMember]);
                            }
                            scope.fmCode = _tempCode.join(',');
                        }
                    } else if (scope.state == "normal" && !scope.items) {
                        fmTool.setDataSource(scope, attr, cacheCtrl);
                    } else if (scope.state != "normal" && scope.fmModel !== undefined) {
                        fmTool.getOne(scope, attr, null, cacheCtrl);
                    } else if (scope.fmModel === undefined) {
                        scope.selectItem = {};
                    }
                }

                scope.$watch("fmModel", function (newvalue, oldvalue) {
                    if (newvalue == undefined) {
                        scope.selectItem = [];
                    }
                    if (oldvalue != null && newvalue == null) {
                        return;
                    }
                    //if (oldvalue != undefined && newvalue != oldvalue) {
                    //    scope.Init = true;
                    //}
                    if (!scope.Init) {
                        scope.dataUpdate();
                    } else if (scope.state == "normal" && !!scope.items && scope.fmModel !== undefined) {
                        if (attr.ismulti) {
                            var _tempValue = (scope.fmModel || "").split(",");
                            var _tempCode = [];
                            scope.selectItem = [];
                            for (var i = 0; i < scope.items.length; i++) {
                                if (_tempValue.indexOf(scope.items[i][attr.valueMember]) >= 0) {
                                    scope.selectItem.push(scope.items[i]);
                                }
                            }
                        } else {
                            var _isTrue = true;
                            for (var i = 0; i < scope.items.length; i++) {
                                if (scope.items[i][attr.valueMember] == scope.fmModel) {
                                    scope.selectItem = [scope.items[i]];
                                    _isTrue = false;
                                    break;
                                }
                            }
                            if (_isTrue) scope.selectItem = [];
                        }
                        if (attr.codeMember && !!scope.selectItem) {
                            var _tempCode = [];
                            for (var i = 0; i < scope.selectItem.length; i++) {
                                _tempCode.push(scope.selectItem[i][attr.codeMember]);
                            }
                            scope.fmCode = _tempCode.join(',');
                        }
                    }
                });

                //判断是否包含多个项（大于N个时显示搜索文本框
                scope.hasItem = function (num) {
                    if (!num) num = 0;
                    return scope.items && (scope.items.length > num || Object.keys(scope.items).length > num);
                }

                scope.documentClick = function (event) {
                    if (event == event) {
                        //绑定后解绑事件
                        angular.element(document).off('mousedown', scope.documentClick);
                        if (scope.isOpen) {
                            //重点是用$timeout保证变量同步修改
                            $timeout(function () {
                                scope.setOpen(false);
                            }, 0);
                        }
                    }
                }

                //停止冒泡
                scope.stopPropagation = function (event) {
                    //scope.isOpen = true;
                    event.stopPropagation();
                }
                //判断是否为控件本身的点击，是则setOpen(!)
                openSelectOfRoot = function (event) {
                    console.log(event);
                }
                //点击控件展开/收缩
                scope.openSelect = function (event) {
                    if (scope.state == "normal") {
                        scope.setOpen(!scope.isOpen);
                        if (scope.isOpen) {
                            angular.element(document).on('mousedown', scope.documentClick);
                        }
                        scope.TopOrBottom();
                    }
                    event.stopPropagation();
                }

                scope.setOpen = function (bo) {
                    if (scope.state == "normal") {
                        scope.isOpen = bo;
                        if (bo) element.addClass("open");
                        else element.removeClass("open");
                    }
                }

                scope.TopOrBottom = function () {
                    if (option.offset().top + option.height() > $(document).height()) {
                        option.css({
                            top: (option.height() * -1 - 10) + "px",
                            boxShadow: "0 -3px 12px rgba(0,0,0,0.175)"
                        });
                    } else {
                        option.css({
                            top: "",
                            boxShadow: ""
                        });
                    }
                }

                scope.blur = function () {
                    $(element).removeClass("focus");
                    $timeout(function () {
                        if (!element.is(":focus") && !element.find("[type=text]").is(":focus")) {
                            scope.setOpen(false);
                        }
                    }, 100);
                }
                scope.focus = function () {
                    $timeout(function () {
                        element.find("[type=text]").focus();
                    }, 100);
                }

                //判断是否已选中
                scope.isCheck = function (item) {
                    if (!item) return false;
                    try {
                        return (!scope.fmModel ? [] : scope.fmModel.toString().split(",")).indexOf(item[attr.valueMember]) >= 0;
                    } catch (e) {
                        debugger;
                    }
                }

                //清空所有选中项
                scope.clear = function (event) {
                    scope.selectItem = [];
                    scope.fmModel = "";
                    event.stopPropagation();
                }

                scope.event_ClearItem = function (event) {
                    scope.fmModel = "";
                    scope.selectItem = [];
                    event.stopPropagation();
                }

                scope.event_removeSelectItem = function (item, event) {
                    if (attr.ismulti) {
                        scope.event_selectItem(item, event);
                    }
                }

                //选择节点事件
                scope.event_selectItem = function (item, event) {
                    if (scope.state == "normal") {
                        //判断是否为多选框
                        if (attr.ismulti) {
                            var _ids = !scope.fmModel ? [] : (scope.fmModel || "").split(",");
                            var _index = _ids.indexOf(item[attr.valueMember]);
                            if (_index >= 0) _ids.splice(_index, 1);
                            else _ids.push(item[attr.valueMember]);
                            scope.fmModel = _ids.join(",");
                        } else {
                            scope.fmModel = item[attr.valueMember];
                            scope.findText = "";
                        }
                        console.info(item[attr.displayMember], item[attr.valueMember], item[attr.codeMember]);
                        element.focus();
                    }
                    if (!attr.ismulti) scope.setOpen(false);
                    event.stopPropagation();
                }

                scope.isShowItem = function (item) {
                    if (!scope.findText) return false;
                    else return (item[attr.displayMember] || "").toLowerCase().indexOf((scope.findText || "").toLowerCase()) < 0;
                }

                scope.updateState = function () {
                    if (scope.state == "normal") {
                        if (!scope.items) {
                            switch (scope.datatype) {
                                case "source":
                                    break;
                                case "view":
                                    fmTool.getView(scope.datacode, scope.filter, function (data) {
                                        if (!!data) scope.items = data.viewTable;
                                    }, null, cacheCtrl);
                                    break;
                                case "dataitem":
                                    fmTool.getBasicdata(scope.datacode, scope.filter, function (data) {
                                        //if (!!data) scope.items = data[0].children;
                                        if (!!data) scope.items = data.data;
                                    }, cacheCtrl);
                                    break;
                                default:
                            }
                        }
                    }
                }
            }
        }
    }])