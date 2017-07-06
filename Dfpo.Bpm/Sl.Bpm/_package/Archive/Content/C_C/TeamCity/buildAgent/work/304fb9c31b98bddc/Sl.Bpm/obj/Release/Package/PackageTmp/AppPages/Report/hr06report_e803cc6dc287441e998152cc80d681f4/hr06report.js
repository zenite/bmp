
function controller(base, form, program) {


    form.select = function () {
        form.refreash = !form.refreash;
    }

    form.$watch('form.currentData', function (newV) {
        if (!!newV) {
            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.HR06Report, { id: id });
                debugger;
                window.open("/SysPages/SnNumber?id={0}".fill(row.snNumber));
            });
        }
    });
    form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);
    form.procStatusDetails = enums.get("procStatus");


    form.clear = function () {
        form.filter = {
            applicationTimeEnd: null,
            originalCompany: null,
            applicationTimeStart: null,
            //结束时间
            recruitPosition: null,
            originalDepartment: null,
            newCompany: null
        }
    }
}