_shared.directive('fmText', ['fmTool', '$timeout', function (fmTool, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: function (elem, attr) {
            fmTool.textInit(attr);
            var _validate = fmTool.setValidate(attr);
            return '<div field-name="{{fieldName}}" field-text="{{getShadeText()}}" class="input-sm fm-text" ng-class="state" ng-mousedown="event_textboxClick($event)" ng-keydown="event_textBoxKeyDown($event)">' +
                        '<input ' + _validate.join(' ') + ' placeholder="{{fmPlaceholder}}" class="fm-text-input validate" ng-readonly="state==\'readonly\'" ng-disabled="state==\'disabled\'" type="text" ng-model="fmModel" ng-change="event_changeTxt()" ng-focus="event_textFocus($event)" ng-blur="event_textBlur($event)" autocomplete="off" ma-dynamic-element />' +
                        '<label ng-show="(' + (!!attr.formatStr || !!attr.formatFunc) + ' && state!=\'readonly\' && state!=\'disabled\') || state==\'readonly\' || state==\'disabled\'" class="fm-text-shadetext">{{getShadeText()}}</label>' + //readonly时作为主要显示文本，其他状态下为遮罩层
                        '<div class="fm-text-tool">' +
                            '<i class="textbox_unit" ng-hide="{{getUnit()==\'\'}}">{{getUnit()}}</i>' +
                            '<i class="fm-text-tool-clear icon-times" ng-hide="!iClear || state!=\'normal\'" ng-mousedown="clearText($event)"></i>' +
                        '</div>' +
                        '<div class="option" title="" style=""><div class="option-item"><ul>' +
                        '<li ng-class="{\'active\':item==itemText}" ng-repeat="item in items | filter: findText" style="" ng-mousedown="selectItem($event, item)" ng-mouseover="event_selectItemMouseOver($event,item)">{{::item}}</li>' +
                        '</ul></div></div>{{execount}}' +
                    '</div>';
        },
        scope: {
            fmModel: '=',
            toolHtml: '=',
            fmUnit: '=',
            items: '=',
            fmNormal: '=',
            fmRequired: '=',
            fmDisabled: '=',
            fmReadonly: '=',
            fmBlur: '&',
            nodecode: '=',
            jobcode: '='
        },
        link: function (scope, element, attr) {
            scope.fmPlaceholder = attr.fmPlaceholder;
            scope.fieldName = attr.fieldName;
            scope.unit = scope.unit || attr.unit;
            scope.iClear = scope.iClear || (attr.iClear != undefined && attr.iClear != "false") && true;
            if (!!attr.iClear && attr.iClear != "false") scope.iClear = true;

            scope.keydown = scope.keydown || (attr.keydown != undefined && attr.keydown != "false") && true;

            fmTool.setScopeState(scope, attr);

            //获取遮罩文本
            scope.getShadeText = function () {
                if (!!scope.fmModel) {
                    if (!!attr.formatStr) return attr.formatStr.fill(scope.fmModel);
                    else if (!!attr.formatFunc) return attr.formatFunc(scope.fmModel);
                    else return scope.fmModel;
                } else return "";
            }

            //是否有遮罩文本
            scope.hasShadeText = function () {
                return ((!!attr.formatStr || !!attr.formatFunc) && scope.state != "readonly" && scope.state != "disabled") || scope.state == "readonly" || scope.state == "disabled";
            }

            scope.getUnit = function () {
                return scope.fmUnit || attr.unit || "";
            }

            scope.findText = function (item) {
                if (!scope.fmModel || item.indexOf(scope.fmModel) >= 0) return true;
                else return false;
            }

            fmTool.setDefaultWatch(attr, scope, element);

            //用鼠标选择项
            scope.event_selectItemMouseOver = function (event, item) {
                scope.itemText = item;
            }

            //快速选择项
            scope.selectItem = function (event, item, index) {
                scope.fmModel = item;
                scope.itemText = "";
                element.removeClass("open");
                event.stopPropagation();
            }

            //修改文本的值
            scope.event_textBoxKeyDown = function (event) {

                if (!!scope.keydown) {
                    if (event.keyCode == 13) {
                        scope.event_textBlur();
                    }
                }

                //如果是账户类型 只允许属于数字，不允许输入空格和字符
                if (attr.creditcard != undefined && attr.creditcard !== "false") {
                    //var userAgent = navigator.userAgent;
                    var isTrue = false;
                    switch (event.key) {
                        case "0":
                        case "1":
                        case "2":
                        case "3":
                        case "4":
                        case "5":
                        case "6":
                        case "7":
                        case "8":
                        case "9":
                        case "Backspace":
                        case "ArrowLeft":
                        case "ArrowRight":
                        case "Delete":
                            break;
                        default:
                            isTrue = true;
                            //event.originalEvent.returnValue = false;
                    }
                    if (isTrue) {
                        switch (event.keyCode) {
                            case 8:
                            case 37:
                            case 39:
                            case 46:
                            case 48:
                            case 49:
                            case 50:
                            case 51:
                            case 52:
                            case 53:
                            case 54:
                            case 55:
                            case 56:
                            case 57:
                                break;
                            default:
                                //event.originalEvent.returnValue = false;
                                break;
                        }
                    }
                }

                if (!!scope.items && scope.items.length > 0) {
                    var index = scope.getIndex(scope.itemText);
                    var arrs = scope.getFindItems();
                    if (element.hasClass("open")) {
                        switch (event.keyCode) {
                            case 38:
                                if (index > 0) {
                                    index--;
                                    scope.itemText = arrs[index];
                                } else {
                                    index = arrs.length - 1;
                                    scope.itemText = arrs[arrs.length - 1];
                                }
                                break;
                            case 40:
                                if (index < arrs.length - 1) {
                                    index++;
                                    scope.itemText = arrs[index];
                                } else {
                                    index = 0;
                                    scope.itemText = arrs[0];
                                }
                                break;
                            case 13:
                                scope.fmModel = scope.itemText;
                                element.removeClass("open");
                                break;
                            case 8:
                                if (!scope.fmModel) {
                                    element.removeClass("open");
                                    scope.itemText = "";
                                    return;
                                }
                            default:
                                if (arrs.length == 0) {
                                    element.removeClass("open");
                                }
                        }
                    } else {
                        switch (event.keyCode) {
                            case 8:
                                if (!scope.fmModel) {
                                    element.removeClass("open");
                                    scope.itemText = "";
                                    return;
                                }
                            case 40:
                            case 13:
                                if (arrs.length > 0) {
                                    element.addClass("open");
                                }
                                break;
                            default:
                                if (arrs.length > 0) {
                                    element.removeClass("open");
                                    scope.itemText = "";
                                }
                        }
                    }
                }
            }

            scope.getIndex = function (txt) {
                var _items = scope.getFindItems();
                if (!_items) return -1;
                for (var i = 0; i < _items.length; i++) {
                    if (txt == _items[i]) return i;
                }
                return -1;
            }

            scope.getFindItems = function () {
                var _items = [];
                if (!!scope.items && scope.items.length > 0) {
                    for (var i = 0; i < scope.items.length; i++) {
                        if (!scope.fmModel || scope.items[i].indexOf(scope.fmModel) >= 0) {
                            _items.push(scope.items[i]);
                        }
                    }
                }
                return _items;
            }

            //点击文本框
            scope.event_textboxClick = function (event) {
                event.stopPropagation();
            }
            //文本发生改变
            scope.event_changeTxt = function (event) {

            }

            scope.itemText = "";
            //document的点击事件（缩回下拉框
            scope.documentClick = function (event) {
                //绑定后解绑事件
                angular.element(document).off('mousedown', scope.documentClick);
                //重点是用$timeout保证变量同步修改
                $timeout(function () {
                    element.removeClass("open");
                }, 0);
            }

            //获得焦点
            scope.event_textFocus = function () {
                element.addClass("focus");
                angular.element(document).on('mousedown', scope.documentClick);
            }

            //失去焦点
            scope.event_textBlur = function () {
                scope.fmBlur({ item: scope.$parent.item || null });
                element.removeClass("focus");
            }

            /*清空文本*/
            scope.clearText = function (event) {
                scope.fmModel = "";
            }


            scope.$watch('fmModel', function () {
                if (attr.creditcard != undefined && attr.creditcard !== "false") {
                    scope.fmModel = scope.trim(scope.fmModel, "g");
                }
            });

            /*清空文本所有空格*/
            scope.trim = function (str, isGlobal) {
                if (!str) return str;
                var result;
                result = str.replace(/(^\s+)|(\s+$)/g, "");
                if (isGlobal.toLowerCase() == "g") {
                    result = result.replace(/\s/g, "");
                }
                return result;
            }

        }
    }
}])



