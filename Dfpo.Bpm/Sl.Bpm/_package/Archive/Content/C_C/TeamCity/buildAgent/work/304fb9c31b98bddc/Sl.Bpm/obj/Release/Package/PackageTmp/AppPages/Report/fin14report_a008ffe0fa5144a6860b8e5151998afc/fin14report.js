
function controller(base, form, program) {
    form.page = _shared.initialPage(form, 1, 10, "CostCenter", false);
    form.select = function () {
        form.refreash = !form.refreash;
    }  
    form.procStatusDetails = enums.get("procStatus"); 
    form.clear = function () {
        form.filter = {
            costCenter: null,
            account: null,
            feeDesc: null 
        }
    }
}