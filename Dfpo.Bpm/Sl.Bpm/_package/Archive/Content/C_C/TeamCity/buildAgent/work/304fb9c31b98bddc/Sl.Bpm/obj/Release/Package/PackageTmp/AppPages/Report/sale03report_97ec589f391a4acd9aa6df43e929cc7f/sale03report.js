
function controller(base, form, program) {


    form.select = function () {
        form.refreash = !form.refreash;
    }
    form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);
    form.$watch('form.currentData', function (newV) {
        if (!!newV) {
            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.sale03Report, { id: id });
                debugger;
                window.open("/SysPages/SnNumber?id={0}".fill(row.snNumber));
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
            custormerName: null,

            applicationTimeStart: null,
            //结束时间
            applicationTimeEnd: null,
            customerPn: null,
            factoryPn: null
        }
    }
}