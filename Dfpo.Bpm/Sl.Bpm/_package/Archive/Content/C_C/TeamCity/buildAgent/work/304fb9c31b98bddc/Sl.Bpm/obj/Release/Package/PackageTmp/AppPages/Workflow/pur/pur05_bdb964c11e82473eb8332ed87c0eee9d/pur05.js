
function controller(base, form, program) {
    base.areaCode='YFVIC'
    debugger;
    //获取供应商编号
    form.chooseSupplierCode = function (row) {
        debugger;
        if (row[0] != null) {
            form.pur05.supplierCode = row[0].id;
            debugger;
        }
    }
}
