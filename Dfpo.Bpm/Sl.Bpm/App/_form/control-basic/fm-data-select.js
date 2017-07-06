_shared
/*下拉列表指令*/
.directive("fmDataSelect", ['fmTool', '$timeout', 'dialog', 'mabp.app.module', 'mabp.app.bpm', function (fmTool, $timeout, dialog, service, bpmService) {
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
            return '<div fm-model="' + attr.fmModel + '" class="input-sm ma-data-select ' + (attr.ismulti ? 'multi' : 'single') + ' ' + attr.class + '" ng-class="state" ng-mousedown="openSelect($event)" ng-blur="event_Blur()" style="display: inline-block;">' +
                        (!!attr.placeholder ? '<div class="placeholder" ng-class="{\'hide\':!!fmModel}">{{placeholder}}</div>' : '') +
                        '<div class="select-data-value">' +
                            '<div class="item ' + (attr.href ? 'href-item' : '') + '" ng-repeat="item in selectItem" ng-mousedown="event_removeSelectItem(item, $event)"><span>{{::item.' + attr.displayMember + '}}</span>' + (attr.ismulti ? '' : '<i ng-hide="!iClear || state!=\'normal\'" class="icon-times remove" ng-mousedown="clear($event)"></i>') + '</div>' +
                            '<div class="item ' + (attr.href ? 'href-item' : '') + '" ng-if="(!selectItem || selectItem.length == 0) && !!defaultModel" ng-mousedown="event_clickSelectItem(defaultModel, $event)"><span>{{defaultModel}}</span>' + (attr.ismulti ? '' : '<i ng-hide="!iClear || state!=\'normal\'" class="icon-times remove" ng-mousedown="clear($event)"></i>') + '</div>' +
                        '</div>' +
                        '<button class="btn btn-info btn-sm select-data-button" type="button" ng-click="event_SelectData()" >' + (attr.btntext || '{{(\'Choose\' | translate)}}') + '</button>' +
                        '<input type="hidden" ' + (!!attr.name ? ('name="' + attr.name + '"') : '') + ' ' + _validate.join(' ') + ' ng-model="fmModel" />' +
                    '</div>';
        },
        scope: {
            fmModel: '=',
            /*只有在基础数据的时候才会使用，返回基础数据Value*/
            fmCode: '=',
            items: '=',
            columns: '=',
            selectItem: '=',
            isOpen: '=',
            findText: '=',
            datacode: '=',
            fmNormal: '=',
            fmRequired: '=',
            fmDisabled: '=',
            fmReadonly: '=',
            filter: '=',
            defaultFilter: '=',
            //获取父类Id
            parentId: '=',
            defaultModel: '=',
            callbackFunc: '&',
            fmBlur: '&'
        },
        require: '?^fmCache',
        link: function (scope, element, attr, cacheCtrl) {
            //弹出页面大小
            attr.size = attr.size ? ("" + attr.size).toLowerCase() : "md";
            scope.placeholder = attr.placeholder;
            scope.IsSelectData = false;
            scope.iClear = (scope.iClear && scope.iClear !== false) || (attr.iClear != undefined && attr.iClear != "false") && true;
            //设置单选/多选
            if (!!attr.ismulti && attr.ismulti !== "false" && scope.ismulti === undefined) {
                scope.ismulti = true;
            } else scope.ismulti = false;
            //设置可空
            if (attr.isnull == undefined) isnull = true;
            else isnull = attr.isnull != undefined && attr.isnull != "false";

            scope.selectItem = [];
            fmTool.setScopeState(scope, attr);

            /*加载初始数据*/
            fmTool.LoadInitData(scope, attr);

            scope.$watch("filter", function (newvalue, oldvalue) {
                if (!!scope.filter && scope.state == "normal") {
                    fmTool.setDataSource(scope, attr, cacheCtrl);
                }
            }, true);

            //fmTool.setDefaultWatch(scope, element);

            var option = element.find(".option");
            scope.isShow = false;

            fmTool.setDefaultWatch(attr, scope, element);



            scope.$watch("items", function (newvalue, oldvalue) {
                if (!!scope.items) {
                    var maxsize = 0;
                    if (scope.items.length == 0) {
                        element.addClass("zeroitem");
                    } else {
                        element.removeClass("zeroitem");
                    }
                    var _ids = scope.fmModel ? scope.fmModel.split(",") : [];
                    if ((attr.mustleaf || scope.datatype == 'group' || scope.datatype == 'joblevel') && scope.fmModel != null) {
                        //仅支持单选数据
                        scope.selectItem = fmTool.getTreeData(scope.items, scope.fmModel, attr);
                        if (!!scope.selectItem && scope.selectItem.length > 0) {
                            scope.parentId = scope.selectItem[0].parentId;
                        }
                    } else {
                        for (var i = 0; i < scope.items.length; i++) {
                            if (!!scope.items[i][attr.displayMember] && scope.items[i][attr.displayMember].length > maxsize) maxsize = scope.items[i][attr.displayMember].length;
                            if (_ids.indexOf(scope.items[i][attr.valueMember]) >= 0) {
                                scope.selectItem.push(scope.items[i]);
                            }
                        }
                    }
                    option.css("width", (maxsize + 3) + "em");
                }
            }, true);

            scope.$watch("selectItem", function (newV, oldV) {
                if (newV != null && oldV != null && newV.length == 0 && oldV.length == 0) {
                    return;
                }
                if (attr.codeMember && !!scope.selectItem) {
                    var _tempCode = [];
                    for (var i = 0; i < scope.selectItem.length; i++) {
                        if (scope.selectItem[i] != null && scope.selectItem[i][attr.codeMember] != null) {
                            _tempCode.push(scope.selectItem[i][attr.codeMember]);
                        }
                    }
                    scope.fmCode = _tempCode.join(',');
                }
                if (scope.state == "normal" && fmTool.isInitialed(scope, element, attr)) scope.callbackFunc({ selectItem: scope.selectItem, fmModel: scope.fmModel });
            }, true);

            //刷新数据
            scope.dataUpdate = function () {
                if (scope.state == "normal" && !!scope.items && scope.fmModel !== undefined) {
                    if (scope.datatype != "dataitem" && scope.datatype != "group") {
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
                    } else {
                        /*定义递归方法*/
                        scope.selectItem = fmTool.getTreeData(scope.items, scope.fmModel, attr);
                        if (!!scope.selectItem && scope.selectItem.length > 0) {
                            scope.parentId = scope.selectItem[0].parentId;
                        }
                    }
                    if (scope.IsSelectData) {
                        scope.IsSelectData = false;
                    }
                    scope.fmBlur({ item: scope.$parent.item, selectItem: scope.selectItem || [] });
                } else if (scope.state == "normal" && !scope.items && !!scope.fmModel) {
                    fmTool.setDataSource(scope, attr, cacheCtrl);
                } else if (scope.state != "normal" && !!scope.fmModel) {
                    fmTool.getOne(scope, attr, null, cacheCtrl);
                }
            }

            //绑定值变化 更新显示值
            scope.$watch("fmModel", function (newvalue, oldvalue) {
                if (newvalue == undefined) {
                    scope.selectItem = [];
                }
                //if (oldvalue != undefined) {
                //    scope.Init = true;
                //}
                if (!scope.Init) {
                    scope.dataUpdate();
                } else if (scope.state == "normal" && !!scope.items && scope.fmModel !== undefined) {
                    if (scope.datatype != "dataitem" && scope.datatype != "group") {
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
                    } else {
                        /*定义递归方法*/
                        scope.selectItem = fmTool.getTreeData(scope.items, scope.fmModel, attr);
                        if (!!scope.selectItem && scope.selectItem.length > 0) {
                            scope.parentId = scope.selectItem[0].parentId;
                        }
                    }
                    if (scope.IsSelectData) {
                        scope.IsSelectData = false;
                    }
                    scope.fmBlur({ item: scope.$parent.item, selectItem: scope.selectItem || [] });
                }
            });

            //判断是否包含多个项（大于N个时显示搜索文本框
            scope.hasItem = function (num) {
                if (!num) num = 0;
                return scope.items && (scope.items.length > num || Object.keys(scope.items).length > num);
            }

            scope.focus = function () {
                $timeout(function () {
                    element.find("[type=text]").focus();
                }, 100);
            }

            //清空所有选中项
            scope.clear = function (event) {
                scope.selectItem = [];
                scope.fmModel = "";
                event.stopPropagation();
            }

            scope.event_removeSelectItem = function (item, event) {
                if (!!attr.href) {
                    window.open(attr.href.replace(/{.*?}/g, function (regItem, index, str) {
                        for (var property in item) {
                            if (property.toLowerCase() == regItem.substr(1, regItem.length - 2).toLowerCase()) {
                                return item[property];
                            }
                        }
                        return "";
                    }));
                }
                if (attr.ismulti) {
                    scope.event_selectItem(item, event);
                }
            }

            scope.event_clickSelectItem = function (item, event) {
                if (!!attr.href) {
                    window.open(attr.href.replace(/{.*?}/g, function (regItem, index, str) {
                        return scope.defaultModel;
                    }));
                }
                if (attr.ismulti) {
                    scope.event_clickSelectItem(item, event);
                }
            }

            //选择节点事件
            scope.event_selectItem = function (item, event) {
                debugger;
                if (scope.state == "normal") {
                    //判断是否为多选框
                    if (attr.ismulti) {
                        var _ids = !scope.fmModel ? [] : (scope.fmModel || "").split(",");
                        var _index = _ids.indexOf(item[attr.valueMember]);
                        if (_index >= 0) _ids.splice(_index, 1);
                        else _ids.push(item[attr.valueMember]);
                        scope.fmModel = _ids.join(",");
                        event.stopPropagation();
                    } else {
                        scope.fmModel = item[attr.valueMember];
                        scope.findText = "";
                    }
                    console.info(item[attr.displayMember], item[attr.valueMember], item[attr.codeMember]);
                    element.focus();
                }
            }

            scope.event_SelectData = function () {
                debugger;
                if (scope.state == "normal") {
                    switch (scope.datatype) {
                        case "source":
                            dialog.open(_shared.dialogs['formSelect'], { data: scope.items, datatype: "source", filter: scope.filter, defaultfilter: scope.defaultFilter, selectData: scope.fmModel, column: scope.columns, title: attr.placeholder, ismulti: scope.ismulti, valueMember: attr.valueMember, size: attr.size }).then(function (data) {
                                if (data !== null && data !== undefined) {
                                    scope.items = data.items;
                                    scope.fmModel = data.selectItem;
                                    scope.IsSelectData = true;
                                    scope.defaultFilter = data.defaultFilter;
                                } else if (data === null) {
                                    scope.fmModel = "";
                                }
                            });
                            break;
                        case "view":
                            dialog.open(_shared.dialogs['formSelect'], { datacode: scope.datacode, datatype: "view", filter: scope.filter, defaultfilter: scope.defaultFilter, selectData: scope.fmModel, column: scope.columns, title: attr.formTitle, ismulti: scope.ismulti, valueMember: attr.valueMember, size: attr.size }).then(function (data) {
                                debugger;
                                if (data !== null && data !== undefined) {
                                    scope.items = data.items;
                                    scope.fmModel = data.selectItem;
                                    scope.IsSelectData = true;
                                    scope.defaultFilter = data.defaultFilter;
                                } else if (data === null) {
                                    scope.fmModel = "";
                                }
                            });
                            break;
                        case "dataitem":
                            dialog.open(_shared.dialogs['treeSelect'], { datacode: scope.datacode, datatype: "dataitem", filter: scope.filter, selectData: angular.copy(scope.selectItem), column: scope.columns, title: attr.formTitle, ismulti: scope.ismulti, mustleaf: attr.mustleaf, size: attr.size }).then(function (data) {
                                if (data !== undefined) {
                                    scope.items = data.items;
                                    /*未修改*/
                                    scope.selectItem = data.selectItem;
                                    var ids = [];
                                    if (!!scope.selectItem && scope.selectItem.length > 0) {
                                        for (var i = 0; i < scope.selectItem.length; i++) {
                                            ids.push(scope.selectItem[i][attr.valueMember]);
                                        }
                                    }
                                    scope.fmModel = ids.join(",");
                                    scope.IsSelectData = true;
                                } else if (data === null) {
                                    scope.fmModel = "";
                                }
                            });
                            break;
                        case "group":
                            dialog.open(_shared.dialogs['treeSelect'], { data: scope.items, datatype: "group", filter: scope.filter, defaultfilter: scope.defaultFilter, selectData: angular.copy(scope.selectItem), column: scope.columns, title: attr.formTitle, ismulti: scope.ismulti, mustleaf: attr.mustleaf }).then(function (data) {
                                if (data !== null && data !== undefined) {
                                    scope.items = data.items;
                                    scope.selectItem = data.selectItem;
                                    scope.defaultFilter = data.defaultFilter;
                                    var ids = [];
                                    if (!!scope.selectItem && scope.selectItem.length > 0) {
                                        for (var i = 0; i < scope.selectItem.length; i++) {
                                            ids.push(scope.selectItem[i][attr.valueMember]);
                                        }
                                    }
                                    scope.fmModel = ids.join(",");
                                    scope.IsSelectData = true;
                                } else if (data === null) {
                                    scope.fmModel = "";
                                }
                            });
                            break;
                        case "joblevel":
                            dialog.open(_shared.dialogs.jobLevelDialog, { value: scope.fmModel, ismulti: scope.ismulti }).then(function (data) {
                                if (data !== null && data !== undefined) {
                                    scope.items = data;
                                    scope.selectItem = data;
                                    var ids = [];
                                    if (!!scope.selectItem && scope.selectItem.length > 0) {
                                        for (var i = 0; i < scope.selectItem.length; i++) {
                                            ids.push(scope.selectItem[i][attr.valueMember]);
                                        }
                                    }
                                    scope.fmModel = ids.join(",");
                                    scope.IsSelectData = true;
                                } else if (data === null) {
                                    scope.fmModel = "";
                                }
                            });
                            break;
                        default:
                    }
                }
            }

            scope.event_Blur = function () {
                $(element).removeClass("focus");
            }
        }
    }
}])