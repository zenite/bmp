_shared
/*下拉列表指令*/
.directive("fmJobSelect", ['fmTool', '$timeout', 'dialog', 'mabp.app.module', 'mabp.app.bpm', function (fmTool, $timeout, dialog, service, bpmService) {
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
            return '<div fm-model="' + attr.fmModel + '" class="ma-data-select ' + (attr.ismulti ? 'multi' : 'single') + ' ' + attr.class + '" ng-class="state" ng-mousedown="openSelect($event)" ng-blur="event_Blur()">' +
                        (!!attr.placeholder ? '<div class="placeholder"  ng-class="{\'hide\':!!fmModel}">' + attr.placeholder + '</div>' : '') +
                        '<div class="select-data-value">' +
                            '<div class="item" style="witdh:auto;" ng-repeat="item in selectItem" ng-mousedown="event_removeSelectItem(item, $event)">{{item.text}}' + (attr.ismulti ? '' : '<i ng-hide="!iClear || state!=\'normal\'" class="icon-times remove" ng-mousedown="clear($event)"></i>') + '</div>' +
                            '<div class="item" ng-if="(!selectItem || selectItem.length == 0) && !!defaultModel">{{defaultModel}}</div>' +
                        '</div>' +
                        '<button class="btn btn-info select-data-button" type="button" ng-click="event_SelectData()" >{{\'Choose\' | translate}}</button>' +
                        '<input type="hidden" ' + (!!attr.name ? ('name="' + attr.name + '"') : '') + ' ' + _validate.join(' ') + ' ng-model="fmModel" />' +
                    '</div>';
        },
        scope: {
            fmModel: '=',
            /*只有在基础数据的时候才会使用，返回基础数据Value*/
            fmCode: '=',
            columns: '=',
            selectItem: '=',
            isOpen: '=',
            datacode: '=',
            fmRequired: '=',
            fmNormal: '=',
            fmDisabled: '=',
            fmReadonly: '=',
            filter: '=',
            //获取父类Id
            parentId: '=',
            defaultModel: '=',
            callbackFunc: '&',
            fmBlur: '&'
        },
        compile: function (tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, element, attr, ctrl) {
                },
                post: function postLink(scope, element, attr, ctrl) {
                    scope.datatype = "job";
                    scope.iClear = (scope.iClear && scope.iClear !== false) || (attr.iClear != undefined && attr.iClear != "false") && true;
                    //设置单选/多选
                    if (!!attr.ismulti && attr.ismulti !== "false" && scope.ismulti === undefined) {
                        scope.ismulti = true;
                    } else scope.ismulti = false;
                    //设置是否显示用户名
                    scope.hideuser = (scope.hideuser && scope.hideuser !== false) || (attr.hideuser != undefined && attr.hideuser != "false") && true;
                    //设置可空
                    if (attr.isnull == undefined) isnull = true;
                    else isnull = attr.isnull != undefined && attr.isnull != "false";

                    fmTool.setScopeState(scope, attr);

                    scope.$watch("filter", function (newvalue, oldvalue) {
                        if (!!scope.filter && scope.state == "normal") {
                            fmTool.setDataSource(scope, attr, service, bpmService);
                        }
                    }, true);

                    //fmTool.setDefaultWatch(scope, element);

                    var option = element.find(".option");
                    scope.selectItem = [];
                    scope.isShow = false;

                    fmTool.setDefaultWatch(attr, scope, element);

                    scope.$watch("selectItem", function () {
                        scope.fmBlur({ item: scope.$parent.item || null });
                        scope.callbackFunc({ selectItem: scope.selectItem });
                    }, true);

                    //绑定值变化 更新显示值
                    scope.$watch("fmModel", function (newvalue, oldvalue) {
                        fmTool.getOne(scope, attr, service, bpmService, { hideUser: scope.hideuser });
                    });

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
                                event.stopPropagation();
                            } else {
                                scope.fmModel = item[attr.valueMember];
                            }
                            console.info(item[attr.displayMember], item[attr.valueMember], item[attr.codeMember]);
                            element.focus();
                        }
                    }

                    scope.event_SelectData = function () {
                        if (scope.state == "normal") {
                            dialog.open(_shared.dialogs['fmJobSelectDialog'], { data: scope.selectItem, datatype: "source", filter: scope.filter, selectData: scope.fmModel, column: scope.columns, title: attr.placeholder, ismulti: scope.ismulti, valueMember: attr.valueMember, hideUser: scope.hideuser }).then(function (data) {
                                if (data !== null) {
                                    scope.fmModel = data;
                                }
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
}])