function controller(base, form, program) {
    form.dialog = base.parameter;

    form.selectPurAccount = function (selectItem) {
        if (!!selectItem[0]) {
            form.dialog.purCostCenter = selectItem[0].costCenter;
        }
    }

    form.selectApAccount= function(selectItem) {
        if (!!selectItem[0]) {
            form.dialog.apCostCenter = selectItem[0].costCenter;
        }
    }

}