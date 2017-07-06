
function controller(base, form, program) {
    form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);
    form.filter = {
        //开始时间
        requestStartDate: null,
        //结束时间
        requestEndDate: null
    }
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
                var row = _.find(form.pur03report, { id: id });
                if (row.snNumber === '') {
                    return;
                }
                window.open("/SysPages/SnNumber?id={0}".fill(row.id));
            });
        }
    });
   
    form.clear = function () {
        form.filter = {
            projectCode: null,
            supplierCode: null,
            supplierName: null,
            requestType: null,
            //开始时间
            requestStartDate: null,
            //结束时间
            requestEndDate: null
        }
        form.select();
    }
}