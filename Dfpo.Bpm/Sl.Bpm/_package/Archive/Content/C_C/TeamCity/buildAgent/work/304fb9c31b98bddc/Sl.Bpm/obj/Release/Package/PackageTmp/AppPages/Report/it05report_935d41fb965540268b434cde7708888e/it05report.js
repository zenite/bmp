
function controller(base, form, program) {
    form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);
    form.select = function () {
        form.refreash = !form.refreash;
    }

    form.$watch('form.currentData', function (newV) {
        if (!!newV) {
            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.IT05Report, { id: id });
                window.open("/SysPages/SnNumber?id={0}".fill(row.snNumber));
            });
        }
    });

    form.procStatusDetails = enums.get("procStatus");


    form.clear = function () {
        form.filter = {
            snNumber: null,

            applyName: null,
            //结束时间
            applyEmployeeNumber: null,
            groupName: null,
            changeType: null,
            fixAssetId: null,
            oldChiefEngineer: null,
            oldDepartment: null,
            oldLocation: null,
            chiefEngineer: null,
            department: null,
            location: null,
            applicationTimeStart: null,
            applicationTimeEnd: null,
            equipmentNo: null
        }
    }
}