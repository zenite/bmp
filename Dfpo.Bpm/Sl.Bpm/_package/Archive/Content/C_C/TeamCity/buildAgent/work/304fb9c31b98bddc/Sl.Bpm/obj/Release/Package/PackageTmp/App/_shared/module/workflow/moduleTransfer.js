//模块跳转器
_shared.service('workflowModuleTransfer', [
    'asdialog', 'dialog', 'mabp.app.module', 'mabp.app.bpm', 'appSession', '$rootScope',
    function (asdialog, dialog, service, bpmService, session, $rootScope) {
        var moduleTransfer = {}
        //获取页面相关信息 并且跳转
        /*
            data 页面的基本数据收集存放
            pageState = 1 打开 / 2 审批 / 3 查看*/

        //内嵌
        function embedded(pageInfo, d) {
            dialog.open(_shared.dialogs['moduleManagement'], pageInfo).then(function () {
                d.resolve(true);
            });
        }

        //新窗口
        function newWindow(pageInfo) {
            window.open("/SysPages/AppPage?nodeId={0}&pageId={1}&jobId={2}&taskId={3}&procId={4}&draftId={5}&areaCode={6}".fill(
                pageInfo.nodeId,
                pageInfo.pageId,
                pageInfo.jobId,
                pageInfo.taskId,
                pageInfo.procId,
                pageInfo.draftId,
                pageInfo.areaCode
            ));
        }

        function getPageAndJump(pageInfo, pageId, nodeId, instData) {
            var d = $.Deferred();
            //获取页面相关信息
            pageInfo.pageId = pageId;
            pageInfo.nodeId = nodeId;
            //如果存在实例对象则赋值
            if (!!instData) {
                pageInfo.jobId = instData.applicantJobId;
                pageInfo.applicantJobId = instData.applicantJobId;
                pageInfo.taskId = instData.taskId;
                pageInfo.draftId = instData.draftId;
                pageInfo.procId = instData.procId;
                pageInfo.nextProcId = instData.nextProcId;
                pageInfo.sn = instData.sn;
                pageInfo.areaCode = instData.areaCode;
                pageInfo.creationTime = instData.creationTime;
                pageInfo.nodeType = instData.nodeType;
                pageInfo.topic = instData.topic;
            }
            //若从草稿打开则 jobId = createByJobId
            if (instData != null && instData.createByJobId != null) {
                pageInfo.jobId = instData.createByJobId;
                pageInfo.applicantJobId = instData.createByJobId;
            }
            if (instData != null) {
                if (instData.openType === 0) {
                    if ($rootScope.workflowGlobalOpenType === '1')
                        embedded(pageInfo, d);
                    else if ($rootScope.workflowGlobalOpenType === '2') {
                        newWindow(pageInfo);
                        d.resolve(true);
                    } else
                        embedded(pageInfo, d);
                }
                else if (instData.openType === 1) {
                    embedded(pageInfo, d);
                }
                else if (instData.openType === 2) {
                    newWindow(pageInfo);
                    d.resolve(true);
                } else
                    embedded(pageInfo, d);
            } else
                embedded(pageInfo, d);

            return d.promise();
        }

        //发起
        //模块id, 页面Id, 节点Id,  身份信息, 流程标题, 流程信息
        moduleTransfer.raise = function (pageId, nodeId, preData) {
            var d = $.Deferred();
            bpmService.getUserJobs().then(function (jobs) {
                var data = {};
                if (!session.telephone || session.telephone == '0') {
                    mabp.notify.error("请先完善个人中心的联系方式");
                    d.resolve(false);
                    return d.promise();
                }
                if (jobs == null || jobs.length === 0) {
                    mabp.notify.error("没有身份,无法发起流程");
                    d.resolve(false);
                }
                //如果为唯一岗位 则直接跳转， 否则弹窗 选择后跳转。OK
                if (jobs.length > 1) {
                    dialog.open(_shared.dialogs['jobSelect'], jobs).then(function (result) {
                        if (result) {
                            data.jobId = result;
                            data.applicantJobId = result;
                            getPageAndJump(data, pageId, nodeId, preData).then(function (result) {
                                d.resolve(result);
                            });
                        }
                    }).always(function () {
                        d.resolve(false);
                    });
                } else {
                    data.jobId = jobs[0].jobId;
                    data.applicantJobId = jobs[0].jobId;
                    getPageAndJump(data, pageId, nodeId, preData).then(function (result) {
                        d.resolve(result);
                    });

                }
            });
            return d.promise();
        }
        //打开草稿
        moduleTransfer.openDraft = function (pageId, nodeId, jobs, preData) {
            var d = $.Deferred();
            var data = {};
            //从草稿打开只有一个JobId
            data.jobId = jobs[0].jobId;
            data.applicantJobId = jobs[0].jobId;
            getPageAndJump(data, pageId, nodeId, preData).then(function (result) {
                d.resolve(result);
            });
            return d.promise();
        }
        //审批
        //模块id, 页面Id, 节点Id, 流程Id, 流程标题
        moduleTransfer.approve = function (pageId, nodeId, instData) {
            var d = $.Deferred();
            getPageAndJump({}, pageId, nodeId, instData).then(function (result) {
                d.resolve(result);
            });
            return d.promise();
        }
        //查看
        //模块id, 页面Id, 节点Id, 流程Id, 流程标题
        moduleTransfer.checkout = function (pageId, nodeId, instData) {
            var d = $.Deferred();
            getPageAndJump({}, pageId, nodeId, instData).then(function (result) {
                d.resolve(result);
            });
            return d.promise();
        }
        return moduleTransfer;
    }
]);