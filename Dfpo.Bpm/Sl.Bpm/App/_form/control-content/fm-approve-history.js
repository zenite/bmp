_shared
.directive('fmApproveHistory', [
    'mabp.app.task', 'workflowModuleTransfer', '$timeout', 'dialog', 'appSession',
    function (taskService, moduleTransfer, $timeout, dialog, session) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                taskId: '=',
                taskInfos: '=',
                isall: '=',  //是否默认展示全部
                approveHistory: '='
            },
            template: function (e, a) {
                return '<div class="row">' +
                            '<div class="form-group">' +
                                '<div class="col-xs-12" style="text-align: right; padding-right: 20px;margin-right: 10px;">' +
                                    '<button class="btn btn-sm btn-default" style="margin-right: 5px;" ng-click="showSkip()">' +
                                        '<span ng-if="!isSkip" class="ng-scope">{{ "ShowAllStep" | translate}}</span>' +
                                        '<span ng-if="isSkip" class="ng-scope">{{ "Hide" | translate}}</span>' +
                                    '</button>' +
                                     '<button class="btn btn-sm btn-default" ng-click="mailToAll()">' +
                                        '<span class="ng-scope">To All</span>' +
                                    '</button>' +
                                '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<div class="col-xs-12">' +
                                    '<table class="table datatable table-bordered table-condensed table-hover table-approve-history">' +
                                        '<thead>' +
                                            '<tr>' +
                                                '<th>{{ "ReceiveDate" | translate}}</th>' +
                                                '<th>{{ "CompletionTime" | translate}}</th>' +
                                                '<th>{{ "NodeName" | translate}}</th>' +
                                                '<th style="width:120px;">{{ "Handler" | translate}}</th>' +
                                                '<th style="width:80px;">{{ "Action" | translate}}</th>' +
                                                '<th>{{ "Memo" | translate}}</th>' +
                                                '<th style="width:110px;">{{ "Operation" | translate}}</th>' +
                                            ' </tr>' +
                                        '</thead>' +
                                        '<tbody>' +
                                            '<tr ng-repeat="i in taskInfos">' +
                                                '<td ng-if="i.recvTime == null">{{ "UnReceived" | translate}}</td>' +
                                                '<td ng-if="i.recvTime != null"><div class="overflow-singleline">{{i.recvTime | date : "yyyy-MM-dd HH:mm:ss"}}</div></td>' +
                                                '<td><div class="overflow-singleline">{{i.procTime | date : "yyyy-MM-dd HH:mm:ss"}}</div></td>' +
                                                '<td>{{i.wfdWorkflowNodeName}}</td>' +
                                                '<td>{{getProcer(i)}}</td>' +
                                                '<td style="width:80px;">' +
                                                    '<span ng-class="{true:\'text-success\',false:\'text-primary\'}[getAction(i.action)]">{{i.action}}' +
                                                '</td>' +
                                                '<td class="align-left">{{i.note}}</td>' +
                                                '<td>' +
//                                                    '<i class="icon icon-arrow-right cursor-pointer" ng-click="changeLogin(i)">切换账号</i>' +
//                                                    '<i ng-if="(i.type == 1 || i.type == 0) && (i.procStatus == 1 || i.procStatus == 2)" class="icon icon-history cursor-pointer" ng-click="backTask(i)"></i>' +
                                                    '<i ng-if="i.procStatus != null && i.type != 6" class="icon icon-envelope cursor-pointer" ng-click="sendEmail(i)"></i>' +
                                                '</td>' +
                                            '</tr>' +
                                        '</tbody>' +
                                    '</table>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
            },
            link: function (scope, e, a) {
                scope.$watch('isall', function (newV, oldV) {
                    if (newV != undefined) {
                        scope.isSkip = !newV;
                        $timeout(function () {
                            scope.showSkip();
                        }, 1000);
                    }
                });

                scope.isSkip = false;
                scope.$watch('taskId', function () {
                    if (!scope.taskId) return;
                    taskService.getProcHistory({ Id: scope.taskId }).then(function (data) {
                        scope.allTaskInfos = data;

                        scope.hideSkipTaskInfos = _.filter(data, function (item) {
                            return item.procStatus !== "11";
                        });

                        scope.taskInfos = scope.hideSkipTaskInfos;
                    });

                    taskService.getExpectApprover({ Id: scope.taskId }).then(function (data) {
                        scope.expectTaskInfos = data;
                    });

                });
                scope.$watch('approveHistory', function () {
                    if (!!scope.approveHistory && !!scope.approveHistory[0]) {
                        scope.taskInfos = scope.approveHistory;
                        //scope.$apply(scope.taskInfos);
                    }
                });

                scope.showSkip = function () {
                    scope.isSkip = !scope.isSkip;
                    if (scope.isSkip)
                        scope.taskInfos = scope.allTaskInfos.concat(scope.expectTaskInfos);
                    else
                        scope.taskInfos = scope.hideSkipTaskInfos;
                }
                scope.pageOpen = function (t) {
                    moduleTransfer.hsitory(t.moduleId, t.appPageId, t.wfdWorkflowNodeId, t);
                }
                scope.backTask = function (item) {
                    mabp.ui.setBusying('.fm-form-block',
                    taskService.backToNode({ taskId: scope.taskId, nodeId: item.wfdWorkflowNodeId }).then(function (result) {
                        if (result) {
                            mabp.notify.success("回滚成功!");
                        } else {
                            mabp.notify.warn("未在测试环境，该功能不可使用!");
                        }
                    }));
                }
                scope.changeLogin = function (item) {
                    window.location.href = "/Account/ChangeLoginInfo?newUserId=" + item.procUserId;
                }

                scope.getProcer = function (i) {
                    return i.procUserName === i.procOwnerName ? i.procUserName : i.procUserName + "(" + L("ProxyFor") + i.procOwnerName + ")";
                }

                scope.getAction = function (action) {
                    switch (action) {
                        case "同意":
                            return true;//"<span class='text-success'>" + action + "</span>";
                        case "提交":
                            return false;//"<span class='text-primary'>" + action + "</span>";
                        default:
                            return false;
                    }
                }

                scope.sendEmail = function (i) {
                    i.mailToAll = false;
                    dialog.open(_shared.dialogs['emailDialog'], { sendTo: i, currentUserInfo: session }, function () {
                    });
                }

                scope.mailToAll = function () {
                    var m = { sendTos: [], mailToAll: true };
                    _.filter(scope.taskInfos, function (data) {
                        if (m.sendTos.indexOf(data.procUserEmailAddress) < 0) {
                            m.sendTos.push(data.procUserEmailAddress);
                        }
                        m.workflowName = data.workflowName;
                        m.sn = data.sn;
                        m.taskId = data.taskId;
                    });
                    dialog.open(_shared.dialogs['emailDialog'], { sendTo: m, currentUserInfo: session }, function () {
                    });
                }
            }
        };
    }
]);