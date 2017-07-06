_shared
/*表单组标题指令*/
.directive('fmFormTitle', [
        'fmTool', '$filter', 'mabp.app.bpm', 'mabp.app.permission', 'appSession', '$timeout', function (fmTool, $filter, service, pService, session, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                template: function (elem, attr) {
                    return '<div class="row">' +
                                '<div class="col-xs-12" style="text-align:center;"><h1 class="form-large-title">{{title}}</h1></div>' +
                                '<div class="col-xs-12" style="text-align:center;">' +
                                    '<h2 class="form-small-title"><br ng-if="!!titleCompanyName" />{{subTitle}}</h2></div>' +
                                '<div class="col-xs-12 control-label" style="margin-bottom: 3px; text-align: right;">' +
                                    '<div id="div_comspan" style="float:left;display:none;"><span ng-if="selectCompany" class="required" >{{ "UsedInCompany" | translate }}</span>' +
                                    '<select fm-model="' + attr.fmModel + '" ng-if="selectCompany" field-name="{{ \'UsedInCompany\' | translate }}" ng-model="fmModel" required ng-change="event_selectItem()" ng-options="item.areaCode as item.text for item in items" style="width: 235px; display:none; padding:0;line-height:auto; height:auto;margin: 0 0px 0 5px;margin: 0px 0px 0px 15px;border-radius: 0px;" class="form-control" ng-class="state">' +
                                        '<option value=""></option>' +
                                    '</select></div>' +
                                    '<span fm-bind="$parent.base.$pageLang.ApplicationTime" style="display: -webkit-inline-box;"></span>：' +
                                    //'<span ng-bind="applyDate" ng-if="date"></span>' +
                                    '<span fm-bind="applyDate" ng-if="!date" style="display: -webkit-inline-box;"></span>&nbsp;&nbsp;&nbsp;' +
                                    '<span fm-bind="$parent.base.$pageLang.Sn" style="display: -webkit-inline-box;"></span>：' +
                                    //'<span ng-bind="applySnNumber" ng-if="attr.snNumber"></span>&nbsp;&nbsp;&nbsp;' +
                                    '<span fm-bind="applySnNumber" ng-if="!attr.snNumber" style="display: -webkit-inline-box;"></span>' +
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
                    //append()
                    var base = scope.$parent.base;
                    scope.selectCompany = base.areaEnable;
                    scope.applySnNumber = attr.snNumber || base.$pageLang.AutomaticGenerationSystem;;
                    var date = $filter('date')(attr.applyDate, 'yyyy-MM-dd');
                    scope.applyDate = date || base.$pageLang.AutomaticGenerationSystem;;
                    fmTool.setScopeState(scope, attr);
                    var userArea = base.applicant.areaCode;
                    if (!!base.taskId || !!base.draftId) {
                        userArea = base.areaCode;
                    }
                    //是否启用 且为第一次打开， 则组成下拉信息。
                    if (scope.selectCompany && !base.taskId) {
                        $timeout(function () {

                            scope.items = base.areaCodeList;
                            if (scope.items.length != 1 && scope.state != "readonly" && scope.state != "disabled") {
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
                                scope.appendTitle();
                                if (scope.state == "normal") scope.callbackFunc(selectItem);
                            });
                            //默认一个公司 则直接使用默认公司
                            if (scope.items.length == 1) {
                                base.areaCode = scope.items[0].areaCode;
                            } else if (scope.items.length > 1) {
                                var any = _.filter(scope.items, function (item) {
                                    return item.areaCode === userArea;
                                });
                                //若发起人能发起的公司中 包含自己所在公司则默认设为自己的公司
                                if (any != null && any.length === 1) {
                                    base.areaCode = userArea;
                                }
                            }
                        });

                    } else {
                        if (!base.taskId) { //只有在流程尚未发起的时候才取申请人的areaCode
                            base.areaCode = userArea;
                        }
                        if (!!base.areaCode) {
                            service.getGroupExtensionByAreaCode({ id: base.areaCode, displayLanguages: base.displayLanguages }).then(function (data) {
                                if (!data) return;
                                scope.titleCompanyName = _.find(data, { displayLanguages: base.displayLanguages }).name;
                                scope.appendTitle();
                            });
                        }
                    }

                    scope.appendTitle = function () {
                        if (!scope.titleCompanyName) {
                            element.find('h2').html(scope.subTitle);
                        } else {
                            element.find('h2').html(scope.titleCompanyName + "<br ng-if='!!titleCompanyName' />" + scope.subTitle);
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