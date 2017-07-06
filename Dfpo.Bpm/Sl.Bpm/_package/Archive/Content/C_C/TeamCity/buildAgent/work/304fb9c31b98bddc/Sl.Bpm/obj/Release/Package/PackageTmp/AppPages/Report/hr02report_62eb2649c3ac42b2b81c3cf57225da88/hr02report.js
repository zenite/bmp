
function controller(base, form, program) {

    
    form.pageInfo = _shared.initialPage(form, 1, 50, "PartPerson", false);
    form.filter = {
        procStatus: '',
        //开始时间
        startDate: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
        //结束时间
        endDate: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"
    }
    form.CheckDay = function (data) { 
        var re = /^\d*(\.(5|0))?$/;
        var result = re.test(parseFloat(form.filter.courseDuration));
        if (!result) {
            form.filter.courseDuration = null;
        }
    }

    form.procStatusDetails = enums.get("procStatus");

    form.select = function () {
        form.refreash = !form.refreash;
    }

    form.clear = function () {
        form.filter = {
            procStatus: '',
            //开始时间
            startDate: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
            //结束时间
            endDate: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"
        }
        form.select();
    }


    form.$watch('form.currentData', function (newV) {
        if (!!newV) {
            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.hr02report, { id: id });
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

}