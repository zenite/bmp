
function controller(base, form, program) {
    debugger;
    form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);
    form.filter = {
        //开始时间
        applicationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
        //结束时间
        applicationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"
    }

    if (base.areaCode === 'YFVIC' || base.areaCode === 'YFVIC' || base.areaCode === 'YFVIC' || base.areaCode === 'YFVIC') {
        form.filter.areaCode = 1;
    } else {
        form.filter.areaCode = base.areaCode;
    }

    form.$watch('form.currentData', function (newV) {
        if (!!newV) {
            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.pur16Report, { id: id });
                window.open("/SysPages/SnNumber?id={0}".fill(row.snNumber));
            });
        }
    });

    form.select = function () {
        form.refreash = !form.refreash;
    }

    form.clear = function () {
        form.filter = {
            //开始时间
            applicationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
            //结束时间
            applicationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"
        }
    }
}