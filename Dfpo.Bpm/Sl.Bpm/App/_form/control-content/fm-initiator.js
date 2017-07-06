_shared
/*表单发起人指令*/
.directive('fmInitiator', [
    '$compile', 'mabp.app.taskRead', function ($compile, service) {
        return {
            restrict: 'E',
            replace: true,
            template: function (elem, attr) {
                return '<div class="row">' +
                            '<div class="form-group">' +
                                '<div class="col-xs-12">' +
                                    '<span class="col-xs-2 control-label">{{ "PostByName" | translate }}</span>' +
                                    '<div class="col-xs-4"><span class="form-label">{{userinfo.userName}}</span></div>' +
                                    '<span class="col-xs-2 control-label">{{ "PostByEmployeeNumber" | translate }}</span>' +
                                    '<div class="col-xs-4"><span class="form-label">{{userinfo.employeeNumber}}</span></div>' +
                                '</div>' +
                            '</div>' +
                        '<div class="form-group">' +
                            '<div class="col-xs-12">' +
                                '<span class="col-xs-2 control-label">{{ "PostByDepartment" | translate }}</span>' +
                                '<div class="col-xs-10"><span class="form-label">{{userinfo.departmentName}}</span></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group" ng-if="!contactHide">' +
                            '<div class="col-xs-12">' +
                                '<span class="col-xs-2 control-label">{{ "PostByTelephone" | translate }}</span>' +
                                '<div class="col-xs-4"><span class="form-label">{{userinfo.contactNumber}}</span></div>' +
                                '<span class="col-xs-2 control-label">{{ "PostByEmail" | translate }}</span>' +
                                '<div class="col-xs-4"><span class="form-label">{{userinfo.emailAddress}}</span></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            },
            scope: {
                jobid: '=',
                userinfo: '=',
                taskid: '='
            },
            link: function (scope, element, attr, ctrl) {
                if (attr.contactHide === "true") {
                    scope.contactHide = true;
                }
                if (!scope.userinfo) {
                    if (!!scope.taskid) {//审批中的表单taskid存在，直接从申请人表中获取到发起人数居
                        service.getFormHeaderInfo({ taskId: scope.taskid }).then(function (data) {
                            if (!!data) {
                                scope.userinfo = {
                                    jobId: data.initiatorJobId,
                                    groupId: data.initiatorGroupId,
                                    userId: data.initiatorUserId,
                                    directManagerJobId: data.initiatorDirectManagerJobId,
                                    department: data.initiatorDepartment,
                                    userName: data.initiatorUserName,
                                    employeeNumber: data.initiatorEmployeeNumber,
                                    departmentName: data.initiatorDepartmentName,
                                    contactNumber: data.initiatorContactNumber,
                                    mobileNumber: data.initiatorMobileNumber,
                                    emailAddress: data.initiatorEmailAddress,
                                    directManagerName: data.initiatorDirectManagerName
                                };
                            }
                        });
                    } else {//创建新的表单时taskid为空，这时候发起人的数据由选择当前系统中人数数据而来。
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
                                directManagerName: data.directManagerName
                            };
                        });
                    }
                }
            }
        }
    }
])