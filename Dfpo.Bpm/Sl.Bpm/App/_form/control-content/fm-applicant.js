_shared
/*表单申请人指令*/
.directive('fmApplicant', [
    '$compile', 'dialog', 'mabp.app.taskRead', function ($compile, dialog, service) {
        return {
            restrict: 'E',
            replace: true,
            template: function (elem, attr) {
                return '<div class="row">' +
                            '<div class="form-group">' +
                                '<div class="col-xs-12">' +
                                    '<span class="col-xs-2 control-label">{{ "ApplicantName" | translate }}</span>' +
                                    '<div class="col-xs-4">' +
                                        '<div class="input-group" style="width: 100%;">' +
                                            '<span class="form-label">{{userinfo.userName}}</span>' +
                                            '<span class="input-group-btn" ng-if="!taskid">' +
                                                '<button class="btn btn-default" type="button" ng-click="selectUser()">{{ "Choose" | translate }}</button>' +
                                            '</span>' +
                                        '</div>' +
                                    '</div>' +
                                    '<span class="col-xs-2 control-label">{{ "ApplicantEmployeeNumber" | translate }}</span>' +
                                    '<div class="col-xs-4"><span class="form-label">{{userinfo.employeeNumber}}</span></div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<div class="col-xs-12">' +
                                    '<span class="col-xs-2 control-label">{{ "ApplicantDepartment" | translate }}</span>' +
                                    '<div class="col-xs-10"><span class="form-label">{{userinfo.departmentName}}</span></div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="form-group" ng-if="!contactHide">' +
                                '<div class="col-xs-12">' +
                                    '<span class="col-xs-2 control-label">{{ "ApplicantTelephone" | translate }}</span>' +
                                    '<div class="col-xs-4"><span class="form-label">{{userinfo.contactNumber}}</span></div>' +
                                    '<span class="col-xs-2 control-label">{{ "ApplicantEmail" | translate }}</span>' +
                                    '<div class="col-xs-4"><span class="form-label">{{userinfo.emailAddress}}</span></div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
            },
            scope: {
                jobid: '=',
                userinfo: '=',
                taskid: '=',
                wfid: '='
            },
            link: function (scope, element, attr, ctrl) {
                if (attr.contactHide === "true") {
                    scope.contactHide = true;
                }
                if (!scope.userinfo) {
                    if (!!scope.taskid) {//审批中的表单taskid存在，直接从申请人表中获取到申请人数居
                        service.getFormHeaderInfo({ taskId: scope.taskid }).then(function (data) {
                            if (!!data) {
                                scope.userinfo = {
                                    jobId: data.applicantJobId,
                                    groupId: data.applicantGroupId,
                                    userId: data.applicantUserId,
                                    directManagerJobId: data.applicantDirectManagerJobId,
                                    department: data.applicantDepartment,
                                    userName: data.applicantUserName,
                                    employeeNumber: data.applicantEmployeeNumber,
                                    departmentName: data.applicantDepartmentName,
                                    contactNumber: data.applicantContactNumber,
                                    mobileNumber: data.applicantMobileNumber,
                                    emailAddress: data.applicantEmailAddress,
                                    directManagerName: data.applicantDirectManagerName,
                                    areaCode: data.areaCode
                                };
                            }
                        });
                    } else {//创建新的表单时taskid为空，这时候申请人的数据由选择当前系统中人数数据而来。
                        service.getUserInfo({ jobId: scope.jobid }).then(function (data) {
                            scope.userinfo = {
                                jobId: data.jobId,
                                groupId: data.groupId,
                                userId: data.userId,
                                directManagerJobId: data.directManagerJobId,
                                department: data.department,
                                userName: data.userName,
                                employeeNumber: data.employeeNumber,
                                departmentName: data.departmentName,
                                contactNumber: data.telephone,
                                mobileNumber: data.cellPhone,
                                emailAddress: data.emailAddress,
                                directManagerName: data.directManagerName,
                                areaCode: data.areaCode
                            };
                        });
                    }
                }

                scope.selectUser = function () {
                    dialog.open(_shared.dialogs['formSelect'], { datatype: "service", jobId: scope.jobid, wfdWorkflowId: scope.wfid }).then(function (data) {
                        var mJobId = scope.jobid;
                        var mUserId = null;
                        if (!!data) {
                            if (!!data.items[data.selectItem]) {
                                mJobId = data.items[data.selectItem].applicantJobId;
                                mUserId = data.items[data.selectItem].applicantUserId;
                            }
                        }
                        service.getUserInfo({ jobId: mJobId, userId: mUserId }).then(function (data) {
                            scope.userinfo = {
                                jobId: data.jobId,
                                groupId: data.groupId,
                                userId: data.userId,
                                directManagerJobId: data.directManagerJobId,
                                department: data.department,
                                userName: data.userName,
                                employeeNumber: data.employeeNumber,
                                departmentName: data.departmentName,
                                contactNumber: data.telephone,
                                mobileNumber: data.cellPhone,
                                emailAddress: data.emailAddress,
                                directManagerName: data.directManagerName,
                                areaCode: data.areaCode
                            };
                        });
                    });
                }
            }
        }
    }
])