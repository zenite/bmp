
function controller(base, form, program) {
    form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);
    form.select = function () {
        form.refreash = !form.refreash;
    }
    form.filter = {
        procStatus: '',
        //开始时间
        applicationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
        //结束时间
        applicationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
    }
    form.$watch('form.currentData', function (newV) {
        if (!!newV) {
            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.Fin09Report, { id: id });
                window.open("/SysPages/SnNumber?id={0}".fill(row.snNumber));
            });
        }
    });

    form.procStatusDetails = enums.get("procStatus");


    form.clear = function () {
        form.filter = {
            procStatus: '',
            //开始时间
            applicationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
            //结束时间
            applicationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
        
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