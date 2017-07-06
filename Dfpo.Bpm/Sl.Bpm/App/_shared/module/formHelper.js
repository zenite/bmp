//表单帮助工具服务
_shared.service('formHelper', [
    '$timeout', 'asdialog', 'fmTool', 'mabp.app.module', 'mabp.app.task', 'mabp.app.system', 'dialog',
    'mabp.app.taskRead', 'mabp.app.user', 'mabp.app.permission', 'appSession', '$pageDialog', '$compile', 'mabp.app.file', 'mabp.app.data', '$interval', '$translate',
function ($timeout, asdialog, fmTool, service, taskService, sysService, dialog,
    taskReadService, userService, pService, session, $pageDialog, $compile, fileSv, dataService, $interval, $translate) {
    var sv = {};

    function validate(method, fields) {
        if (!/^([a-zA-Z0-9\.])+$/.test(method)) {
            mabp.notify.error("调用失败: 方法名不正确".fill(method));
            return false;
        }
        //检查对象是简单类型
        if (fields instanceof Array) {
            mabp.notify.error("调用失败:参数只能为简单对象类型");
            return false;
        }
        for (b in fields) {
            if (!fields[b]) continue;;
            switch ((typeof (fields[b])).toLowerCase()) {
                case "string":
                case "int":
                case "number":
                    continue;
                case "object":
                    mabp.notify.error("调用失败:参数‘{0}’的值只能为简单对象类型".fill(b));
                    return false;
                default:
            }
        }
        return true;
    }


    //需要验证的事件
    sv.needValidation = function (btn) {
        var allMethod = ["event_Submit", "event_Resubmit", "event_Agree"];
        return _.findIndex(allMethod, function (i) { return i === btn.type; }) > -1;
    }
    //同步调用后台方法
    sv.callSync = function (pageId, method, fields) {
        //参数调用错误 直接返回
        if (!validate(method, fields)) {
            return false;
        }
        var nameValueArray = mabp.toArray(fields);
        var par = {
            pageId: pageId,
            params: { args: nameValueArray },
            methodName: method
        };
        var pra = JSON.stringify(par);
        return this.postData("/api/module/Invoke", pra);
    }

    //调用后台服务
    sv.postData = function (target, pra) {
        var xmlhttp = null;
        if (window.XMLHttpRequest) {// code for all new browsers
            xmlhttp = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {// code for IE5 and IE6
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        //返回结果
        var invokeResult = null;
        var stateChange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var b = xmlhttp.responseText;
                if (b) {
                    var a = JSON.parse(b);
                    console.log(a);
                    invokeResult = a.result;
                }
            }
        }

        if (xmlhttp != null) {
            xmlhttp.onreadystatechange = stateChange;//设置回调函数  
            xmlhttp.open("POST", target, false);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send(pra);
        }
        else {
            alert("Your browser does not support XMLHTTP.");
        }

        return invokeResult;
    }
    //获取系统时间
    sv.dateTimeNow = function () {
        return new Date(this.postData("/api/system/GetDateTimeNow", null));
    }
    //异步调用后台方法
    sv.callAsync = function (moduleId, method, fields, callBackFunc, config) {
        var nameValueArray = mabp.toArray(fields);
        //参数调用错误 直接返回
        if (!validate(method, fields)) {
            return null;
        }
        //如果为文件类型
        if (config != null && config.type == 'file') {
            service.invokeDownload({
                pageId: moduleId,
                params: {
                    args: nameValueArray
                },
                methodName: method
            }, { responseType: 'blob' }).then(function (result) {
                callBackFunc(result);
            });
        } else {
            service.invoke({
                pageId: moduleId,
                params: {
                    args: nameValueArray
                },
                methodName: method
            }).then(function (result) {
                callBackFunc(result);
            });
        }
        return null;
    }

    sv.pageLoad = function (base, form) {
        if (angular.isFunction(form.$page_load)) {
            console.log("calling page_load ");
            form.$page_load();
        }
    }
    //按钮执行之前
    sv.beforeCallEvent = function (context) {
        var btn = context.btn;
        var form = context.form;
        var base = context.base;
        var needMemo = false;
        var canContinue = false;
        var funcPreCall = function () { };
        switch (btn.type) {
            case 'event_Submit':
                if (angular.isFunction(form.$event_submit_before)) {
                    funcPreCall = form.$event_submit_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_Resubmit':
                if (angular.isFunction(form.$event_resubmit_before)) {
                    funcPreCall = form.$event_resubmit_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_SaveToDraft':
                if (angular.isFunction(form.$event_saveToDraft_before)) {
                    funcPreCall = form.$event_saveToDraft_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_DeleteDraft':
                if (angular.isFunction(form.$event_DeleteDraft_before)) {
                    funcPreCall = form.$event_DeleteDraft_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_SaveForm':
                if (angular.isFunction(form.$event_SaveForm_before)) {
                    funcPreCall = form.$event_SaveForm_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_SaveToTemplate':
                if (angular.isFunction(form.$event_saveToTemplate_before)) {
                    funcPreCall = form.$event_saveToTemplate_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_Delete':
                if (angular.isFunction(form.$event_delete_before)) {
                    funcPreCall = form.$event_delete_before;
                } else {
                    canContinue = true;
                }
                needMemo = false;//base.$rejectNeedMemo;
                break;
            case 'event_Agree':
                if (angular.isFunction(form.$event_agree_before)) {
                    funcPreCall = form.$event_agree_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_Reject':
                if (angular.isFunction(form.$event_reject_before)) {
                    funcPreCall = form.$event_reject_before;
                } else {
                    canContinue = true;
                }
                needMemo = base.$rejectNeedMemo;
                break;
            case 'event_TurnOver':
                if (angular.isFunction(form.$event_turnOver_before)) {
                    funcPreCall = form.$event_turnOver_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_Copy':
                if (angular.isFunction(form.$event_copy_before)) {
                    funcPreCall = form.$event_copy_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_Cancel':
                if (angular.isFunction(form.$event_cancel_before)) {
                    funcPreCall = form.$event_cancel_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_Waiting':
                if (angular.isFunction(form.$event_waiting_before)) {
                    funcPreCall = form.$event_waiting_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_Recede':
                if (angular.isFunction(form.$event_recede_before)) {
                    funcPreCall = form.$event_recede_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_RecedeToProposer':
                if (angular.isFunction(form.$event_recedeToProposer_before)) {
                    funcPreCall = form.$event_recedeToProposer_before;
                } else {
                    canContinue = true;
                }
                needMemo = base.$rejectNeedMemo;
                break;
            case 'event_RecedeToPreviousStep':
                if (angular.isFunction(form.$event_recedeToPreviousStep_before)) {
                    funcPreCall = form.$event_recedeToPreviousStep_before;
                } else {
                    canContinue = true;
                }
                needMemo = base.$rejectNeedMemo;
                break;
            case 'event_RecedeToAnyStep':
                if (angular.isFunction(form.$event_RecedeToAnyStep_before)) {
                    funcPreCall = form.$event_RecedeToAnyStep_before;
                }
                else {
                    canContinue = true;
                }
                needMemo = base.$rejectNeedMemo;
                break;
            case 'event_RecedeToSepcificStep':
                if (angular.isFunction(form.$event_recedeToSepcificStep_before)) {
                    funcPreCall = form.$event_recedeToSepcificStep_before;
                } else {
                    canContinue = true;
                }
                needMemo = base.$rejectNeedMemo;
                break;
            case 'event_event_AutoHandle':
                if (angular.isFunction(form.$event_autoHandle_before)) {
                    funcPreCall = form.$event_autoHandle_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_And':
                if (angular.isFunction(form.$event_and_before)) {
                    funcPreCall = form.$event_and_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_Connect':
                if (angular.isFunction(form.$event_connect_before)) {
                    funcPreCall = form.$event_connect_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_Judge':
                if (angular.isFunction(form.$event_judge_before)) {
                    funcPreCall = form.$event_judge_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_Finish':
                if (angular.isFunction(form.$event_finish_before)) {
                    funcPreCall = form.$event_finish_before;
                } else {
                    canContinue = true;
                }
                break;
            case 'event_Print':
                if (angular.isFunction(form.$event_print_before)) {
                    funcPreCall = form.$event_print_before;
                } else {
                    window.open("/SysPages/AppPage?nodeId={0}&pageId={1}&jobId={2}&taskId={3}&procId={4}&draftId={5}&areaCode={6}&isPrint={7}".fill(
                        base.nodeId,
                        base.pageId,
                        base.jobId,
                        base.taskId,
                        '',
                        '',
                        base.areaCode,
                        '1'
                    ));
                }
                break;

            default:
                return context.$continue();
        }
        if (!base.memo && needMemo) {
            mabp.notify.error("请填写审批意见！");
            return context.$stop();
        } else {
            funcPreCall(context);
        }

        if (canContinue) {
            return context.$continue();
        }
    };


    //准备提交数据 并执行提交事件
    sv.prepareFormDataAndExecute = function (btn, scope, callBackFunc) {
        var base = scope.base;
        var form = scope.form;
        //准备提交参数  
        var formData = { tables: {}, files: [], variables: [], returnToNodes: [] };
        if (base.aliasTables != null) {
            _.forEach(base.aliasTables, function (item) {
                var draftData = "";
                if (item.isMainTable) {
                    //主表拼接
                    draftData = form[item.aliasName];
                } else {
                    //明细表拼接
                    draftData = form[item.aliasName];
                }
                formData.tables[item.aliasName] = draftData;
            });
            formData.tableJson = JSON.stringify(formData.tables);
        }
        if (base.aliasTables != null) {
            _.forEach(base.aliasTables, function (item) {
                var tableData = [];
                if (item.isMainTable) {
                    //主表拼接
                    tableData = mabp.toArray(form[item.aliasName]);
                } else {
                    //明细表拼接
                    for (var i = 0; i < form[item.aliasName].length; i++) {
                        var row = form[item.aliasName][i];
                        tableData.push(mabp.toDetailArray(row, i));
                    }

                    tableData = _.reduce(tableData, function (flattended, other) {
                        return flattended.concat(other);
                    });
                }
                formData.tables[item.aliasName] = tableData;
            });
        }

        formData.fileJson = JSON.stringify(form.$attachments);

        var baseJson = mabp.toArray({ applicant: base.applicant });
        baseJson = baseJson.concat(mabp.toArray({ memo: base.memo }));
        baseJson = baseJson.concat(mabp.toArray({ areaCode: base.areaCode }));

        formData.baseJson = JSON.stringify(baseJson);
        formData.topic = base.topic;

        formData.nodeId = base.nodeId;
        formData.jobId = base.jobId;
        formData.areaCode = base.areaCode;
        formData.applicantId = base.applicant.userId;
        formData.applicantJobId = base.applicant.jobId;
        formData.wfId = base.workflowId;
        formData.nextProcId = base.nextProcId;
        formData.procId = base.procId;
        formData.pageId = base.pageId;

        //按钮信息
        formData.actionText = btn.name;
        formData.actionId = btn.id;
        formData.actionType = btn.type;
        formData.draftId = base.draftId;

        formData.files = form.$attachments;

        formData.procId = base.procId;
        formData.taskId = base.taskId;
        formData.memo = base.memo;
        //处理加签及预处理人逻辑
        var that = this;
        //预处理逻辑
        this.preHandler(formData, btn,
            function () {
                //执行事件
                that.callEvent(btn, formData, form, function (result) {
                    callBackFunc(result);
                });
            }
        );
    }
    //预处理
    sv.preHandler = function (formData, btn, callBack) {
        //加签逻辑 
        if (formData.actionType === 'event_AdditionalSigner') {
            taskReadService.getPreProcessor(formData).then(function (result) {
                if (result != null && result.length > 0) {
                    dialog.open(_shared.dialogs.preProcessorDialog, result).then(function (processors) {
                        //有值的情况下回调
                        if (processors != null && processors.length > 0) {
                            formData.variables = formData.variables.concat(processors);
                            callBack(processors);
                        }
                    });
                } else {
                    mabp.notify.error("没有配置" + btn.name + "处理人");
                }
            });
        }
            //转发
        else if (formData.actionType === 'event_TurnOver') {
            if (btn.forwardType == 0) {
                dialog.open(_shared.dialogs.jobUserDialog, { enterpriseId: null }).then(function (data) {
                    //有值的情况下回调
                    if (!!data) {
                        formData.forwardToJobUserId = data[0].jobUserId;
                        callBack(data);
                    } else {
                        mabp.notify.error("没有选择" + btn.name + "人员");
                    }
                });
            }
            else {
                if (!btn.forwardValue) {
                    mabp.notify.error("请配置处理人员");
                }
                else {
                    callBack();
                }
            }
        }
            //退回任意节点
        else if (formData.actionType === 'event_RecedeToAnyStep') {
            taskReadService.getHandledNodes(formData).then(function (result) {
                if (result != null && result.length > 0) {
                    dialog.open(_shared.dialogs.workflowNodeDialog, { data: result, noLoadData: true }).then(function (data) {
                        //有值的情况下回调
                        if (!!data) {
                            formData.returnToNodes.push(data.id);
                            callBack(data);
                        } else {
                            mabp.notify.error("没有选择" + btn.name + "的节点");
                        }
                    });
                } else {
                    mabp.notify.error("没有可" + btn.name + "的节点选择");
                }
            });
        }
            //抄送
        else if (formData.actionType === 'event_Copy') {
            dialog.open(_shared.dialogs['maUserSelectDialog'], { ismulti: true, initSelectData: null }).then(function (data) {
                formData.userIds = [];
                formData.sharedNameList = [];
                if (!!data) {
                    for (var i = 0; i < data.length; i++) {
                        formData.userIds.push(data[i].id);
                        formData.sharedNameList.push(data[i].name);
                    }
                    formData.sharedNames = formData.sharedNameList.toString();
                    callBack(data);
                } else {
                    mabp.notify.error("没有选择" + btn.name + "人员");
                }
            });
        }
            //保存草稿/模板 填写主题
        else if ((formData.actionType === 'event_SaveToDraft' || formData.actionType === 'event_SaveToTemplate') && !formData.topic) {
            dialog.open(_shared.dialogs['topicDialog'], { topic: formData.topic }).then(function (data) {
                if (!!data) {
                    if (!!data.topic) {
                        formData.topic = data.topic;
                        callBack(data);
                    } else {
                        mabp.notify.error("请填写主题");
                    }
                }
            });
        }
        else {
            callBack();
        }
    }
    //执行按钮事件
    sv.callEvent = function (btn, pa, form, callBack) {
        var saving = null;
        switch (btn.type) {
            case 'event_Submit':
                saving = taskService.event_Submit(pa).then(function (data) {
                    callBack(data);
                    mabp.notify.success("请等待[" + data.nextProcUsers + "]的审批，提交成功！");

                    if (angular.isFunction(form.event_Submit_after)) {
                        console.log("调用event_Submit_after " + form.event_Submit_after(pa));
                        console.log("after已调用");
                    }
                });
                break;
            case 'event_ReSubmit':
                break;
            case 'event_SaveToDraft':
                saving = taskService.event_SaveToDraft(pa).then(function (data) {
                    mabp.notify.success("保存草稿成功！");
                    callBack(data);
                });
                break;
            case 'event_DeleteDraft':
                saving = taskService.event_DeleteDraft(pa).then(function (data) {
                    mabp.notify.success("删除草稿成功！");
                    callBack(data);
                });
                break;
            case 'event_SaveForm':
                saving = taskService.event_SaveForm(pa).then(function (data) {
                    mabp.notify.success("保存成功！");
                    callBack(data);
                });
                break;
            case 'event_SaveToTemplate':
                saving = taskService.event_SaveToTemplate(pa).then(function (data) {
                    mabp.notify.success("保存模板成功！");
                    callBack(data);
                });
                break;
            case 'event_Delete':
                saving = taskService.event_Delete(pa).then(function (data) {
                    mabp.notify.success("删除成功！");
                    callBack(data);
                });
                break;
            case 'event_Agree':
                saving = taskService.event_Agree(pa).then(function (data) {
                    if (!!data.haveEndProc) {
                        mabp.notify.success("审批已完成！");
                    } else {
                        if (data.nextProcUsers == "" || data.nextProcUsers == null) {
                            mabp.notify.success("请等待其他处理者的审批，提交成功！");
                        } else {
                            mabp.notify.success("提交成功, 下一步处理人[" + data.nextProcUsers + "]。");
                        }
                    }
                    callBack(data);
                });
                break;
            case 'event_Reject':
                saving = taskService.event_Reject(pa).then(function (data) {
                    mabp.notify.success("审批完成！");
                    callBack(data);
                });
                break;
            case 'event_TurnOver':
                saving = taskService.event_TurnOver(pa).then(function (data) {
                    mabp.notify.success(btn.name + "[" + data.nextProcUsers + "]成功！");
                    callBack(data);
                });
                break;
            case 'event_Copy':
                taskService.event_Copy(pa).then(function (data) {
                    mabp.notify.success(btn.name + "[" + pa.sharedNames + "]成功！");
                    callBack(data);
                });
                break;
            case 'event_Cancel':
                taskService.event_Cancel(pa).then(function (data) {
                    mabp.notify.success("撤销该任务成功！");
                    callBack(data);
                });
                break;
            case 'event_Waiting':
                taskService.event_Waiting(pa).then(function (data) {
                    mabp.notify.success("挂起该任务成功！");
                    callBack(data);
                });
                break;
            case 'event_Recede':
                taskService.event_Recede(pa).then(function (data) {
                    mabp.notify.success("撤回该任务成功！");
                    callBack(data);
                });
                break;
            case 'event_RecedeToProposer':
                saving = taskService.event_RecedeToProposer(pa).then(function (data) {
                    if (!data.nextProcUsers) {
                        mabp.notify.success("退回失败！");
                    } else {
                        mabp.notify.success("退回[" + data.nextProcUsers + "]成功！");
                    }
                    callBack(data);
                });
                break;
            case 'event_RecedeToPreviousStep':
                saving = taskService.event_RecedeToPreviousStep(pa).then(function (data) {
                    mabp.notify.success("退回上一步成功！");
                    callBack(data);
                });
                break;
            case 'event_RecedeToAnyStep':
                saving = taskService.event_RecedeToAnyStep(pa).then(function (data) {
                    if (!data.nextProcUsers) {
                        mabp.notify.success("退回失败！");
                    } else {
                        mabp.notify.success("退回[" + data.nextProcUsers + "]成功！");
                    }
                    callBack(data);
                });
                break;
            case 'event_RecedeToSepcificStep':
                saving = taskService.event_RecedeToSepcificStep(pa).then(function (data) {
                    if (!data.nextProcUsers) {
                        mabp.notify.success("退回失败！");
                    } else {
                        mabp.notify.success("退回[" + data.nextProcUsers + "]成功！");
                    }
                    callBack(data);
                });
                break;
            case 'event_AutoHandle':
                break;
            case 'event_And':
                break;
            case 'event_Connect':
                break;
            case 'event_Judge':
                break;
            case 'event_Finish':
                break;
            case 'event_Test':
                setTimeout(sv.TestEvent(btn, pa, form), 2000);
                break;
            case 'event_AdditionalSigner':
                saving = taskService.event_AdditionalSigner(pa).then(function (data) {
                    if (!!data.haveEndProc) {
                        mabp.notify.success("审批已完成！");
                    } else {
                        mabp.notify.success("提交成功, 下一步处理人[" + data.nextProcUsers + "]。");
                    }
                    callBack(data);
                });
                break;
            case 'event_Custome':
                if (!!btn.func) {
                    btn.func();
                }
                break;

            default:
        }
        if (!!saving) {
            mabp.ui.setBusying('.fm-form-block', saving);
            mabp.ui.setSaving(btn.id, saving);
        }
    }
    //测试方式
    sv.TestEvent = function (btn, pa, form, callBack) {
        if (!pa.procId) {
            saving = taskService.event_Submit(pa).then(function (data) {
                mabp.notify.success("请等待[" + data.nextProcUsers + "]的审批，提交成功！");

                if (angular.isFunction(form.event_Submit_after)) {
                    console.log("调用event_Submit_after " + form.event_Submit_after(pa));
                    console.log("after已调用");
                }
                pa.taskId = data.taskId;
                pa.procId = "下一步";
                pa.memo = "测试自动审批";
                setTimeout(sv.TestEvent(btn, pa, form), 2000);
            });
        }
        else {
            taskService.getTopHandleProcInTask({ Id: (pa.taskId ? pa.taskId : pa.procId) }).then(function (data) {
                if (data.length == 0) {
                    mabp.notify.success("没有下一步审批人！");
                }
                else {
                    pa.procId = data[0];
                    taskService.event_Agree(pa).then(function (data) {
                        if (!!data.haveEndProc) {
                            mabp.notify.success("审批已完成！");
                            return;
                        } else {
                            if (data.nextProcUsers == "" || data.nextProcUsers == null) {
                                mabp.notify.success("请等待其他处理者的审批，提交成功！");
                            } else {
                                mabp.notify.success("提交成功, 下一步处理人[" + data.nextProcUsers + "]。");
                            }
                        }
                        pa.taskId = data.taskId;
                        setTimeout(sv.TestEvent(btn, pa, form), 2000);
                    });
                }
            });
        }
    }

    //执行验证
    sv.validate = function (scope) {
        var form = scope.form;
        form.$errors = [];
        //自动表单验证
        this.doFormValidate(scope);
        //表单内部自定义验证
        if (angular.isFunction(form.$doValidation)) {
            form.$doValidation();
        }
        //展示错误结果
        if (form.$errors != null && form.$errors.length > 0) {
            this.showError(form.$errors);
            return false;
        }
        return true;
    }
    //执行表单自动验证
    sv.doFormValidate = function (scope) {
        var base = scope.base;
        var form = scope.form;
        var validateArray = $('.fm-content .normal[fm-model]');
        var elements = [];
        //收集需要验证的信息
        for (var i = 0; i < validateArray.length; i++) {
            var item = $(validateArray[i]);
            elements.push({
                element: $(validateArray[i]),
                v: item.attr('fm-model'),
                isR: item.attr('required') == 'required',
                vn: item.attr('field-name'),
                minv: item.attr('min-value'),
                maxv: item.attr('max-value'),
                minl: item.attr('min-length'),
                maxl: item.attr('max-length'),
                pattern: item.attr('pattern'),
                vd: item.parents('[detail-name]').attr('detail-name'),
                vt: item.attr('fm-text-model')
            });
        }
        //验证信息
        var errors = []; // {id: , msg:}
        for (var i = 0; i < elements.length; i++) {
            var _repeat = elements[i].element.parents("[ng-repeat]");
            var v = null;
            var vt = null;
            var _isdetail = false, _linenum = null;
            if (_repeat.length == 0) {
                var v = scope.$eval(elements[i].v);
                vt = scope.$eval(elements[i].vt);
            } else if (elements[i].element.attr("linenum") != undefined) {
                var _index = elements[i].element.attr("linenum");
                var v = scope.$eval(elements[i].element.attr("fm-model").replace("$index", _index));
                vt = scope.$eval((elements[i].element.attr("fm-text-model") || "").replace("$index", _index));
            } else {
                var _index = -1;
                var _name = _repeat.attr("ng-repeat");
                var _filterLength = _name.indexOf("|");
                if (_filterLength > 0) {
                    _name = _name.substr(0, _filterLength - 1);
                }
                var _temparr = $("[ng-repeat*='" + _name + "']");
                for (var o = 0; o < _temparr.length; o++) {
                    if (!!_temparr[o].$$hashKey) {
                        if (_temparr[o].$$hashKey == _repeat[0].$$hashKey) _index = o;
                    } else {
                        if (_temparr[o].innerText == _repeat[0].innerText) _index = o;
                        //if (_temparr[o].className == _repeat[0].className) _index = o;
                    }
                }
                _name = _name.substr(_name.lastIndexOf(" ") + 1);
                //var _name = _repeat.attr("ng-repeat").substr(_repeat.attr("ng-repeat").lastIndexOf(" ") + 1);
                var v = scope.$eval(_name + "[" + _index + "]." + elements[i].v.substr(elements[i].v.lastIndexOf(".") + 1));
                if (elements[i].vt === undefined) {
                    vt = undefined;
                } else {
                    vt = scope.$eval(_name + "[" + _index + "]." + elements[i].vt.substr(elements[i].vt.lastIndexOf(".") + 1));
                }
                _isdetail = true;
                _linenum = _index + 1;
            }
            if (elements[i].isR) {
                if (vt !== undefined) {
                    if (vt === "" && v === "") {
                        errors.push({ element: elements[i].element, id: elements[i].v, msg: (_isdetail ? elements[i].vd + "第" + _linenum + "行 " : "") + elements[i].vn + base.ruleL['isrequired'] });
                    }
                } else {
                    if (v == undefined || v === "") {
                        errors.push({ element: elements[i].element, id: elements[i].v, msg: (_isdetail ? elements[i].vd + "第" + _linenum + "行 " : "") + elements[i].vn + base.ruleL['isrequired'] });
                    }
                }
            }
            if ((elements[i].maxl != undefined && v != undefined && parseInt(elements[i].maxl) < (v || "").length)) {
                errors.push({ element: elements[i].element, id: elements[i].v, msg: (_isdetail ? elements[i].vd + "第" + _linenum + "行 " : "") + elements[i].vn + base.ruleL['lengthcannotlager'] + elements[i].maxl });
            }
            if ((elements[i].minl != undefined && v != undefined && parseInt(elements[i].minl) > (v || "").length)) {
                errors.push({ element: elements[i].element, id: elements[i].v, msg: (_isdetail ? elements[i].vd + "第" + _linenum + "行 " : "") + elements[i].vn + base.ruleL['lengthcannotlesser'] + elements[i].minl });
            }
            if (elements[i].minv != undefined) {
                if (!isNaN(v)) {
                    if (parseFloat(elements[i].minv) > parseFloat(v)) {
                        errors.push({ element: elements[i].element, id: elements[i].v, msg: (_isdetail ? elements[i].vd + "第" + _linenum + "行 " : "") + elements[i].vn + base.ruleL['valuecannotlesser'] + elements[i].minv });
                    }
                }
            }
            if (elements[i].maxv != undefined) {
                if (!isNaN(v)) {
                    if (parseFloat(elements[i].maxv) < parseFloat(v)) {
                        errors.push({ element: elements[i].element, id: elements[i].v, msg: (_isdetail ? elements[i].vd + "第" + _linenum + "行 " : "") + elements[i].vn + base.ruleL['valuecannotlager'] + elements[i].maxv });
                    }
                }
            }
            if (elements[i].pattern != undefined) {
                if (v != undefined && v != "" && !new RegExp(elements[i].pattern).test('' + v)) {
                    errors.push({ element: elements[i].element, id: elements[i].v, msg: (_isdetail ? elements[i].vd + "第" + _linenum + "行 " : "") + elements[i].vn + base.ruleL['pattern'] });
                }
            }
        }
        //返回错误对象
        form.$errors = form.$errors.concat(errors);
    }

    //展示错误
    sv.showError = function (errors) {
        //展示错误样式
        _.each(errors, function (i) {
            i.element.addClass("fm-has-error");
            $(i.element).one("mousedown", function () {
                $(this).removeClass("fm-has-error");
            });
        });
    }

    //触发动作按钮
    sv.submit = function (btn, $scope, callBackFunc) {
        var base = $scope.base;
        var form = $scope.form;
        //移除所有错误
        $('.fm-has-error').removeClass('fm-has-error');
        //只对一些特定事件需要表单验证
        if (this.needValidation(btn)) {
            //执行表单验证
            var isValidate = this.validate($scope);
            if (!isValidate) return;
        }

        var that = this;
        //改为异步
        var context = {
            btn: btn,
            base: base,
            form: form,
            $stop: function () { },
            $continue: function () {
                //添加点击确认弹窗
                if (!btn.noConfirm) {
                    mabp.message.confirm('点击确定后将' + btn.name, '确认-' + btn.name, function (confirmed) {
                        //准备提交数据 并执行事件
                        if (confirmed)
                            that.prepareFormDataAndExecute(btn, $scope, callBackFunc);
                    });
                } else {
                    //准备提交数据 并执行事件
                    that.prepareFormDataAndExecute(btn, $scope, callBackFunc);
                }
            }
        }
        //执行事件之前
        that.beforeCallEvent(context);
    };

    //获取表单数据
    sv.getTaskData = function ($scope) {
        var base = $scope.base;
        var form = $scope.form;
        if (base.taskId || !!base.draftId) {
            var b =
            {
                taskId: base.taskId,
                nodeId: base.nodeId, //vm.data.task.wfdWorkflowNodeId,
                procId: base.procId,
                draftId: base.draftId
            };
            return taskService.getFormTask(b).then(function (data) {
                if (!!data) {
                    var tables = JSON.parse(data);
                    _.forEach(base.aliasTables, function (item) {
                        if (item.isMainTable) {
                            var table = null;
                            if (!!base.draftId) {
                                table = tables[item.aliasName];
                            } else {
                                if (tables[item.aliasName].length > 0)
                                    table = tables[item.aliasName][0];
                                else
                                    table = {};
                            }
                            form[item.aliasName] = table;
                            //副本用于判断是否为第一次
                            $scope.$initial[item.aliasName] = angular.copy(table);
                            base.snNumber = base.snNumber || table && table.snNumber;
                            base.applyDate = base.applyDate || table && table.creationTime;
                            base.isFromAutoPost = (table && table.isFromAutoPost) || false;
                        } else {
                            form[item.aliasName] = tables[item.aliasName];
                            //副本用于判断是否为第一次
                            $scope.$initial[item.aliasName] = angular.copy(tables[item.aliasName]);
                        }
                    });
                }
            });
        }
    };

    //获取页面权限信息
    sv.getPageRight = function ($scope) {
        var base = $scope.base;
        var form = $scope.form;
        return service.getNodePageRights({ nodeId: base.nodeId, pageId: base.pageId, pageStatus: base.pageState }).then(function (data) {
            for (i in data) {
                //大写
                form.$pageRight[i.upperFirst()] = data[i];
                //小写
                form.$pageRight[i] = data[i];
            }
        });
    }

    //获取页面多语言信息
    sv.getPageLang = function ($scope) {
        var base = $scope.base;
        var form = $scope.form;
        return service.getPageLanguages({ id: base.pageId, displayLanguages: base.displayLanguages }).then(function (data) {
            for (i in data) {
                //大写
                form.$pageLang[i.upperFirst()] = data[i];
                //小写
                form.$pageLang[i] = data[i];
            }
        });
    }

    //获取动作按钮
    sv.getActionButton = function ($scope) {
        var base = $scope.base;
        return taskReadService.getFormActionButtons(base).then(function (result) {
            base.actionButtons = _.filter(result, { displayLanguages: base.displayLanguages });
            if (!base.taskId) {
                _.remove(base.actionButtons, function (n) {
                    return (n.type == "event_Delete");
                });
            }
            if (base.pageState == 1 && base.isWaiting == 1) {
                _.remove(base.actionButtons, function (n) {
                    return (n.type == "event_Waiting");
                });
            }
        });

    }

    //撤回/删除草稿 按钮
    sv.getMoreActionButton = function ($scope) {
        var base = $scope.base;
        if (!!base.nextProcId) {
            base.actionButtons.push({ type: "event_Recede", name: "撤回", id: "1" });
        }
        //var isHaveRecede = _.findIndex(base.actionButtons, { type: "event_Recede" }) > -1;
        //if (!isHaveRecede) {
        //    if (!base.nextProcId) {
        //        _.remove(base.actionButtons, function (n) {
        //            return n.type == "event_Recede";
        //        });
        //    }
        //}

        if (!!base.draftId) {
            base.actionButtons.push({ type: "event_DeleteDraft", name: "删除草稿", id: "2" });
        }

        if (!!$scope.form.$customeButtons) {
            for (var i = 0; i < $scope.form.$customeButtons.length; i++) {//"event_Custome"
                var isHave = _.findIndex(base.actionButtons, { type: $scope.form.$customeButtons[i].type }) > -1;
                if (!isHave)
                    base.actionButtons.push({ type: $scope.form.$customeButtons[i].type, name: $scope.form.$customeButtons[i].name, id: (3 + i).toString(), func: $scope.form.$customeButtons[i].func });
            }
        }
    }

    //线程同步方法
    sv.syncTasks = function () {
        var d = $.Deferred();
        var all = arguments;
        var allTasks = [];
        function isFinished() {
            for (var k = 0; k < allTasks.length; k++) {
                if (allTasks[k].complete == false) {
                    return false;
                }
            }
            d.resolve(true);
            return true;
        }
        function callBack(t) {
            var asyncTask = t.task;
            if (asyncTask.promise) { //Supports Q and jQuery.Deferred
                if (asyncTask.promise.always) {
                    asyncTask.promise.always(function () {
                        t.complete = true;
                        isFinished();
                    });
                } else if (asyncTask.promise['finally']) {
                    asyncTask.promise['finally'](function () {
                        t.complete = true;
                        isFinished();
                    });
                }
            }
        }

        //构建所有任务
        for (var i = 0; i < all.length; i++) {
            if (all[i] != null && (all[i].always || all[i]['finally'])) { //Check if it's promise
                all[i] = {
                    promise: all[i]
                };
                allTasks.push({
                    id: i,
                    task: all[i],
                    complete: false
                });
            }
        }
        //跟踪任务状态
        for (var j = 0; j < allTasks.length; j++) {
            callBack(allTasks[j]);
        }
        return d.promise();
    }
    //获取头部信息
    sv.getHeaderInfo = function ($scope) {
        $scope.base.taskStatus = -1; //不存在
        //有TaskId
        if (!!$scope.base.taskId && !$scope.base.draftId) {
            return taskReadService.getFormHeaderInfo({ taskId: $scope.base.taskId }).then(function (data) {
                //Header信息不存在
                if (!!data && !!data.applicantJobId) {
                    //任务状态
                    $scope.base.taskStatus = data.taskStatus;
                    $scope.base.initiator = {
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
                        directManagerName: data.initiatorDirectManagerName,
                        areaCode: data.initiatorAreaCode
                    };
                    $scope.base.applicant = {
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
                        areaCode: data.applicantAreaCode
                    };
                } else {
                    return taskReadService.getUserInfo({ jobId: $scope.base.applicantJobId }).then(function (data) {
                        $scope.base.initiator = {
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
                        $scope.base.applicant = {
                            jobId: data.jobId,
                            groupId: data.groupId,
                            userId: data.userId,
                            directManagerJobId: data.directManagerJobId,
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
            });
        } else if (!!$scope.base.draftId) {
            taskReadService.getDraftFormHeaderInfo({ draftId: $scope.base.draftId }).then(function (data) {
                if (!!data) {
                    var result = mabp.toObject(JSON.parse(data));
                    if (result.applicant)
                        $scope.base.applicant = result.applicant;
                    $scope.base.memo = result.memo;
                    $scope.base.areaCode = result.areaCode;
                }
            });
            taskReadService.getUserInfo({ jobId: $scope.base.applicantJobId }).then(function (data) {
                $scope.base.initiator = {
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
        } else {
            return taskReadService.getUserInfo({ jobId: $scope.base.applicantJobId }).then(function (data) {
                $scope.base.initiator = {
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
                $scope.base.applicant = {
                    jobId: data.jobId,
                    groupId: data.groupId,
                    userId: data.userId,
                    directManagerJobId: data.directManagerJobId,
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

    //获取基础数据
    sv.getPageBasicDataAndViewData = function ($scope) {
        var base = $scope.base;
        if (!!base.taskId) {
            return service.getPageBasicDataAndViewData({
                taskId: base.taskId,
                nodeId: base.nodeId,
                procId: base.procId,
                draftId: base.draftId,
                pageId: base.pageId
            }).then(function (data) {
                if (!!data) {
                    for (var i = 0; i < data.length; i++) {
                        $scope.base.basicAndViewData[data[i].source] = data[i].data;
                    }
                }
            });
        }
    }
    //获取可以选择的子公司列表
    sv.getUserCompanyPermission = function ($scope) {
        var base = $scope.base;
        if (base.areaEnable && !base.taskId) {
            return pService.getUserCompanyPermission({ id: base.workflowId }).then(function (data) {
                if (!!data) {
                    base.areaCodeList = data;
                }
            });
        }
    }
    //构建基类对象
    sv.buildBase = function (pageInfo) {
        var that = this;
        var language = !pageInfo.displayLanguages ? app.language : pageInfo.displayLanguages;
        var base = {
            $rejectNeedMemo: true, //拒绝时默认审批已经需要
            isPrint: pageInfo.isPrint,
            basicAndViewData: {}, //初始加载视图和基础数据
            nodeId: pageInfo.nodeId, //节点Id
            nodeType: pageInfo.nodeType, //节点类型
            nodeCode: pageInfo.nodeCode, //节点编号
            pageId: pageInfo.pageId, //页面Id
            jobId: pageInfo.jobId, //发起人岗位Id
            aliasTables: [], //页面涉及的表别名
            applicantJobId: pageInfo.applicantJobId, // 申请人JobId
            draftId: pageInfo.draftId, //若为草稿打开则存在DraftId
            procId: pageInfo.procId, //若为某一步打开则存在步骤Id
            taskId: pageInfo.taskId,
            workflowId: null, //流程Id
            areaEnable: null, //流程是否可以选择公司
            areaCodeList: null, //流程可选公司范围 [ text: '文本', areaCode: 'CompanyCode'] 只在发起时使用
            title: null, //页面标题
            pageState: 3, //页面打开的状态 1 发起 / 2 审批 / 3 查看 默认3
            snNumber: pageInfo.sn, //流水号
            applyDate: pageInfo.creationTime, //创建日期
            areaCode: pageInfo.areaCode, //所属公司
            initiator: {}, //发起人信息
            applicant: { userId: '' }, //申请人信息
            currentUserId: session.userId, //当前用户Id
            actionButtons: [], //命令按钮组 
            language: app.language, //页面当前语言
            displayLanguages: language, //多个语言同时显示
            $pageLang: MultiL(language), //mabp.localization['Bpm.' + app.language], //系统多语言信息 参考 /App_Start/Localization
            ruleL: _shared.languageSetting.defaultRules[app.language], //静态多语言设置 参考App/_shared/language/languageSetting.js
            close: function () {
                if (window.opener != null && window.hasOwnProperty('_$refresh')) {
                    window.opener._$refresh();
                }
                //新窗体打开，延迟1.5秒
                if (!!pageInfo.isNewTab) {
                    $timeout(function () {
                        pageInfo.close();
                    }, 1500);
                } else {
                    pageInfo.close();
                }
            }, //关闭当前窗体方法
            nextProcId: pageInfo.nextProcId, //下一步处理人Id
            topic: pageInfo.topic,
            isWaiting: pageInfo.isWaiting,
            getDateTimeNow: function (callBack) {
                return that.dateTimeNow();
            },
            addButton: function (btnType, btnName, btnId, memo) {
                base.actionButtons.push({ type: btnType, name: btnName, id: btnId });
                base.memo = memo;
            },
            $initial: [], //保存刚打开的数据，用于Callback-func 第一次调用使用.
            param: pageInfo.param,
            isPdf: pageInfo.isPdf,
            isNewTab: !!pageInfo.isNewTab //是否为新Tab打开
        };
        //初始化页面状态 开始节点 
        if (!base.taskId && !base.procId) {
            base.pageState = 1;
        } else if ((!!base.taskId && !!base.procId) || !!base.draftId) {
            base.pageState = base.nodeType === 0 ? 1 : 2;
        } else if (!!base.taskId && !base.procId) {
            base.pageState = 3;
        }
        return base;
    }

    //new Tab 打开子页面
    var openSubPageNewTab = function (fileName, base, form, para, callback) {
        var data = {};
        debugger;
        data.pageId = base.pageId;//此处pageId保存父页面的Id用于获取权限信息
        data.parentPageId = base.pageId;
        data.moduleId = base.moduleId;
        data.fileName = fileName;
        data.displayLanguages = base.displayLanguages;
        data.nodeId = base.nodeId;
        data.pageState = base.pageState;
        data.areaCode = base.areaCode;
        data.areaEnable = base.areaEnable;
        data.areaCodeList = base.areaCodeList;
        data.applicantJobId = base.applicantJobId;
        data.currentUserId = base.currentUserId;
        data.draftId = base.draftId;
        data.taskStatus = base.taskStatus;
        data.taskId = base.taskId;
        data.isPrint = base.isPrint;
        data.isPdf = base.isPdf;
        data.jobId = base.jobId;
        data.procId = base.procId;
        data.isNewTab = true;
        newWindow(data, para, callback);
        //service.getSubPage({ parentPageId: base.pageId, moduleId: base.moduleId, fileName: fileName }).then(function (data) {
        //    //var param = { fileName: fileName, base: base, param: para, pageData: data };
        //    base.html = data.pcHtml;//替换父页的html
        //    base.js = data.pcController;//替换父页的js
        //    base.title = data.pageName;//表单名
        //    base.fileName = data.fileName;

        //});
    }

    //新窗口
    function newWindow(pageInfo, param, callback) {
        //var origin = { nodeId: base.nodeId,fileName: };
        mabp.openWin("/SysPages/NewTabDetailPage?origin={0}&param={1}".fill(
            JSON.stringify(pageInfo),
            JSON.stringify(param)
        ), callback);
    }



    //构建表单类对象
    sv.buildForm = function ($scope) {
        //初始值存放 用于比对是否初始化过
        $scope.$initial = {};
        $scope.$initial.$initaled = {};

        var form = {
            $pageRight: {}, //页面权限
            $pageLang: {}, //页面多语言
            $attachments: [], //附件
            $state: {}, //暂存状态
            $errors: [], //页面错误信息 // {element, id: , msg:}
            $timeout: $timeout, //页面错误信息 // {element, id: , msg:}
            $watch: function (variable, callbackFunc, istrue) { $scope.$watch(variable, callbackFunc, istrue); }, //传递watch方法
            $alert: function (msg) { mabp.notify.error(msg); }, //提示 会替换为 警告框
            $toast: function (msg) { mabp.notify.error(msg); }, //消息提醒 
            $openDialog: function (fileName, param, callBack, config) {
                $pageDialog.open(fileName, $scope.base, param, callBack, config);
            },
            $confirm: mabp.message.confirm,//<内容>,<标题>,<回调方法>
            $checkAll: function (ischecked, items) {
                if (!!items && items.length > 0) for (var i = 0; i < items.length; i++) items[i].checked = !!ischecked;
            },//明细表全选
            $openNewWin: function (fileName, param, callback) {
                openSubPageNewTab(fileName, $scope.base, $scope.form, param, callback);
            },//表单中打开new Tab
            $exportExcel: function (dataView, filter, orderBy, ascending) {
                sv.pagingExport = {};
                sv.pagingExport.orderByProperty = orderBy;
                sv.pagingExport.ascending = ascending || false;
                sv.pagingExport.pageSize = 2147483647;
                sv.pagingExport.currentPage = 1;
                fileSv.downloadView({ code: dataView, filters: mabp.toArray(filter), pageInput: sv.pagingExport }, { responseType: 'blob' });
            }
        };
        return form;
    }

    //初始化数据并打开页面
    sv.pageStart = function (base, form, $scope, $rootScope) {
        var that = this;
        //获取表单页面信息  
        service.getPage({ pageId: base.pageId, nodeId: base.nodeId, displayLanguages: base.displayLanguages }).then(function (result) {
            //来自page
            base.html = result.pcHtml;
            base.js = result.pcController;
            base.moduleIdentity = result.moduleIdentity;
            base.fileName = result.fileName;
            base.workflowId = result.wfdWorkflowId;
            base.areaEnable = result.areaEnable;
            //            base.areaCodeList = result.areaCodeList; 
            base.aliasTables = result.aliasTables;
            base.title = result.pageName;
            base.moduleId = result.moduleId;
            //表单打开的节点代码
            form.$nodeCode = result.nodeCode;
            //初始化别名表
            if (base.aliasTables != null) {
                _.forEach(base.aliasTables, function (item) {
                    if (item.isMainTable) {
                        form[item.aliasName] = {};
                    } else {
                        form[item.aliasName] = [];
                    }
                });
            }
            var loader = new mabp.ui.loader('.entire-block');
            loader.start();
            that.syncTasks(
                that.getTaskData($scope), //获取任务信息
                that.getPageRight($scope), //获取页面权限信息
                that.getPageLang($scope), //获取多语言信息
                that.getActionButton($scope), //获取按钮信息
                that.getHeaderInfo($scope), //获取头部信息
//                that.getPageBasicDataAndViewData($scope), //获取业务表基础数据和视图数据
                that.getUserCompanyPermission($scope)
            ).then(function () {
                //所有数据加载完成后初始化页面信息
                $timeout(function () {
                    base.currentUserId = session.userId; //顺序没有被严格控制，再刷一次。

                    //设置标题
                    form.$watch('base.applicant', function () {
                        if (!base.applicant || !base.applicant.userName) return;
                        $rootScope.title = base.applicant.userName + '的' + base.title;
                    });

                    if (!base.areaCode && !base.areaEnable) {
                        base.areaCode = base.applicant.areaCode;
                    }
                    try {
                        //加载页面的相关信息
                        eval(base.js);

                        function call(method, param, callbackFunc, config) {
                            if (angular.isFunction(callbackFunc))
                                that.callAsync(base.pageId, method, param, callbackFunc, config);
                            else
                                return that.callSync(base.pageId, method, param);
                            return null;
                        }

                        //加载js
                        controller(base, form, call);
                    } catch (e) {
                        mabp.notify.error(e);
                    }

                    //调用页面初始化加载方法
                    that.pageLoad(base, form);
                    sv.getMoreActionButton($scope);
                    //加载html
                    var attachedDom = $compile('<fm-cache>' + base.html + '</fm-cache>')($scope);
                    angular.element('.fm-content').html(attachedDom);
                    loader.stop();
                    //                    $('.entire-block').css('visibility', 'visible');
                    //调用打印机
                    if (base.isPrint === true) {
                        $timeout(function () { window.print(); }, 2500);
                    }
                }, 200);
            });
        });

        //绑定提交数据 动作
        base.submit = function (btn) {
            //移除所有错误提示
            that.submit(btn, $scope, function () {
                base.close(true);
            });
        }

        //展示校验错误
        base.showErrorControl = function (e) {
            var scrollOffset = $(e.element).offset();
            var blockDom = $(e.element).parents(".entire-block");
            blockDom.animate({
                scrollTop: blockDom.scrollTop() + scrollOffset.top - 100
            }, 300, "linear", function () {
                $(e.element).removeClass("fm-has-error");
                setTimeout(function () {
                    $(e.element).addClass("fm-has-error");
                    setTimeout(function () {
                        $(e.element).removeClass("fm-has-error");
                        setTimeout(function () {
                            $(e.element).addClass("fm-has-error");
                        }, 300);
                    }, 300);
                }, 300);
            });
        }

        //获取视图数据
        base.$readViewData = function (viewcode, filter, call) {
            fmTool.getView(viewcode, filter, function (data) {
                var d = data.viewTable;
                var t = data.viewName;

                if (!!call) {
                    call(d);
                }
            });
        }

        //获取审批数据
        base.$approveInfo = function () {
            if (!!base.taskId) {
                taskService.getProcHistoryForForm({ id: base.taskId }).then(function (data) {
                    base.$approveInfoList = [];
                    for (var i = 0; i < data.length; i++) {
                        var text = data[i].procUserName + "　　" + new Date(data[i].approveDate).format("yyyy-MM-dd");
                        if (!!data[i].jobCode && !base.$approveInfoList[data[i].jobCode]) {
                            base.$approveInfoList[data[i].jobCode] = text;
                        }
                        if (!!data[i].nodeCode) {
                            base.$approveInfoList[data[i].nodeCode] = !!base.$approveInfoList[data[i].nodeCode] ? base.$approveInfoList[data[i].nodeCode] + "\n" + text : text;
                        }
                    }
                });
            }
        }
        base.$approveInfo();

        base.$getBasicData = function (datacode, call) {
            service.getBasicData({ code: datacode }).then(function (data) {
                if (!!data && !!call) {
                    call(data);
                }
            });
        }

        //选择发起人
        base.$selectApplicant = function () {
            dialog.open(_shared.dialogs['formSelect'], { datatype: "service", jobId: base.jobId, wfdWorkflowId: base.workflowId }).then(function (data) {
                var mJobId = base.jobId;
                var mUserId = null;
                if (!!data) {
                    if (!!data.items[data.selectItem]) {
                        mJobId = data.items[data.selectItem].applicantJobId;
                        mUserId = data.items[data.selectItem].applicantUserId;
                    }
                }
                taskReadService.getUserInfo({ jobId: mJobId, userId: mUserId }).then(function (data) {
                    base.applicant = {
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
            });
        }
    }

    //报表和基础数据部分获取的User/Job/Group信息
    sv.getUserInfo = function ($scope) {
        var base = $scope.base;
        return userService.getCurrentUserUserJobGroup({ JobId: base.jobId }).then(function (data) {
            if (!!data) {
                base.areaCode = data.areaCode;
            }
        });
    }


    //报表
    var reg = /^\d{4}-\d{2}-\d{2}[T]([01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d.\d?\d?\d?$/;
    sv.initReportTable = function (datacode, filter, isRefresh, page, func, form) {
        if (page) {
            service.getViewTable({ code: datacode, filters: mabp.toArray(filter), pageInput: page }).then(function (data) {
                if (!!data) {
                    if (!isRefresh) {
                        var _obj = {};
                        form.$column = [];
                        form.$columnText = [];
                        for (var i = 0; i < data.displayColumList.length; i++) {
                            data.displayColumList[i].displayColumn = data.displayColumList[i].displayColumn.substring(0, 1).toLowerCase() + data.displayColumList[i].displayColumn.substring(1);
                            _obj[data.displayColumList[i].displayColumn] = data.displayColumList[i].name;
                        }
                        var cols = _obj;
                        for (var col in cols) {
                            if (cols.hasOwnProperty(col)) {
                                form.$column.push(col);
                                form.$columnText.push(cols[col]);
                            }
                        }
                    }
                    _.forEach(form.$column, function (col) {
                        _.forEach(data.viewTable, function (item) {
                            if (reg.test(item[col]))
                                item[col] = moment(item[col]).format("YYYY-MM-DD");

                        });
                    });

                    if (func) func(data);
                }
            });
        } else {
            service.getViewTable({ code: datacode, filters: mabp.toArray(filter) }).then(function (data) {
                if (!!data) {
                    if (!isRefresh) {
                        var _obj = {};
                        for (var i = 0; i < data.displayColumList.length; i++) {
                            data.displayColumList[i].displayColumn = data.displayColumList[i].displayColumn.substring(0, 1).toLowerCase() + data.displayColumList[i].displayColumn.substring(1);
                            _obj[data.displayColumList[i].displayColumn] = data.displayColumList[i].name;
                        }
                        var cols = _obj;
                        for (var col in cols) {
                            if (cols.hasOwnProperty(col)) {
                                form.$column.push(col);
                                form.$columnText.push(cols[col]);
                            }
                        }
                    }
                    _.forEach(form.$column, function (col) {
                        _.forEach(data.viewTable, function (item) {
                            if (reg.test(item[col]))
                                item[col] = moment(item[col]).format("YYYY-MM-DD");

                        });
                    });

                    if (func) func(data);
                }
            });
        }

    }

    sv.buildReportBase = function (pageInfo) {
        var base = {
            basicAndViewData: {}, //初始加载视图和基础数据
            moduleId: pageInfo.moduleId,
            pageId: null, //后面能获取到
            aliasTables: [], //页面涉及的表别名
            title: null, //页面标题
            currentUserId: session.userId, //当前用户Id
            areaCode: pageInfo.areaCode,
            $pageLang: mabp.localization['Bpm.' + app.language], //系统多语言信息 参考 /App_Start/Localization
            language: app.language, //页面当前语言
            ruleL: _shared.languageSetting.defaultRules[app.language]//静态多语言设置 参考App/_shared/language/languageSetting.js
        };
        return base;
    }

    sv.buildReportForm = function ($scope) {
        var form = {
            $column: [],
            $columnText: [],
            $pageRight: {}, //页面权限
            $pageLang: {}, //页面多语言
            $errors: [], //页面错误信息 // {element, id: , msg:}
            $timeout: $timeout, //页面错误信息 // {element, id: , msg:}
            $watch: function (variable, callbackFunc, deepWatch) { $scope.$watch(variable, callbackFunc, deepWatch); }, //传递watch方法
            $getView: function (dataView, filter, isRefresh, paging, func) {
                sv.initReportTable(dataView, filter, isRefresh, paging, func, form);
            }, //后台获取视图信息
            $openDialog: function (fileName, param, callBack, config) {
                $pageDialog.open(fileName, $scope.base, param, callBack, config);
            },
            $interval: $interval,
            $exportExcel: function (dataView, filter, orderBy, ascending) {
                sv.pagingExport = {};
                sv.pagingExport.orderByProperty = orderBy;
                sv.pagingExport.ascending = ascending || false;
                sv.pagingExport.pageSize = 2147483647;
                sv.pagingExport.currentPage = 1;
                fileSv.downloadView({ code: dataView, filters: mabp.toArray(filter), pageInput: sv.pagingExport }, { responseType: 'blob' });
            },
            $confirm: mabp.message.confirm,//<内容>,<标题>,<回调方法>
            $toast: function (msg) { mabp.notify.error(msg); }
        };
        return form;
    }
    var getModuleEntryPageForReport = _.debounce(function (base, form, $scope, $rootScope) { //获取表单页面信息  
        service.getModuleEntryPage({ moduleId: base.moduleId }).then(function (result) {
            //来自page
            base.html = result.pcHtml;
            base.js = result.pcController;
            base.moduleIdentity = result.moduleIdentity;
            base.fileName = result.fileName;
            base.aliasTables = result.aliasTables;
            base.title = result.pageName;
            base.moduleId = result.moduleId;
            base.pageId = result.id;
            //初始化别名表
            if (base.aliasTables != null) {
                _.forEach(base.aliasTables, function (item) {
                    if (item.isMainTable) {
                        form[item.aliasName] = {};
                    } else {
                        form[item.aliasName] = [];
                    }
                });
            }
            var loader = new mabp.ui.loader('.entire-block');
            loader.start();
            sv.syncTasks(
                //formHelper.getPageRight($scope), //获取页面权限信息，报表没有结点，不需要设置页面结点权限。
                sv.getPageLang($scope), //获取多语言信息
                sv.getUserInfo($scope) //需要获取当前登录用户的信息，当前报表部分不选择岗位，所以JobId的值留空，可以后续加上
            ).then(function () {
                //设置标题
                $rootScope.title = base.title;
                //所有数据加载完成后初始化页面信息
                $timeout(function () {
                    base.currentUserId = session.userId; //顺序没有被严格控制，再刷一次。
                    try {

                        //加载页面的相关信息
                        eval(base.js);

                        //调用后台C#方法
                        function call(method, param, callbackFunc, config) {
                            if (angular.isFunction(callbackFunc))
                                sv.callAsync(base.pageId, method, param, callbackFunc, config);
                            else
                                return sv.callSync(base.pageId, method, param);
                            return null;
                        }

                        //加载js
                        controller(base, form, call);
                        //调用页面初始化加载方法
                        sv.pageLoad(base, form);
                    } catch (e) {
                        mabp.notify.error(e);
                    }
                    //加载html
                    var attachedDom = $compile('<fm-cache>' + base.html + '</fm-cache>')($scope);
                    angular.element('.page_content').html(attachedDom);
                    loader.stop();
                }, 200);
            });
        });
    }, 200);

    //Report问题
    sv.reportStart = function (base, form, $scope, $rootScope) {
        getModuleEntryPageForReport(base, form, $scope, $rootScope);
    }

    //基础数据模块
    //获取表单数据
    sv.initBasicData = function (base, form, code) {
        var dictFilters = [];
        var dictExactFilters = [];
        var dicPages = [];
        _.forEach(base.aliasTables, function (item) {
            dictFilters.push({ key: item.aliasName, value: mabp.toArray(form[item.aliasName].filter) });
            dictExactFilters.push({ key: item.aliasName, value: mabp.toArray(form[item.aliasName].exactFilter) });
            dicPages.push({ key: item.aliasName, page: form[item.aliasName].paging });
        });

        //获取表单数据
        dataService.getFormData({ aliasName: code, pageId: base.pageId, pages: dicPages, dictFilters: dictFilters, dictExactFilters: dictExactFilters }).then(function (data) {
            var tables = JSON.parse(data.datas);
            var totalCounts = JSON.parse(data.totalCounts);
            if (!code) {
                _.forEach(base.aliasTables, function (item) {
                    form[item.aliasName].datas = tables[item.aliasName];
                    form[item.aliasName].paging.totalCount = totalCounts[item.aliasName];
                });
            } else {
                form[code].datas = tables[code];
                form[code].paging.totalCount = totalCounts[code];
            }

        });


        ////获取表单数据
        //dataService.getFormData({ pageId: base.pageId, page: form.paging, nameValues: nameValuesss, exactFilters: exactFiltersss }).then(function (data) {
        //    var tables = JSON.parse(data.datas);
        //    var totalCounts = JSON.parse(data.totalCounts);
        //    debugger;
        //    _.forEach(base.aliasTables, function (item) {
        //        form[item.aliasName] = tables[item.aliasName];
        //        form[item.aliasName].paging.totalCount = totalCounts[item.aliasName];
        //    });
        //    form.paging.totalCount = data.totalCount;
        //});
    }

    //准备新增数据 并执行新增事件 prepaddareBasicDataAndExecute
    sv.prepaddareBasicDataAndExecute = function (m, form) {
        //准备提交参数  
        var formData = { tables: {} };
        _.forEach(base.aliasTables, function (item) {
            formData.tables[item.aliasName] = mabp.toArray(m);
        });

        formData.id = m.id;
        formData.pageId = base.pageId;

        dataService.saveBasicData(formData).then(function () {
            form.$load();
        });
    }

    sv.deleteBasicData = function (m, form) {
        var formData = { tables: {} };
        _.forEach(base.aliasTables, function (item) {
            formData.tables[item.aliasName] = mabp.toArray(m);
        });
        formData.id = m.id;
        formData.pageId = base.pageId;

        dataService.deleteBasicData(formData).then(function () {
            form.$load();
        });
    }

    sv.buildBasicDataBase = function (pageInfo) {
        var base = {
            basicAndViewData: {}, //初始加载视图和基础数据
            moduleId: pageInfo.moduleId,
            pageId: null, //后面带出
            aliasTables: [], //页面涉及的表别名
            title: null, //页面标题
            currentUserId: session.userId, //当前用户Id
            areaCode: pageInfo.areaCode,
            $pageLang: mabp.localization['Bpm.' + app.language], //系统多语言信息 参考 /App_Start/Localization
            language: app.language, //页面当前语言
            ruleL: _shared.languageSetting.defaultRules[app.language],//静态多语言设置 参考App/_shared/language/languageSetting.js
        };
        return base;
    }

    sv.buildBasicDataForm = function ($scope, base) {
        var form = {
            filter: null,
            exactFilter: null,
            $pageSizeList: [5, 10, 20, 50, 100],
            $pageRight: {}, //页面权限
            $pageLang: {}, //页面多语言
            $errors: [], //页面错误信息 // {element, id: , msg:}
            $timeout: $timeout, //页面错误信息 // {element, id: , msg:}
            $watch: function (variable, callbackFunc) { $scope.$watch(variable, callbackFunc); }, //传递watch方法
            $load: function (code) {
                sv.initBasicData(base, form, code);
            },
            $select: function (code) {
                form[code].paging.currentPage = 1;
                sv.initBasicData(base, form, code);
            },
            $clear: function (code) {
                form[code].filter = null;
                form[code].exactFilter = null;
                sv.initBasicData(base, form, code);
            },
            $save: function (item) {
                sv.prepaddareBasicDataAndExecute(item, form);
            },
            $delete: function (item) {
                sv.deleteBasicData(item, form);
            },
            $edit: function (dialogName, item) {
                form.$openDialog(dialogName, item, function (refresh) {
                    if (!!refresh)
                        form.$load();
                });
            },
            $sort: function (col, asc, code) {
                var _asc = form.paging.ascending === "true" ? "ASC" : "DESC";
                form[code].paging.orderByProperty = form[code].paging.orderByProperty + " " + _asc + "," + col;
                form[code].paging.ascending = asc;
                form.$load(code);
            },
            $openDialog: function (fileName, param, callBack, config) {
                $pageDialog.open(fileName, $scope.base, param, callBack, config);
            },
            $confirm: mabp.message.confirm,//<内容>,<标题>,<回调方法>
            $toast: function (msg) { mabp.notify.error(msg); },
            $export: function () {
                sv.downloadBasicData(base, form);
            }
        };
        return form;
    }
    var getModuleEntryPageForBasic = _.debounce(function (base, form, $scope, $rootScope) {
        //获取表单页面信息  
        service.getModuleEntryPage({ moduleId: base.moduleId }).then(function (result) {
            //来自page
            base.html = result.pcHtml;
            base.js = result.pcController;
            base.moduleIdentity = result.moduleIdentity;
            base.fileName = result.fileName;
            base.aliasTables = result.aliasTables;
            base.title = result.pageName;
            base.moduleId = result.moduleId;
            base.pageId = result.id;
            //初始化别名表
            if (base.aliasTables != null) {
                _.forEach(base.aliasTables, function (item) {
                    form[item.aliasName] = [];
                });
            }
            var loader = new mabp.ui.loader('.entire-block');
            loader.start();
            sv.syncTasks(
                //formHelper.getPageRight($scope), //获取页面权限信息
                sv.getPageLang($scope), //获取多语言信息
//                sv.getPageBasicDataAndViewData($scope), //获取业务表基础数据和视图数据
                sv.getUserInfo($scope) //需要获取当前登录用户的信息，当前报表部分不选择岗位，所以JobId的值留空，可以后续加上
            ).then(function () {
                //设置标题
                $rootScope.title = base.title;

                //所有数据加载完成后初始化页面信息
                $timeout(function () {
                    base.currentUserId = session.userId; //顺序没有被严格控制，再刷一次。
                    try {

                        //加载页面的相关信息
                        eval(base.js);

                        //调用后台C#方法
                        function call(method, param, callbackFunc, config) {
                            if (angular.isFunction(callbackFunc))
                                sv.callAsync(base.pageId, method, param, callbackFunc, config);
                            else
                                return sv.callSync(base.pageId, method, param);
                            return null;
                        }

                        //加载js
                        controller(base, form, call);
                        //调用页面初始化加载方法
                        sv.pageLoad(base, form);

                    } catch (e) {
                        mabp.notify.error(e);
                    }
                    //加载html
                    var attachedDom = $compile('<fm-cache>' + base.html + '</fm-cache>')($scope);
                    angular.element('.page_content').html(attachedDom);
                    loader.stop();
                }, 200);
            });
        });
    }, 200);

    sv.basicDataStart = function (base, form, $scope, $rootScope) {
        getModuleEntryPageForBasic(base, form, $scope, $rootScope);
    }

    sv.sessionEndload = function ($rootScope, result) {
        $rootScope.currentUserName = result.userName;
        app.language = result.language;
        $translate.use(result.language);
        mabp.setDefaultLanguage(result.language);
        $rootScope.isSuperAdmin = result.isSuperAdmin;
        $rootScope.$enterpriseName = result.enterpriseName;
        $rootScope.permissions = result.permissions;
    }

    sv.downloadBasicData = function (base, form) {
        var dictFilters = [];
        var dictExactFilters = [];
        var dicPages = [];
        _.forEach(base.aliasTables, function (item) {
            dictFilters.push({ key: item.aliasName, value: mabp.toArray(form[item.aliasName].filter) });
            dictExactFilters.push({ key: item.aliasName, value: mabp.toArray(form[item.aliasName].exactFilter) });
            dicPages.push({ key: item.aliasName, page: form[item.aliasName].paging });
        });
        fileSv.downloadBasicData({ pageId: base.pageId, pages: dicPages, dictFilters: dictFilters, dictExactFilters: dictExactFilters }, { responseType: 'blob' });
    }

    return sv;
}
]);