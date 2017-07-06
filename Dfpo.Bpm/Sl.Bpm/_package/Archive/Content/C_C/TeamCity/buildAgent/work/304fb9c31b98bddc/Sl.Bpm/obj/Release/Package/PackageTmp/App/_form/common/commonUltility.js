_shared.service('fmTool', function () {
    var service = {
        LoadInitData: function (scope, attr) {
            var pageScope = scope;
            while (!!pageScope && !pageScope.base) {
                pageScope = pageScope.$parent;
            }
            //根据页面状态判断是否初始化
            scope.Init = attr.pageState == "1" ? true : false;
            var hasInitData = false;
            if (!scope.Init && pageScope) {
                switch (scope.datatype) {
                    case "view":
                        if (!!pageScope.base.basicAndViewData && !!pageScope.base.basicAndViewData[scope.datacode]) {
                            for (var i = 0; i < pageScope.base.basicAndViewData[scope.datacode].length; i++) {
                                if (pageScope.base.basicAndViewData[scope.datacode][i][attr.valueMember] == scope.fmModel) {
                                    scope.selectItem = [pageScope.base.basicAndViewData[scope.datacode][i]];
                                    hasInitData = true;
                                    break;
                                }
                            }
                        }
                        break;
                    case "dataitem":
                        if (!!pageScope.base.basicAndViewData[scope.datacode]) {
                            scope.items = pageScope.base.basicAndViewData[scope.datacode];
                            hasInitData = true;
                        }
                        break;
                    default:
                }
            }
            scope.Init = hasInitData;
        },
        //初始化文本控件（包括事件数字金额日期等
        textInit: function (attr) {
            /*整数*/
            if (attr.integer != undefined && attr.integer != "false") {
                attr.scale = attr.scale || 0;
                attr.displayScale = attr.displayScale || 0;
                attr.NumLength = attr.NumLength || 10;
                attr.fmPattern = "^(-?[0-9]{1," + attr.NumLength + "})?$";
            }
                /*金额*/
            else if (attr.cny != undefined && attr.cny != "false") {
                attr.scale = attr.scale || 6;
                attr.displayScale = attr.displayScale || 2;
                attr.NumLength = attr.NumLength || 12;
                attr.unit = "";
                attr.fmPattern = "^(-?[0-9]{1," + attr.NumLength + "}(.([0-9]{1," + attr.scale + "})?)?)?$";
                attr.formatFunc = function (fmModel) {
                    if (!fmModel) return "";
                    if (isNaN(fmModel)) return "";
                    var _result = "" + parseFloat(fmModel).pushZero(attr.displayScale);
                    var moneystr = [];
                    var pointindex = (_result.lastIndexOf(".") == -1 ? _result.length : _result.lastIndexOf("."));
                    var CommaCount = 0;
                    for (var i = _result.length - 1; i >= 0; i--) {
                        moneystr.splice(0, 0, _result[i]);
                        if ((pointindex - i) % 3 == 0 && i != 0 && i < pointindex - 2) {
                            if (_result[0] == "-" && i == 1) continue;
                            moneystr.splice(0, 0, ",");
                            CommaCount++;
                        }
                    }
                    return moneystr.join("");
                }
            }
                /*数字（默认）*/
            else {
                attr.scale = attr.scale || 6;
                attr.displayScale = attr.displayScale || 2;
                attr.NumLength = attr.NumLength || 12;
                attr.fmPattern = "^(-?[0-9]{1," + attr.NumLength + "}(.([0-9]{1," + attr.scale + "})?)?)?$";
            }
            /*日期*/
            if (attr.datetime != undefined && attr.date != "false") {
                attr.view = "date";
                attr.minView = "minutes";
                attr.format = "YYYY-MM-DD HH:mm";
                attr.formatStr = "YYYY-MM-DD HH:mm";
            }
            if (attr.date != undefined && attr.datetime != "false") {
                attr.view = "date";
                attr.minView = "date";
                attr.format = "YYYY-MM-DD";
                attr.formatStr = "YYYY-MM-DD";
            }
            if (attr.time != undefined && attr.time != "false") {
                attr.view = "hours";
                attr.maxView = "hours";
                attr.minView = "minutes";
                attr.format = "HH:mm";
                attr.formatStr = "HH:mm";
            }

            if (attr.creditcard != undefined && attr.creditcard != "false") {
                attr.formatFunc = function (fmModel) {
                    if (!fmModel || (typeof fmModel) == "object") return "";
                    var _result = ("" + fmModel).replace(/\s/g, "");
                    //console.log(_result);
                    var moneystr = [];
                    for (var i = _result.length - 1; i >= 0; i--) {
                        moneystr.splice(0, 0, _result[i]);
                        if (i % 4 == 0 && i != 0) {
                            moneystr.splice(0, 0, " ");
                        }
                    }
                    return moneystr.join("");
                };
            }
        },
        //给Scope设置state属性
        setScopeState: function (scope, attr) {
            attr.pageState = $("[page-state]").attr("page-state");
            //控件状态
            scope.state = scope.state || attr.state;
            //页面状态
            if (!!attr.pageState) {
                switch ("" + attr.pageState) {
                    case "1": //发起
                        scope.pageState = "normal";
                        attr.state = scope.pageState;
                        break;
                    case "2": //审批
                        scope.pageState = "disabled";
                        attr.state = scope.pageState;
                        break;
                    default:
                }
            }

            if (attr.readonly !== undefined && attr.readonly != "false") scope.state = "readonly";
            else if (attr.disabled !== undefined && attr.disabled != "false") scope.state = "disabled";
            else if (attr.hidden !== undefined && attr.hidden != "false") scope.state = "hidden";
            else if (attr.normal !== undefined && attr.normal != "false") scope.state = "normal";
            else if (!scope.state) scope.state = scope.pageState || "normal";

            //获取datatype
            scope.datatype = scope.datatype === undefined && !!attr.datatype ? attr.datatype : scope.datatype;
            if (!scope.datatype) scope.datatype = "source";
            if (attr.view !== undefined && attr.view.toLowerCase() != "false") {
                scope.datatype = "view";
                if (attr.view != "") scope.datacode = attr.view;
            }
            else if (attr.source !== undefined && attr.source.toLowerCase() != "false") scope.datatype = "source";
            else if (attr.dataitem !== undefined && attr.dataitem.toLowerCase() != "false") {
                scope.datatype = "dataitem";
                if (attr.dataitem != "") scope.datacode = attr.dataitem;
            }
            else if (attr.group !== undefined && attr.group.toLowerCase() != "false") {
                scope.datatype = "group";
                if (attr.group != "") scope.datacode = attr.group;
            }
            else if (attr.joblevel !== undefined && attr.joblevel.toLowerCase() != "false") {
                scope.datatype = "joblevel";
                if (attr.joblevel != "") scope.datacode = attr.joblevel;
            }
            //页面状态
            if (!!attr.pageState) {
                switch ("" + attr.pageState) {
                    case "3": //查看
                        scope.state = "readonly";
                        scope.pageState = "readonly";
                        attr.state = scope.pageState;
                        break;
                    default:
                }
            }
        },
        //获取验证的数组
        setValidate: function (attr) {
            var _validate = [];
            if (attr.fmModel != undefined && attr.fmModel != "false") _validate.push("fm-model='" + attr.fmModel + "'");
            if (attr.required != undefined && attr.required != "false") { _validate.push("required"); }
            if (!!attr.minValue && attr.minValue != "false") _validate.push("min-value='" + attr.minValue + "'");
            if (!!attr.maxValue && attr.maxValue != "false") _validate.push("max-value='" + attr.maxValue + "'");
            if (!!attr.minlength && attr.minlength != "false") _validate.push("min-length='" + attr.minlength + "'");
            if (!!attr.maxlength && attr.maxlength != "false") _validate.push("max-length='" + attr.maxlength + "'");
            //if (!!attr.pattern && attr.pattern != "false") _validate.push("pattern='" + attr.pattern + "'");
            if (!!attr.view && attr.view != "false") _validate.push("view='" + attr.view + "'");
            if (!!attr.minView && attr.minView != "false") _validate.push("min-view='" + attr.minView + "'");
            if (!!attr.format && attr.format != "false") _validate.push("format='" + attr.format + "'");
            return _validate;
        },
        //设置默认的Member
        setDefaultMember: function (attr) {
            if (!attr.disabledMember) attr.disabledMember = "_isDisabled";
            if (!attr.displayMember) attr.displayMember = "text";
            if (!attr.codeMember) attr.codeMember = "value";
            if (!attr.valueMember) attr.valueMember = "id";

            //是否是树形叶子节点
            attr.mustleaf = attr.mustleaf !== undefined && attr.mustleaf !== "false";
        },
        //设置数据源
        setDataSource: function (scope, attr, service, bpmService, cacheCtrl) {
            var param;
            switch (scope.datatype) {
                case "source":
                    break;
                case "view":
                    var getViewCallBack = function (data) {
                        if (!!data) {
                            var _obj = {};
                            for (var i = 0; i < data.displayColumList.length; i++) {
                                data.displayColumList[i].displayColumn = data.displayColumList[i].displayColumn.substring(0, 1).toLowerCase() + data.displayColumList[i].displayColumn.substring(1);
                                _obj[data.displayColumList[i].displayColumn] = data.displayColumList[i].name;
                            }
                            scope.columns = _obj;
                            scope.items = data.viewTable;
                            attr.formTitle = data.viewName;
                        }
                    };
                    if (!!cacheCtrl) {
                        param = { code: scope.datacode, filters: mabp.toArray(scope.filter) };
                        cacheCtrl.fmCache.get(scope.datacode, service.getViewTable, param, getViewCallBack);
                    } else {
                        service.getViewTable({ code: scope.datacode, filters: mabp.toArray(scope.filter) }).then(getViewCallBack);
                    }
                    break;
                case "dataitem":
                    var getBasicDataCallBack = function (data) {
                        if (!!data) {
                            scope.items = data.data;
                            attr.formTitle = data.name;
                        }
                    }
                    if (!!cacheCtrl) {
                        param = { code: scope.datacode, filters: mabp.toArray(scope.filter) };
                        cacheCtrl.fmCache.get(scope.datacode, service.getBasicData, param, getBasicDataCallBack);
                    } else {
                        service.getBasicData({ code: scope.datacode, filters: mabp.toArray(scope.filter) }).then(getBasicDataCallBack);
                    }
                    break;
                case "group":
                    var getGroupTreeCallBack = function (data) {
                        scope.items = data;
                        for (var i = 0; i < scope.items.length; i++) {
                            scope.items[i].$$isExpend = true;
                        }
                        attr.formTitle = data[0].text;
                    }
                    if (!!cacheCtrl) {
                        cacheCtrl.fmCache.get("group", bpmService.getGroupTree, null, getGroupTreeCallBack);
                    } else {
                        bpmService.getSelectedGroupTree({ id: (!!scope.filter && !!scope.filter.id) ? scope.filter.id : "", areaCode: (!!scope.filter && !!scope.filter.areaCode) ? scope.filter.areaCode : "" }).then(getGroupTreeCallBack);
                    }
                    break;
                case "joblevel":
                    var getJobLevelCallBack = function (data) {
                        data.id = data.value;
                        data.text = data.name;
                        scope.items = [data];
                        for (var i = 0; i < scope.items.length; i++) {
                            scope.items[i].$$isExpend = true;
                        }
                        attr.formTitle = data.name;
                    }
                    if (!!cacheCtrl) {
                        cacheCtrl.fmCache.get("joblevel", service.getAllEnumsByName, scope.fmModel, getJobLevelCallBack);
                    } else {
                        service.getJobLevelEnumNameByValue({ id: scope.fmModel }).then(getJobLevelCallBack);
                    }
                    break;
                default:
            }
        },
        getOne: function (scope, attr, service, bpmService, options) {
            if (scope.fmModel != null) {
                switch (scope.datatype) {
                    case "view":
                        //当Id不能唯一标识的时候，还可以用其他变量来辅助查询
                        var fils = mabp.toArray(scope.filter);
                        fils.push({ name: "id", value: scope.fmModel });
                        service.getViewOne({ code: scope.datacode, filters: fils, key: scope.fmModel }).then(function (data) {
                            if (!!data && scope.fmModel != null) {
                                scope.selectItem = data.viewTable;
                            }
                        });
                        break;
                    case "dataitem":
                        //基础数据使用值而非Id存储。
                        if (attr.valueMember == 'value') {
                            service.getBasicData({ code: scope.datacode, filters: mabp.toArray(scope.filter), key: scope.fmModel, type: false }).then(function (data) {
                                if (!!data && scope.fmModel != null) {
                                    if (data.data && data.data.length > 0) {
                                        //if (!scope.items) scope.items = [];
                                        //scope.items.push(_.filter(data.data, { value: scope.fmModel }));
                                        scope.selectItem = _.filter(data.data, { value: scope.fmModel });
                                        //scope.fmModel = scope.fmModel;
                                        if (scope.selectItem.length > 0)
                                            scope.parentId = scope.selectItem[0].parentId;
                                    }
                                }
                            });
                        } else {
                            service.getBasicData({ code: scope.datacode, filters: mabp.toArray(scope.filter), key: scope.fmModel, type: true }).then(function (data) {
                                if (!!data && scope.fmModel != null) {
                                    if (data.data && data.data.length > 0) {
                                        //scope.items = data.data;
                                        scope.selectItem = data.data;
                                        //scope.fmModel = scope.fmModel;
                                        if (data.data.length > 0)
                                            scope.parentId = data.data[0].parentId;
                                    }
                                }
                            });
                        }
                        break;
                    case "group":
                        service.getGroups({ filters: mabp.toArray(scope.filter), key: scope.fmModel }).then(function (data) {
                            scope.selectItem = data;
                            //scope.items = data[0].children;
                            //attr.formTitle = data[0].text;
                        });
                        break;
                    case "job":
                        bpmService.getSelectedJobUsers({ id: scope.fmModel }).then(function (data) {
                            scope.selectItem = [];
                            if (!!data && scope.fmModel != null) {
                                if (!!options && options.hideUser) {
                                    for (var i = 0; i < data.length; i++) {
                                        scope.selectItem.push({ id: data[i].id, text: data[i].jobName });
                                    }
                                } else {
                                    for (var i = 0; i < data.length; i++) {
                                        scope.selectItem.push({ id: data[i].id, text: data[i].jobName + "(" + data[i].jobUsers + ")" });
                                    }
                                }
                            }
                        });
                        break;
                    case "joblevel":
                        service.getJobLevelEnumNameByValue({ id: scope.fmModel }).then(function (data) {
                            data.id = data.value;
                            data.text = data.value + ' ' + data.name;
                            data.value = data.value;
                            scope.selectItem = [data];
                        });
                        break;
                    default:
                }
            }
        },
        //加载默认的Watch项
        setDefaultWatch: function (attr, scope, element, isTrue) {
            scope.$watch("fmNormal", function () {
                //页面状态
                if (!!attr.pageState) {
                    switch ("" + attr.pageState) {
                        case "3": //查看
                            scope.state = "readonly";
                            return;
                        default:
                    }
                }
                if (scope.fmNormal === undefined) return;
                if (scope.fmNormal) scope.state = "normal";
                if (!!scope.updateState) scope.updateState();
                if (!!scope.dataUpdate) scope.dataUpdate();
            });
            scope.$watch("fmDisabled", function () {
                //页面状态
                if (!!attr.pageState) {
                    switch ("" + attr.pageState) {
                        case "3": //查看
                            scope.state = "readonly";
                            return;
                        default:
                    }
                }
                if (scope.fmDisabled === undefined) return;
                if (scope.fmDisabled) scope.state = "disabled";
                else if (scope.fmNormal === undefined && !scope.fmReadonly && !scope.fmDisabled) scope.state = attr.state || scope.pageState;
                if (!!scope.updateState) scope.updateState();
                if (!!scope.dataUpdate) scope.dataUpdate();
            });
            scope.$watch("fmReadonly", function () {
                //页面状态
                if (!!attr.pageState) {
                    switch ("" + attr.pageState) {
                        case "3": //查看
                            scope.state = "readonly";
                            return;
                        default:
                    }
                }
                if (scope.fmReadonly === undefined) return;
                if (scope.fmReadonly) scope.state = "readonly";
                else if (scope.fmNormal === undefined && !scope.fmReadonly && !scope.fmDisabled) scope.state = attr.state || scope.pageState;
                if (!!scope.updateState) scope.updateState();
                if (!!scope.dataUpdate) scope.dataUpdate();
            });
            scope.$watch("fmHide", function () {
                //页面状态
                if (!!attr.pageState) {
                    switch ("" + attr.pageState) {
                        case "3": //查看
                            scope.state = "readonly";
                            return;
                        default:
                    }
                }
                if (scope.fmHide === undefined) return;
                if (scope.fmHide) scope.state = "hide";
                else if (scope.fmNormal === undefined && !scope.fmReadonly && !scope.fmDisabled) scope.state = attr.state || scope.pageState;
                if (!!scope.updateState) scope.updateState();
                if (!!scope.dataUpdate) scope.dataUpdate();
            });
            scope.$watch('fmRequired', function () {
                if (scope.fmRequired === undefined) return;
                if (!!scope.fmRequired)
                    element.attr("required", "required");
                else
                    element.removeAttr("required");
                if (!!scope.updateState) scope.updateState();
                if (!!scope.dataUpdate) scope.dataUpdate();
            });
        },
        getView: function (datacode, filter, service, func) {
            service.getViewTable({ code: datacode, filters: mabp.toArray(filter) }).then(function (data) {
                if (!!data) {
                    if (func) func(data);
                }
            });
        },
        getBasicdata: function (datacode, filter, service, func) {
            service.getBasicData({ code: datacode, filters: mabp.toArray(filter) }).then(function (data) {
                if (!!data) {
                    if (func) func(data);
                }
            });
        },
        getGroupTree: function (filter, service, func) {
            service.getSelectedGroupTree({ id: (!!filter && !!filter.id) ? filter.id : "", areaCode: (!!filter && !!filter.areaCode) ? filter.areaCode : "" }).then(function (data) {
                if (!!data) {
                    if (func) func(data);
                }
            });
        },
        getTreeData: function (tree, fmModel, attr) {
            var getTreeData = function (tree) {
                if (!!tree) {
                    for (var i = 0; i < tree.length; i++) {
                        if (_ids.indexOf(tree[i][attr.valueMember]) >= 0) {
                            _selectItem.push(tree[i]);
                        }
                        getTreeData(tree[i].children);
                    }
                }
            }
            var _ids = fmModel.split(",");
            var _selectItem = [];
            getTreeData(tree);
            return _selectItem;
        },
        getJobLevelEnumNameByValue: function (service, fmModel, func) {
            service.getJobLevelEnumNameByValue({ id: fmModel }).then(function (data) {
                if (!!data) {
                    data.id = data.value;
                    data.text = data.name;
                    if (func) func(data);
                }
            });
        }
    }

    return service;
})