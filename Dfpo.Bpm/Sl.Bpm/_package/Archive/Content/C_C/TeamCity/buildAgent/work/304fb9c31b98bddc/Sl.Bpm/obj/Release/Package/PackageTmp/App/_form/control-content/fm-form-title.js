_shared
/*表单组标题指令*/
.directive('fmFormTitle', [
        'fmTool', '$filter', 'mabp.app.module', function (fmTool, $filter, service) {
            return {
                restrict: 'E',
                replace: true,
                template: function (elem, attr) {
                    return '<div class="row">' +
                                '<div class="col-xs-12" style="text-align:center;"><h1 class="form-large-title">{{title}}</h1></div>' +
                                '<div class="col-xs-12" style="text-align:center;"><h2 class="form-small-title">{{titleCompanyName}}<br ng-if="!!titleCompanyName" />{{subTitle}}</h2></div>' +
                                '<div class="col-xs-12 control-label" style="margin-bottom: 3px;">' +
                                    '<div id="div_comspan" style="float:left;display:none;"><span ng-if="selectCompany" class="required">所属公司</span>' +
                                    '<select fm-model="' + attr.fmModel + '" ng-if="selectCompany" field-name="所属公司" ng-model="fmModel" required ng-change="event_selectItem()" ng-options="item.areaCode as item.text for item in items" style="width: 235px; display:none; padding:0;line-height:auto; height:auto;margin: 0 0px 0 5px;margin: 0px 0px 0px 15px;border-radius: 0px;" class="form-control" ng-class="state">' +
                                        '<option value=""></option>' +
                                    '</select></div>' +
                                    '<span>{{ \'Sn\' | translate }}： </span>' +
                                    '<span ng-bind="applySnNumber"></span>&nbsp;&nbsp;&nbsp;' +
                                    '<span>{{ \'ApplicationTime\' | translate }}： </span>' +
                                    '<span ng-bind="applyDate"></span>' +
                                '</div>' +
                            '</div>';
                },
                scope: {
                    fmModel: '=',
                    subTitle: '=',
                    title: '=',
                    selectCompany: '=',
                    callbackFunc: '&'
                },
                link: function (scope, element, attr) {
                    scope.selectCompany = scope.$parent.base.areaEnable;
                    scope.applySnNumber = attr.snNumber || '系统自动生成';
                    var date = $filter('date')(attr.applyDate, 'yyyy-MM-dd HH:mm:ss');
                    scope.applyDate = date || '系统自动生成';

                    fmTool.setScopeState(scope, attr);

                    var userArea = scope.$parent.base.applicant.areaCode;
                    if (!!scope.$parent.base.taskId) {
                        userArea = scope.$parent.base.areaCode;
                    }
                    if (scope.selectCompany) {
                        service.getViewTable({ code: "GetAllCompany" }).then(function (data) {
                            if (!!data) {
                                var areas = scope.$parent.base.areaCodeList.split(',');
                                var coms = data.viewTable;
                                var usecoms = [];
                                for (var i = 0; i < coms.length; i++) {
                                    if (areas.indexOf(coms[i].areaCode) > -1)
                                        usecoms.push(coms[i]);
                                }

                                scope.items = usecoms;

                                if (scope.items.length > 1 && scope.state != "readonly" && scope.state != "disabled") {
                                    element.find("select").css("display", "inline");
                                    element.find("#div_comspan").css("display", "inline");
                                }

                                scope.$watch("fmModel", function (newvalue, oldvalue) {
                                    scope.titleCompanyName = "";
                                    var selectItem = [];
                                    if (newvalue) {
                                        for (var i = 0; i < scope.items.length; i++) {
                                            if (scope.items[i].areaCode == newvalue) {
                                                scope.titleCompanyName = scope.items[i].text;
                                                selectItem = scope.items[i];
                                            }
                                        }
                                    }
                                    if (scope.state == "normal") scope.callbackFunc(selectItem);
                                });
                                //默认一个公司
                                if (scope.items.length == 1) {
                                    scope.$parent.base.areaCode = scope.items[0].areaCode;
                                }
                                else if (scope.items.length == 0) {
                                    scope.$parent.base.areaCode = userArea;
                                }
                                else {
                                    scope.$parent.base.areaCode = userArea;
                                    //非总部不能修改
                                    if (userArea != "YFVIC") {
                                        element.find("select").css("display", "none");
                                        element.find("#div_comspan").css("display", "none");
                                    }
                                }
                                if (userArea == "YFVSX") {
                                    scope.$parent.base.areaCode = "YFVSX";
                                    element.find("select").prop("disabled", true);
                                }
                            }
                        });

                    }
                    else {
                        if (!scope.$parent.base.taskId) {//只有在流程尚未发起的时候才取申请人的areaCode
                            scope.$parent.base.areaCode = userArea;
                        }
                        if (!!scope.$parent.base.areaCode) {
                            service.getViewOne({ code: "GetAllCompany", filters: [{ name: "Id", value: scope.$parent.base.areaCode }], key: scope.$parent.base.areaCode }).then(function (val) {
                                scope.titleCompanyName = val.viewTable[0].text;
                            });
                        }
                    }

                    //选择节点事件
                    scope.event_selectItem = function (item, event) {
                        //判断是否为多选框
                        scope.fmModel = element.find("option:selected").val().split(':')[1];
                        element.focus();
                    }
                }
            }
        }
])