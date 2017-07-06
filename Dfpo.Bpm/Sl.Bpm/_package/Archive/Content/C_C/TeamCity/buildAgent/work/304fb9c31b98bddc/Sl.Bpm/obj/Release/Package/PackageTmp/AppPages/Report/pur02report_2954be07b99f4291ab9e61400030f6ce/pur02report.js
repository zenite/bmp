
function controller(base, form, program) {
    debugger;
    form.filter = {
        procStatus: '',
        //开始时间
        applicationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
        //结束时间
        applicationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
    }
    form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);

    form.select = function () {
        form.refreash = !form.refreash;
    }
    //合并导出并合计
    //合并标识列
   // form.mergeNum = 0;
    //合并列
  //  form.mergeColumns = list.join(',');
    //合计列
  //  form.sumColumns = [18].join(',');

    form.$watch('form.currentData', function (newV) {
        if (!!newV) {
            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.Pur05Report, { id: id });
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
        }
    }
}