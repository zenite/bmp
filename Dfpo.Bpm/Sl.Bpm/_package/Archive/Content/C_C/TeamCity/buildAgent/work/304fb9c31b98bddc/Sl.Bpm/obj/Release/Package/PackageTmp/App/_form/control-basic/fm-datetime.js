_shared.directive('fmDatetime', ['fmTool', '$timeout', function (fmTool, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: function (elem, attr) {
            fmTool.textInit(attr);
            var _validate = fmTool.setValidate(attr);
            //if (attr.required !== undefined) attr.required = true;
            if (!attr.name) {
                attr.name = attr.fmModel.toString().substring(attr.fmModel.lastIndexOf(".") + 1);
            }
            return '<div field-name="{{fieldName}}" fm-model="' + attr.fmModel + '" title="{{getShadeText()}}" class="input-sm fm-text form-control" ng-class="state" ng-mousedown="event_textboxClick($event)">' +
                        '<input type="datetime" date-time auto-close="true" autocomplete="on" ' + (!!attr.name ? ('name="' + attr.name + '"') : '') + ' ' + _validate.join(' ') + ' placeholder="{{fmPlaceholder}}" class="fm-text-input validate" ng-readonly="state==\'readonly\'" ng-disabled="state==\'disabled\'" type="text" ng-model="fmModel" ng-change="event_changeTxt()" ng-focus="event_textFocus($event)" ng-blur="event_textBlur($event)" ng-keydown="event_KeyDown($event)" autocomplete="off" ma-dynamic-element />' +
                        '<label class="fm-text-shadetext">{{getShadeText()}}</label>' +
                        '<div class="fm-text-tool">' +
                            '<i class="textbox_unit" ng-hide="!unit">{{unit}}</i>' +
                            '<i class="fm-text-tool-clear icon-times" ng-hide="!iClear || state!=\'normal\'" ng-mousedown="clearText($event)"></i>' +
                        '</div>' +
                    '</div>';
        },
        scope: {
            fmModel: '=',
            toolHtml: '=',
            unit: '=',
            fmNormal: '=',
            fmRequired: '=',
            fmDisabled: '=', 
            fmReadonly: '=',
            fmBlur: '&'
        },
        link: function (scope, element, attr) {
            scope.textControl = element.find("input");
            scope.fmPlaceholder = attr.fmPlaceholder;
            scope.format = attr.format;
            scope.fieldName = attr.fieldName;
            scope.unit = scope.unit || attr.unit;
            scope.iClear = scope.iClear || (attr.iClear != undefined && attr.iClear != "false") && true;
            if (!!attr.iClear && attr.iClear != "false") scope.iClear = true;

            fmTool.setScopeState(scope, attr);

            //获取遮罩文本
            scope.getShadeText = function () {
                if (scope.fmModel == undefined) return "";
                if (!moment.isMoment(scope.fmModel)) {
                    if (/^\d{1,2}([:-]|\s)\d{1,2}$/.test(scope.fmModel)) {
                        return moment("2000-01-01 " + scope.fmModel).format(attr.formatStr);
                    } else {
                        return moment(scope.fmModel).format(attr.formatStr);
                    }
                }
                return scope.fmModel.format(attr.formatStr);
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

            scope.$watch("fmModel", function () {
                if (!scope.fmModel) scope.fmModel = "";
                scope.fmModel = scope.fmModel.replace(/T/g, " ");
                scope.$broadcast('clearDate', scope.fmModel);
            });

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
            scope.event_changeTxt = function (event) { }

            //获得焦点
            scope.event_textFocus = function () {
                element.addClass("focus");
            }

            //失去焦点
            scope.event_textBlur = function () {
                var resultModel = "";
                if (isKeyDown) {
                    console.log(scope.textControl.val());
                    if (scope.textControl.val() == "") {
                        resultModel = "";
                    } else if (/^\d{1,2}([:-]|\s)\d{1,2}$/.test(scope.textControl.val())) {
                        if (moment("2000-01-01 " + scope.textControl.val()).format(attr.format) != "") {
                            resultModel = moment("2000-01-01 " + scope.textControl.val()).format(attr.format);
                        } else {
                            resultModel = scope.fmModel;
                        }
                    } else {
                        if (moment(scope.textControl.val()).format(attr.format) != "") {
                            resultModel = moment(scope.textControl.val()).format(attr.format);
                        } else {
                            resultModel = scope.fmModel;
                        }
                    }
                } else {
                    resultModel = scope.fmModel;
                }
                scope.$broadcast('clearDate', resultModel);
                isKeyDown = false;
                scope.fmBlur({ item: scope.$parent.item || null });
                element.removeClass("focus");
            }
            var isKeyDown = false;
            scope.event_KeyDown = function (event) {
                isKeyDown = true;
            }

            scope.$on('maSetDate', function (event, date, view) {
                scope.fmModel = date;
            });

            /*清空文本*/
            scope.clearText = function (event) {
                if (attr.required != undefined && attr.required != "false") scope.fmModel = new Date();
                else scope.fmModel = "";
                scope.$broadcast('clearDate', scope.fmModel);
                $timeout(function () {
                    element.children("input").focus();
                }, 0);
                event.stopPropagation();
            }
        }
    }
}])



