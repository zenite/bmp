_shared.directive('fmDatetime', ['fmTool', '$timeout', function (fmTool, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: function (elem, attr) {
            //定义控件名称
            attr.$ctrlType = 'fm-datetime';
            fmTool.textInit(attr);
            var _validate = fmTool.setValidate(attr);
            //if (attr.required !== undefined) attr.required = true;
            if (!attr.name) {
                attr.name = attr.fmModel.toString().substring(attr.fmModel.lastIndexOf(".") + 1);
            }
            return '<div field-name="{{fieldName}}" fm-model="' + attr.fmModel + '" title="{{getShadeText()}}" class="input-sm fm-text form-control" ng-class="state" ng-mousedown="event_textboxClick($event)">' +
                        '<input type="datetime" date-time ' + (!!attr.name ? ('name="' + attr.name + '"') : '') + ' ' + _validate.join(' ') + ' placeholder="{{fmPlaceholder}}" class="fm-text-input validate" ng-blur="event_blur($event)" ng-readonly="state==\'readonly\'" ng-disabled="state==\'disabled\'" type="text"/>' +
                        '<label class="fm-text-shadetext">{{ shadeText }}</label>' +
                        '<div class="fm-text-tool">' +
                            '<i class="textbox_unit" ng-hide="!unit">{{unit}}</i>' +
                            '<i class="fm-text-tool-clear icon-times" ng-hide="!iClear || state!=\'normal\'" ng-mousedown="clearText($event)"></i>' +
                        '</div>' +
                    '</div>';
        },
        scope: {
            fmModel: '=',
            unit: '=',
            fmNormal: '=',
            fmRequired: '=',
            fmDisabled: '=',
            fmReadonly: '=',
            fmBlur: '&'
        },
        link: function (scope, element, attr) {
            var dateInput = element.find("input");
            if (attr.view == "hours") {
                dateInput.datetimepicker({
                    language: app.language,
                    weekStart: 0,
                    todayBtn: 0,
                    autoclose: 1,
                    todayHighlight: 1,
                    startView: 1,
                    minView: 0,
                    maxView: 1,
                    forceParse: 0,
                    format: 'hh:ii'
                });
            } else {
                dateInput.datetimepicker({
                    language: app.language,
                    weekStart: 1,
                    todayBtn: 1,
                    autoclose: 1,
                    todayHighlight: 1,
                    startView: 2,
                    minView: 2,
                    forceParse: 0,
                    format: "yyyy-mm-dd"
                });
            }
            dateInput.on('changeDatetime', function (event) {
                if (attr.view === "hours") {
                    scope.fmModel = _$.newDate(event.date).format('hh:mm');
                } else {
                    scope.fmModel = _$.newDate(event.date).format('yyyy-MM-dd');
                }
                scope.shadeText = scope.fmModel;
                scope.$apply();
                scope.fmBlur();
                scope.$apply();
            });
            var dateCtrl = $(dateInput).data('datetimepicker');


            scope.fmPlaceholder = attr.fmPlaceholder;
            scope.format = attr.format;
            scope.fieldName = attr.fieldName;
            scope.unit = scope.unit || attr.unit;
            scope.iClear = scope.iClear || (attr.iClear != undefined && attr.iClear != "false") && true;
            if (!!attr.iClear && attr.iClear != "false") scope.iClear = true;

            fmTool.setScopeState(scope, attr);


            scope.findText = function (item) {
                if (!scope.fmModel || item.indexOf(scope.fmModel) >= 0) return true;
                else return false;
            }

            fmTool.setDefaultWatch(attr, scope, element);
            scope.event_blur = function(event) {
                var inputDom = $(event.target);
                if (attr.view === "hours") {
                    try {
                        if (!/^(20|21|22|23|[0-1]?\d):[0-5]?\d$/.test(inputDom.val())) {
                            inputDom.val('');
                            scope.fmModel = "";
                        } else {
                            scope.fmModel = inputDom.val();
                        }
                    } catch (e) {
                        inputDom.val('');
                    }
                } else if (attr.view === "date") {
                    var newDate = _$.newDate(inputDom.val());
                    if (newDate == 'Invalid Date') {
                        scope.fmModel = "";
                    } else {
                        scope.fmModel = inputDom.val();
                    }
                }
                scope.fmBlur();
            }

            scope.$watch("fmModel", function (newV, oldV) {

                if (!scope.fmModel) scope.fmModel = "";
                if (scope.fmModel == "") {
                    dateInput.val(scope.fmModel);
                    scope.shadeText = scope.fmModel;
                    return;
                }
                var formatedDate = scope.fmModel;
                if (attr.view === "hours") {
                    formatedDate = newV = "2017-1-1 " + newV;
                    scope.fmModel = _$.newDate(newV).format('hh:mm');
                } else {
                    scope.fmModel = _$.newDate(newV).format('yyyy-MM-dd');
                }
                dateInput.val(scope.fmModel);
                scope.shadeText = scope.fmModel;
                dateCtrl.setDate(_$.newDate(formatedDate));
            });
            /*清空文本*/
            scope.clearText = function (event) {
                scope.fmModel = '';
            }
        }
    }
}])



