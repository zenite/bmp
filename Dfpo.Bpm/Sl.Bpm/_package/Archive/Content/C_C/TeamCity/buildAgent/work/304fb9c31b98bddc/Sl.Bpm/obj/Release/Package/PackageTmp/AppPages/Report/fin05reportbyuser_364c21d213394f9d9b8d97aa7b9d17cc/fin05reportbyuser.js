
function controller(base, form, program) {
    debugger;
    form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);
    form.filter = {
        //开始时间
        applicationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
        //结束时间
        applicationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"
    }

    form.$watch('form.currentData', function (newV) {
        if (!!newV) {
            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.Fin05ReportByUser, { id: id });
                window.open("/SysPages/SnNumber?id={0}".fill(row.snNumber));
            });
            var allPrSnNumber = $('.prSnNumber');
            allPrSnNumber.addClass('link-label');
            allPrSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.Fin05ReportByUser, { id: id });
                window.open("/SysPages/SnNumber?id={0}".fill(row.prSnNumber));
            });

            //合并父表行数据
            var list = [0, 22, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 24, 23];//要合并的列号
            //合并调用此方法
            _shared.mergeTable(0, form.currentData, list);//第一个参数是标示列号，比如SnNumber列，这一列能够作为唯一标识，判断哪些行的子数据属于同一个父
        }
    });

    form.select = function () {
        form.refreash = !form.refreash;
    }

    form.clear = function () {
        form.filter = {
            //开始时间
            applicationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
            //结束时间
            applicationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"
        }
    }
}