
function controller(base, form, program) {
    form.pageInfo = _shared.initialPage(form, 1, 10, "CreationTime", false);

    form.$watch('form.currentData', function (newV) {
        if (!!newV) {
            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.pur18report, { id: id });
                debugger;
                window.open("/SysPages/SnNumber?id={0}".fill(row.snNumber));
            });
        }
    });

    form.filter = {
        //开始时间
        applicationTimeStart: null,
        //结束时间
        applicationTimeEnd: null
    }

    form.select = function () {
        form.refreash = !form.refreash;
    }

    form.procStatusDetails = enums.get("procStatus");

    form.clear = function () {
        form.filter = {
            procStatus: '',
            //开始时间
            applicationTimeStart: null,
            //结束时间
            applicationTimeEnd: null
        }
    }
}