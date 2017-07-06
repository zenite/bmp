
function controller(base, form, program) {
    debugger;
    form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);
    form.filter = { areaCode :'All'}//HQ主报表默认查询所有公司的数据

    //if (base.areaCode === 'YFVIC' || base.areaCode === 'YFVIC' || base.areaCode === 'YFVIC' || base.areaCode === 'YFVIC') {
    //    form.filter.areaCode = 1;
    //} else {
    //    form.filter.areaCode = base.areaCode;
    //}

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