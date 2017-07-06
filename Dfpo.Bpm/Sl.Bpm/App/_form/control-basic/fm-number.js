_shared.directive('fmNumber', ['fmTool', '$timeout', function (fmTool, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: function (elem, attr) {
            //定义控件名称
            attr.$ctrlType = 'fm-number';
            fmTool.textInit(attr);
            var _validate = fmTool.setValidate(attr); 
            if (!attr.name) {
                attr.name = attr.fmModel.toString().substring(attr.fmModel.lastIndexOf(".") + 1);
            }
            return '<div field-name="{{fieldName}}" fm-model="' + attr.fmModel + '" title="{{ shadeText }}" class="input-sm fm-text form-control ' + (attr.cny != undefined ? 'text-align-right' : '') + '" ng-class="state" ng-mousedown="event_textboxClick($event)" ng-keydown="event_textBoxKeyDown($event)">' +
                        '<input string-to-number ' + (!!attr.name ? ('name="' + attr.name + '"') : '') + ' ' + _validate.join(' ') + ' placeholder="{{fmPlaceholder}}" class="fm-text-input validate" ng-readonly="state==\'readonly\'" ng-disabled="state==\'disabled\'" type="text" ng-model="fmModel" ng-change="event_changeTxt($event)" ng-focus="event_textFocus($event)" ng-blur="event_textBlur($event)" ng-keypress="event_textBoxKeyPress($event)" autocomplete="off" ma-dynamic-element />' +
                        '<label ng-hide="!hasShadeText()" class="fm-text-shadetext">{{ shadeText }}</label>' + //readonly时作为主要显示文本，其他状态下为遮罩层
                        '<div class="fm-text-tool">' +
                            '<i class="textbox_unit" ng-hide="{{getUnit()==\'\'}}">{{getUnit()}}</i>' +
                            '<i class="fm-text-tool-clear icon-times" ng-hide="(!iClear) || (state!=\'normal\')" ng-mousedown="clearText($event)"></i>' +
                        '</div>' +
                        '<div class="option" title="" style=""><div class="option-item"><ul>' +
                        '<li ng-class="{\'active\':item==itemText}" ng-repeat="item in items | filter: findText" style="" ng-click="selectItem($event, item)" ng-mouseover="event_selectItemMouseOver($event,item)">{{item}}</li>' +
                        '</ul></div></div>' +
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
            callbackFunc: '&',
            fmBlur: '&'
        },
        link: function (scope, element, attr) {
            scope.textControl = element.find("input");
            scope.fieldName = attr.fieldName;
            scope.fmPlaceholder = attr.fmPlaceholder;
            scope.historyValue = "";
            scope.iClear = scope.iClear || (attr.iClear != undefined && attr.iClear != "false") && true;
            fmTool.setScopeState(scope, attr);

            scope.textControl.on('input', function (event) {
            }); 

            //获取遮罩文本
            scope.setShadeText = function () {
                if (scope.fmModel != null) {
                    if (!!attr.formatStr) scope.shadeText = attr.formatStr.fill(scope.fmModel);
                    else if (!!attr.formatFunc) scope.shadeText = attr.formatFunc(scope.fmModel);
                } else {
                        scope.shadeText = "";
                }
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
            scope.$watch('fmModel', function(newV, oldV) {
                    scope.setShadeText();
            });

            //快速选择项
            scope.selectItem = function (event, item, index) {
                scope.fmModel = item;
                scope.itemText = "";
                element.removeClass("open");
                event.stopPropagation();
            }
            scope.event_textBoxKeyPress = function (event) {
                switch (event.charCode) {
                    case 45:
                        if (event.target.value.indexOf("-") > 0 || event.target.selectionStart != 0) {
                            event.originalEvent.returnValue = false;
                        }
                        break;
                    case 46:
                        if (attr.scale > 0) {
                            if (event.target.value.indexOf(".") > 0 || event.target.selectionStart == 0) {
                                event.originalEvent.returnValue = false;
                            }
                        } else {
                            event.originalEvent.returnValue = false;
                        }
                        break;
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
                        var defaultNumLength = attr.NumLength;
                        var pointIndex = event.target.value.indexOf(".");
                        if (pointIndex >= 0 && event.target.value.indexOf("-") >= 0) defaultNumLength++;
                        if (pointIndex > 0 && event.target.value.substring(pointIndex).length > 6 && event.target.selectionStart > pointIndex && event.target.selectionStart == event.target.selectionEnd) {
                            event.originalEvent.returnValue = false;
                        } else {
                            if (pointIndex == -1) {
                                if (event.target.value.substring(pointIndex).length >= defaultNumLength && event.target.selectionStart == event.target.selectionEnd) {
                                    event.originalEvent.returnValue = false;
                                }
                            } else {
                                if (event.target.value.substring(0, pointIndex).length >= defaultNumLength && event.target.selectionStart <= pointIndex && event.target.selectionStart == event.target.selectionEnd) {
                                    event.originalEvent.returnValue = false;
                                }
                            }
                        }
                        break;
                    default:
                        event.originalEvent.returnValue = false;
                } 
            }

            //修改文本的值
            scope.event_textBoxKeyDown = function (event) {
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
                if (!new RegExp(attr.fmPattern).test(scope.textControl.val().replace(",",""))) {
                    scope.fmModel = scope.historyValue;
                } else {
                    scope.historyValue = scope.fmModel.replace(",", "");
                    scope.fmModel = scope.fmModel.replace(",", "");
                }
                $timeout(function () {
                    scope.callbackFunc();
                }, 0);
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
                $timeout(function () {
                    element.children("input").focus();
                }, 0);
                event.stopPropagation();
            }
        }
    }
}])
.directive('stringToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                return parseFloat(value, 10);
            });
        }
    }
})


