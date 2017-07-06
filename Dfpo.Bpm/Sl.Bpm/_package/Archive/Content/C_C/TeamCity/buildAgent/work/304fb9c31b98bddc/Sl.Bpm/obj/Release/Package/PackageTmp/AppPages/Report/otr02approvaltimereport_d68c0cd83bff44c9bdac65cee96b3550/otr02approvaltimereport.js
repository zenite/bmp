
function controller(base, form, program) {
    debugger;
    form.filter = {
    }

    form.select = function () {
        form.refreash = !form.refreash;
    }

    form.clear = function () {
        form.filter = {
        }
        form.select();
    }

    form.$watch('form.currentData', function (newV) {
        if (!!newV) {
            debugger;
            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.allOtr02ApprovalTimeReport, { id: id });
                window.open("/SysPages/SnNumber?id={0}".fill(row.snNumber));
            });
        }
    });

    form.pageInfo = _shared.initialPage(form, 1, 10, "CreationTime", false);

}