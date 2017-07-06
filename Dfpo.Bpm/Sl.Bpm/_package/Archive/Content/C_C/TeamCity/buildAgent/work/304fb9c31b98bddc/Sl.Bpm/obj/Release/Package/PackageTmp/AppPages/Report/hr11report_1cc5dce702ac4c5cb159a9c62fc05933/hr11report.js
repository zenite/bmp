
function controller(base, form, program) {

    form.filter = {
        //开始时间
        applicationTimeStarts: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
        //结束时间
        applicationTimeEnds: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"
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
                var row = _.find(form.hr11report, { id: id });
                debugger;
                window.open("/SysPages/SnNumber?id={0}".fill(row.snNumber));
            });
        }
    });
    form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);
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
            company: null,

            applicationTimeStarts: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
            //结束时间
            applicationTimeEnds: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
            groups: null,
            jobPosition: null,
            positionResult: null,
            parentGroupName: null,
            knowSkillTrainingResult: null,
            state:null
        }
    }
}