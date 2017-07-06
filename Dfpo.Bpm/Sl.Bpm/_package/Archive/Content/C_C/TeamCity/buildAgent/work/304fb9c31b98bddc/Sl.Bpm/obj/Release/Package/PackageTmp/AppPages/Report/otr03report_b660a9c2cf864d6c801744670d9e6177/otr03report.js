
function controller(base, form, program) {
    form.pageInfo = _shared.initialPage(form, 1, 10, "ExternalApplicant", false)
    form.filter = {
        //开始时间
        applicationTimeStart:null,
        //结束时间
        applicationTimeEnd: null
    }
    form.select = function () {
        form.refreash = !form.refreash;
    }

    form.$watch('form.currentData', function (newV) {
        if (!!newV) {
            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.otr03report, { id: id });
                window.open("/SysPages/AppPage?nodeId={0}&pageId={1}&jobId={2}&taskId={3}&procId={4}&draftId={5}&isPrint={6}".fill(
                    row.wfdWorkflowNodeId,
                    row.appPageId,
                    '',
                    row.id,
                    '',
                    ''
                ));
            });
        }
    });

    form.procStatusDetails = enums.get("procStatus");

    form.clearExpenseSource = function () {
        if (form.filter.expenseSourceCode === '1') {
            form.filter.project = null;
        } else {
            form.filter.costCenter = null;
        }
    }

    form.clear = function () {
        form.filter = {
            procStatus: '',
            //开始时间
            applicationTimeStart: null,
            //结束时间
            applicationTimeEnd: null
        }
        form.select();
    }
}