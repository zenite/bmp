
function controller(base, form, program) {
    debugger;
    form.$page_load = function () {
        if (base.pageState == 1 && !base.taskId) {
            form.otr02.ecrStatus = "3141d8d3-d682-4b93-8a04-d5928389cbea";
            form.addOtr02cc();
        }
        debugger;
        if (form.$pageRight.responsiblePersonApproval === 'normal') {
            var dataItem = null, viewFilter = null, responsibility = null, type = null;
            var jobIds = program("GetUserJobId", { userId: base.currentUserId });

            if (!!form.otr02.pdtl && type == null) {
                type = _.findIndex(jobIds, { jobId: form.otr02.pdtl }) > -1 ? "PDTL" : null;
                dataItem = "Others>ECR>PDTLCheckItem";
                viewFilter = 'DEPT008521VQ,07a667d4-74a1-4f76-a451-55aa99450653,DEPT0061JQXF,DEPT0066CR1G,DEPT006843G1,DEPT0074WKH0,DEPT0084BB60,DEPT008521VQ,DEPT00956J0L,DEPT0096ITS2,DEPT0137Y372';
                responsibility = form.otr02.pdtl;
            }
            if (!!form.otr02.pcba && type == null) {
                type = _.findIndex(jobIds, { jobId: form.otr02.pcba }) > -1 ? "PCBA" : null;
                dataItem = "Others>ECR>PCBACheckItem";
                viewFilter = 'DEPT0007D36C';
                responsibility = form.otr02.pcba;
            }
            if (!!form.otr02.quality && type == null) {
                type = _.findIndex(jobIds, { jobId: form.otr02.quality }) > -1 ? "Quality" : null;
                dataItem = "Others>ECR>QECheckItem";
                viewFilter = 'DEPT0009A0S4';
                responsibility = form.otr02.quality;
            }
            if (!!form.otr02.me && type == null) {
                type = _.findIndex(jobIds, { jobId: form.otr02.me }) > -1 ? "ME" : null;
                dataItem = "Others>ECR>MECheckItem";
                viewFilter = 'DEPT00108M10';
                responsibility = form.otr02.me;
            }
            if (!!form.otr02.sqe && type == null) {
                type = _.findIndex(jobIds, { jobId: form.otr02.sqe }) > -1 ? "SQE" : null;
                dataItem = "Others>ECR>SQECheckItem";
                viewFilter = 'DEPT0009A0S4';
                responsibility = form.otr02.sqe;
            }
            if (!!form.otr02.mpl && type == null) {
                type = _.findIndex(jobIds, { jobId: form.otr02.mpl }) > -1 ? "MPL" : null;
                dataItem = "Others>ECR>MPLCheckItem";
                viewFilter = 'DEPT0008038U';
                responsibility = form.otr02.mpl;
            }
            if (!!form.otr02.buyer && type == null) {
                type = _.findIndex(jobIds, { jobId: form.otr02.buyer }) > -1 ? "Buyer" : null;
                dataItem = "Others>ECR>BuyerCheckItem";
                viewFilter = 'DEPT000536UG,DEPT00996306,DEPT0102AC73,b943b899-a3b7-49a8-a17b-87bae7c0561e,DEPT00752M30';
                responsibility = form.otr02.buyer;
            }
            if (!!form.otr02.ie && type == null) {
                type = _.findIndex(jobIds, { jobId: form.otr02.ie }) > -1 ? "IE" : null;
                dataItem = "Others>ECR>FeasibleOrNotFeasible";
                viewFilter = 'DEPT00355QTU';
                responsibility = form.otr02.ie;
            }
            if (!!form.otr02.test && type == null) {
                type = _.findIndex(jobIds, { jobId: form.otr02.test }) > -1 ? "Test" : null;
                dataItem = "Others>ECR>TesterCheckItem";
                viewFilter = 'DEPT0015Y014';
                responsibility = form.otr02.test;
            }
            //if (!!form.otr02.finance && type == null) {
            //    type = _.findIndex(jobIds, { jobId: form.otr02.finance }) > -1 ? "Finance" : null;
            //    dataItem = "Others>ECR>TesterCheckItem";
            //    viewFilter = 'DEPT0013214R';
            //    responsibility = form.otr02.finance;
            //}

            form.$state.approvalType = type;

            if (!!type && _.findIndex(form.otr02ainfo, { type: type }) < 0) {
                form.addOtr02AInfo(type, dataItem, viewFilter, responsibility);
            }

        }

    }


    form.addOtr02AInfo = function (type, dataItem, viewFilter, responsibility) {
        debugger;
        var refId = _$.getGUID();
        form.otr02ainfo.push({ type: type, refId: refId, dataItem: dataItem, viewFilter: viewFilter, responsibility: responsibility });
        form.otr02infodetail.push({ type: type, refId: refId, responsibility: responsibility });
    }

    form.addOtr02infodetail = function (item) {
        var a = form.otr02infodetail;
        form.otr02infodetail.push({});
        debugger;
    }

    form.addOtr02cc = function () {
        var refId = _$.getGUID();
        form.otr02cc.push({
            refId: refId
        });
        form.addOtr02occ(refId);
    }

    form.addOtr02occ = function (refId) {
        form.otr02occ.push({ refId: refId });
    }

    form.deleteOtr02pj = function () {
        var projects = (form.projects || "").split(",");

        var evens = _.remove(form.otr02pj, function (n) {
            if (n.checked === true) {
                _.remove(projects, function (p) {
                    return p == n.projectName;
                });
            }
            return n.checked;
        });
        form.projects = projects.join(',');

        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }

    form.deleteOtr02cc = function () {
        var evens = _.remove(form.otr02cc, function (n) {
            return n.checked;
        });

        _.filter(evens, function (data) {
            _.remove(form.otr02occ, { refId: data.refId });
        });

        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }

    form.deleteOtr02occ = function () {
        var evens = _.remove(form.otr02occ, function (n) {
            return n.checked;
        });

        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }

    form.deleteOtr02orp = function () {
        var evens = _.remove(form.otr02orp, function (n) {
            return n.checked;
        });

        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }

    form.deleteOtr02infodetail = function () {
        var evens = _.remove(form.otr02infodetail, function (n) {
            return n.checked;
        });

        if (evens.length === 0) {
            mabp.notify.warn("请先勾选删除列");
        }
    }

    form.chooseProj = function (selectItem) {
        if (!!selectItem && selectItem.length > 0) {
            _.filter(selectItem, function (data) {
                //判断是否存在
                var exist = _.findIndex(form.otr02pj, { projectName: data.id }) < 0;
                if (exist) {
                    //不存在push,存在不push
                    form.otr02pj.push({
                        projectName: data.id,
                        projectManager: data.projectManagerJobId,
                        removeCheck: false
                });
                }
            });

            _.filter(form.otr02pj, function (data) {
                if (!!data) {
                    var exist = _.findIndex(selectItem, { id: data.projectName }) < 0;
                    if (exist) {
                        data.removeCheck = true;
                    }
                }
            });
            _.remove(form.otr02pj, { removeCheck: true });
        }
    }

    form.refreshChangeType = function (selectItem, fmModel, fmCode) {
        debugger;
        console.log(fmCode);
        if (base.pageState == 1 && ((fmCode || '').split(',').indexOf('1') >= 0 || (fmCode || '').split(',').indexOf('2') >= 0 || (fmCode || '').split(',').indexOf('4') >= 0 || (fmCode || '').split(',').indexOf('6') >= 0)) {
            form.$state.pdtlChangeType = true;
        } else
            form.$state.pdtlChangeType = false;

        if (base.pageState == 1 && (fmCode || '').split(',').indexOf('1') >= 0 || (fmCode || '').split(',').indexOf('3') >= 0 || (fmCode || '').split(',').indexOf('4') >= 0 || (fmCode || '').split(',').indexOf('5') >= 0 || (fmCode || '').split(',').indexOf('6') >= 0) {
            form.$state.pcbaChangeType = true;
        } else
            form.$state.pcbaChangeType = false;

        if (base.pageState == 1 && ((fmCode || '').split(',').indexOf('1') >= 0 || (fmCode || '').split(',').indexOf('4') >= 0 || (fmCode || '').split(',').indexOf('6') >= 0)) {
            form.$state.sqeChangeType = true;
        } else
            form.$state.sqeChangeType = false;

        if (base.pageState == 1 && ((fmCode || '').split(',').indexOf('1') >= 0 || (fmCode || '').split(',').indexOf('2') >= 0 || (fmCode || '').split(',').indexOf('4') >= 0 || (fmCode || '').split(',').indexOf('5') >= 0 || (fmCode || '').split(',').indexOf('6') >= 0)) {
            form.$state.mplChangeType = true;
        } else
            form.$state.mplChangeType = false;

        if (base.pageState == 1 && ((fmCode || '').split(',').indexOf('1') >= 0 || (fmCode || '').split(',').indexOf('4') >= 0 || (fmCode || '').split(',').indexOf('5') >= 0 || (fmCode || '').split(',').indexOf('6') >= 0)) {
            form.$state.buyerChangeType = true;
        } else
            form.$state.buyerChangeType = false;

        if (base.pageState == 1 && ((fmCode || '').split(',').indexOf('5') >= 0 || (fmCode || '').split(',').indexOf('6') >= 0)) {
            form.$state.ieChangeType = true;
        } else
            form.$state.ieChangeType = false;

        if (base.pageState == 1 && ((fmCode || '').split(',').indexOf('1') >= 0 || (fmCode || '').split(',').indexOf('2') >= 0 || (fmCode || '').split(',').indexOf('5') >= 0 || (fmCode || '').split(',').indexOf('6') >= 0)) {
            form.$state.testChangeType = true;
        } else
            form.$state.testChangeType = false;
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
        form.otr02.changTypeCode = change.join(',');

        if (!form.$state.pdtlChangeType) {
            form.otr02.pdtl = null;
        }
        if (!form.$state.pcbaChangeType) {
            form.otr02.pcba = null;
        }
        if (!form.$state.sqeChangeType) {
            form.otr02.sqe = null;
        }
        if (!form.$state.mplChangeType) {
            form.otr02.mpl = null;
        }
        if (!form.$state.buyerChangeType) {
            form.otr02.buyer = null;
        }
        if (!form.$state.ieChangeType) {
            form.otr02.ie = null;
        }
        if (!form.$state.testChangeType) {
            form.otr02.test = null;
        }

        var notFeasible = _.findIndex(form.otr02ainfo, { isFeasible: '0a92c2de-f8d5-4ed1-8fed-0e279c1fa779' }) > -1;
        if (notFeasible) {
            form.$alert("审批选择了不可行，只能点击否决");
            return false;
        }
        if (form.otr02pj.length <= 0) {
            form.$alert("请至少选择一条项目信息");
            return false;
        }

        return context.$continue();
    }

    form.$event_agree_before = function (context) {
        var notFeasible = _.findIndex(form.otr02ainfo, { isFeasible: '0a92c2de-f8d5-4ed1-8fed-0e279c1fa779' }) > -1;
        if (notFeasible) {
            form.$alert("审批选择了不可行，只能点击否决");
            return false;
        }
        return context.$continue();
    }


    form.sum = function () {
        _.filter(form.otr02occ, function (data) {
            if (data.operateTypeCode == 'Add' || data.operateTypeCode == 'Change') {
                data.oldAmount = _$.getMultiply(data.oldUsage, data.oldPrice);
                data.newAmount = _$.getMultiply(data.newUsage, data.newPrice);
            }
        });
    }

    form.checkUser = function (m) {
        debugger;
        if (base.pageState != 1) return;
        var dataItem = null, viewFilter = null, responsibility = null, type = null;
        if (form.otr02.pdtl == base.applicantJobId) {
            type = "PDTL";
            dataItem = "Others>ECR>PDTLCheckItem";
            viewFilter = 'DEPT008521VQ,07a667d4-74a1-4f76-a451-55aa99450653,DEPT0061JQXF,DEPT0066CR1G,DEPT006843G1,DEPT0074WKH0,DEPT0084BB60,DEPT008521VQ,DEPT00956J0L,DEPT0096ITS2,DEPT0137Y372';
            responsibility = form.otr02.pdtl;
        }
        if (form.otr02.pcba == base.applicantJobId) {
            type = "PCBA";
            dataItem = "Others>ECR>PCBACheckItem";
            viewFilter = 'DEPT0007D36C';
            responsibility = form.otr02.pcba;
        }
        if (form.otr02.quality == base.applicantJobId) {
            type = "Quality";
            dataItem = "Others>ECR>QECheckItem";
            viewFilter = 'DEPT0009A0S4';
            responsibility = form.otr02.quality;
        }
        if (form.otr02.me == base.applicantJobId) {
            type = "me";
            dataItem = "Others>ECR>MECheckItem";
            viewFilter = 'DEPT00108M10';
            responsibility = form.otr02.me;
        }
        if (form.otr02.sqe == base.applicantJobId) {
            type = "SQE";
            dataItem = "Others>ECR>SQECheckItem";
            viewFilter = 'DEPT0009A0S4';
            responsibility = form.otr02.sqe;
        }
        if (form.otr02.mpl == base.applicantJobId) {
            type = "MPL";
            dataItem = "Others>ECR>MPLCheckItem";
            viewFilter = 'DEPT0008038U';
            responsibility = form.otr02.mpl;
        }
        if (form.otr02.buyer == base.applicantJobId) {
            type = "Buyer";
            dataItem = "Others>ECR>BuyerCheckItem";
            viewFilter = 'DEPT000536UG,DEPT00996306,DEPT0102AC73,b943b899-a3b7-49a8-a17b-87bae7c0561e,DEPT00752M30';
            responsibility = form.otr02.buyer;
        }
        if (form.otr02.ie == base.applicantJobId) {
            type = "IE";
            dataItem = "Others>ECR>FeasibleOrNotFeasible";
            viewFilter = 'DEPT00355QTU';
            responsibility = form.otr02.ie;
        }
        if (form.otr02.test == base.applicantJobId) {
            type = "Test";
            dataItem = "Others>ECR>TesterCheckItem";
            viewFilter = 'DEPT0015Y014';
            responsibility = form.otr02.test;
        }
        //if (!!form.otr02.finance == base.applicantJobId) {
        //    type = "Finance";
        //    dataItem = "Others>ECR>TesterCheckItem";
        //    viewFilter = 'DEPT0013214R';
        //    responsibility = form.otr02.finance;
        //}

        form.$state.approvalType = type;

        if (!!type && _.findIndex(form.otr02ainfo, { type: type }) < 0) {
            form.addOtr02AInfo(type, dataItem, viewFilter, responsibility);
        }
        else {
            var isExist = _.findIndex(form.otr02ainfo, { type: m }) > -1;
            if (isExist) {
                _.remove(form.otr02ainfo, { type: m });
                _.remove(form.otr02infodetail, { type: m });
            }
        }
    }


}