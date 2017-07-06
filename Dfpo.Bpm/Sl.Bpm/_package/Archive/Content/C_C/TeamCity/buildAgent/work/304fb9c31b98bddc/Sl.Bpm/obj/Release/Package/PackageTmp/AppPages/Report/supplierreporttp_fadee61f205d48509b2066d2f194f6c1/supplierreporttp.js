
function controller(base, form, program) {
    debugger;
    form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);
    form.filter = { areaCode: 'YFVXZ' }//TP 天宝

    form.$watch('form.currentData', function (newV) {
        if (!!newV) {
            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.supplierReport, { id: id });
                window.open("/SysPages/SnNumber?id={0}".fill(row.snNumber));
            });

            var allAddSnNumber = $('.supplierAdditionSnNumber');
            allAddSnNumber.addClass('link-label');
            allAddSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.supplierReport, { id: id });
                window.open("/SysPages/SnNumber?id={0}".fill(row.supplierAdditionSnNumber));
            });
        }
    });
}