

debugger;
form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);

function controller(base, form, program) {
    // var m = 0;
    form.ReprtQad = function () {
        //   var a = program("ReortPur08", { id: '23132' });
        program('ReortPur08', { taskId: '23132' }, function (data) {
            if (data) {
                alert('导出成功！');
            }
        });
    }
}
form.select = function () {
    form.refreash = !form.refreash;
}

form.$watch('form.currentData', function (newV) {
    if (!!newV) {
        var allSnNumber = $('.purchaseOrder');
        allSnNumber.addClass('link-label');
        allSnNumber.on('click', function () {
            var id = $(this).attr('id');
            var row = _.find(form.scheduleporeport, { id: parseInt(id) });
            window.open("/SysPages/SnNumber?id={0}".fill(row.purchaseOrder));
        });
    }
});

