
function controller(base, form, program) {

    form.$page_load = function () {
        if (base.pageState == 1 && !base.taskId) {
            form.otr01.ecrStatus = "3141d8d3-d682-4b93-8a04-d5928389cbea";
        }
        debugger;
        if (form.$pageRight.meApproval == 'normal') {
            form.$mcOrScrChangeType = (form.otr01.changeType || '').split(',').indexOf('AE4E2014-4D63-43BC-9CF9-5DE05390CB27') >= 0;
            if (!form.$mcOrScrChangeType) {
                form.$mcOrScrChangeType = (form.otr01.changeType || '').split(',').indexOf('238A7CAC-B345-49A8-9B23-4F80F6A6F76D') >= 0;
            }
        }

        if (form.$pageRight.responsiblePersonApproval === 'normal') {
            var jobIds = program("GetUserJobId", { userId: base.currentUserId });
            form.$state.approvalType = _.findIndex(jobIds, { jobId: form.otr01.buyer }) > -1 ? "Buyer" : null;
        }
    }

    form.chooseProj = function (selectItem) {
        if (!!selectItem && selectItem.length > 0) {
            _.filter(selectItem, function (data) {
                //判断是否存在
                var exist = _.findIndex(form.otr01pj, { projectName: data.id }) < 0;
                if (exist) {
                    //不存在push,存在不push
                    form.otr01pj.push({
                        projectName: data.id,
                        projectManager: data.projectManagerJobId,
                        removeCheck: false
                    });
                }
            });

            _.filter(form.otr01pj, function (data) {
                if (!!data) {
                    var exist = _.findIndex(selectItem, { id: data.projectName }) < 0;
                    if (exist) {
                        data.removeCheck = true;
                    }
                }
            });
            _.remove(form.otr01pj, { removeCheck: true });
        }
    }

    form.after_chooseEcr = function () {
        debugger;
        if (!!form.otr01.ecrNo) {
            var data = program('GetSelectedEcr', { ecrNo: form.otr01.ecrNo });

            form.otr01.changeType = data[0].changeType;
            form.otr01.scrRiskLevel = data[0].scrRiskLevel;
            form.otr01.isNotifyCustomer = data[0].isNotifyCustomer;
            form.otr01.changeReason = data[0].changeReason;
            form.otr01.changeDetailDescription = data[0].changeDetailDescription;
            form.otr01.quality = data[0].quality;
            form.otr01.me = data[0].me;
            form.otr01.buyer = data[0].buyer;
            form.otr01.mpl = data[0].mpl;
        }

    }


    form.$watch('form.otr01.ecrNo', function (newvalue, oldvalue) {
        if (base.pageState != 1) return;
        if (newvalue === oldvalue || !newvalue) return;
        _.remove(form.otr01pj, { ecrNo: oldvalue });
        _.remove(form.otr01orp, { ecrNo: oldvalue });
        _.remove(form.otr01cc, { ecrNo: oldvalue });
        _.remove(form.otr01occ, { ecrNo: oldvalue });
        program('GetSelectedProject', { ecrNo: form.otr01.ecrNo }, function (m) {
            debugger;
            if (!!m) {
                _.filter(m, function (mm) {
                    form.otr01pj.push({
                        ecrNo: form.otr01.ecrNo,
                        projectName: mm.projectName,
                        assumedImplementDate: mm.assumedImplementDate,
                        projectManager: mm.projectManager,
                        projectRemark: mm.projectRemark,
                        removeCheck: mm.removeCheck
                    });
                });
                form.projects = _.map(m, 'projectName').join(',');
            }
        });


        program('GetSelectedOtherResponsiblePerson', { ecrNo: form.otr01.ecrNo }, function (m) {
            if (!!m) {
                _.filter(m, function (mm) {
                    form.otr01orp.push({
                        ecrNo: form.otr01.ecrNo,
                        otherResponsiblePerson: mm.otherResponsiblePerson
                    });
                });
            }
        });

        program('GetSelectedChangeContent', { ecrNo: form.otr01.ecrNo }, function (m) {
            debugger;
            if (!!m) {
                _.filter(m, function (mm) {
                    form.otr01cc.push({
                        ecrNo: form.otr01.ecrNo,
                        finishGoodsPN: mm.finishGoodsPN,
                        currentCustomerPN: mm.currentCustomerPN,
                        currentVisteonPN: mm.currentVisteonPN,
                        newCustomerPN: mm.newCustomerPN,
                        newVisteonPN: mm.newVisteonPN,
                        comments: mm.comments,
                        refId: mm.refId
                    });
                    program('GetSelectedOtherChangeContent', { ecrNo: form.otr01.ecrNo, refId: mm.refId }, function (m) {
                        if (!!m) {
                            _.filter(m, function (mm) {
                                form.otr01occ.push({
                                    ecrNo: form.otr01.ecrNo,
                                    operateType: mm.operateType,
                                    symbol: mm.symbol,
                                    oldPN: mm.oldPN,
                                    oldUsage: mm.oldUsage,
                                    oldPrice: mm.oldPrice,
                                    oldCurrency: mm.oldCurrency,
                                    oldAmount: mm.oldAmount,
                                    newPN: mm.newPN,
                                    newUsage: mm.newUsage,
                                    newPrice: mm.newPrice,
                                    newCurrency: mm.newCurrency,
                                    toolingCost: mm.toolingCost,
                                    leadTime: mm.leadTime,
                                    newAmount: mm.newAmount,
                                    changeMethod: mm.changeMethod,
                                    refId: mm.refId
                                });
                            });
                        }
                    });
                });

            }
        });

    });

    form.addOtr01cc = function () {
        var refId = _$.getGUID();
        form.otr01cc.push({
            refId: refId
        });
        form.addOtr01occ(refId);
    }

    form.addOtr01occ = function (refId) {
        form.otr01occ.push({ refId: refId });
    }

    form.deleteOtr01cc = function () {
        var evens = _.remove(form.otr01cc, function (n) {
            return n.checked;
        });

        _.filter(evens, function (data) {
            _.remove(form.otr01occ, { refId: data.refId });
        });

        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }

    form.deleteOtr01occ = function () {
        var evens = _.remove(form.otr01occ, function (n) {
            return n.checked;
        });

        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }

    form.deleteOtr01pj = function () {
        var evens = _.remove(form.otr01pj, function (n) {
            return n.checked;
        });

        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }

    form.deleteOtr01orp = function () {
        var evens = _.remove(form.otr01orp, function (n) {
            return n.checked;
        });

        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }

    form.$event_submit_before = function (context) {
        var change = [];
        if ((form.$state.changeTypeCode || '').split(',').indexOf('1') >= 0) {
            change.push("MC");
        }
        if ((form.$state.changeTypeCode || '').split(',').indexOf('2') >= 0) {
            change.push("SC");
        }
        if ((form.$state.changeTypeCode || '').split(',').indexOf('3') >= 0) {
            change.push("PC");
        }
        if ((form.$state.changeTypeCode || '').split(',').indexOf('4') >= 0) {
            change.push("SCR");
        }
        if ((form.$state.changeTypeCode || '').split(',').indexOf('5') >= 0) {
            change.push("MSC");
        }
        if ((form.$state.changeTypeCode || '').split(',').indexOf('6') >= 0) {
            change.push("OT");
        }
        debugger;
        form.otr01.changTypeCode = change.join(',');

        return context.$continue();
    }

    form.sum = function () {
        _.filter(form.otr01occ, function (data) {
            if (data.operateTypeCode == 'Add' || data.operateTypeCode == 'Change') {
                data.oldAmount = _$.getMultiply(data.oldUsage, data.oldPrice);
                data.newAmount = _$.getMultiply(data.newUsage, data.newPrice);
            }
        });
    }

}