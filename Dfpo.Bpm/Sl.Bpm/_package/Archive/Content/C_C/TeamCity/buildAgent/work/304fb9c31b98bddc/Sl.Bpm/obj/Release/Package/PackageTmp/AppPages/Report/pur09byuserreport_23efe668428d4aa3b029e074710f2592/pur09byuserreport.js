function controller(base, form, program) {
    form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);
    form.select = function () {
        form.refreash = !form.refreash;
    }
    form.$watch('form.currentData', function (newV) {
        debugger;
        if (!!newV) {

            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.pur09byuserreport, { id: id });
                window.open("/SysPages/SnNumber?id={0}".fill(row.id));
            });
        }
    });

    form.clear = function () {
        form.filter = {
            snNumber: null,
            from: null,
            to: null,
            projectCode: null,
            supplierCode: null,
            supplierName: null
        }
    }
}