
function controller(base, form, program) {
   // form.$watch('form.$state.expenseSource+base.applicant.groupId', function () {
   //     console.log('connected');
   //     form.refreshOtherType();
   // });
    //获取税率

    form.chooseRate = function (row) {
        if (row[0] != null) {
            form.pur10.rate = row[0].rate;

            form.pur10.rmbtotal = ((form.pur10.totalAmount) * row[0].rate).toFixed(2);
        }
    }
    //计算总金额
    form.getsumRmbTotal = function () {
        form.pur10.rmbtotal = ((form.pur10.totalAmount) * form.pur10.rate).getPrecision(2);
    }
    form.$event_submit_before = function (context) {
        form.pur10.SelectCompany = base.areaCode;
        debugger;
        return context.$continue();
    }
}