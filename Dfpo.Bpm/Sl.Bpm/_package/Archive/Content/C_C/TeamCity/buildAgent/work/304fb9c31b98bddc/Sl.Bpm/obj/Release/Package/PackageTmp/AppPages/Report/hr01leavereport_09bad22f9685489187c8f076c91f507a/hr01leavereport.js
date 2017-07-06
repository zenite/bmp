
function controller(base, form, program) {
    form.pageInfo = _shared.initialPage(form, 1, 50, "EmployeeNumber", false)

    form.filter = {
        //申请日期
        applicationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",

        applicationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
        ////实际加班日期
        //startDate: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",

        //endDate: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",

        ////审批日期
        //approvestartDate: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",

        //approveendDate: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"
    }


    form.select = function () {
        form.refreash = !form.refreash;
    }

    form.clear = function () {
        form.filter = {
            //申请日期
            applicationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",

            applicationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
            ////实际加班日期
            //startDate: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",

            //endDate: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",

            ////审批日期
            //approvestartDate: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",

            //approveendDate: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"
        }
        form.select();
    }
}