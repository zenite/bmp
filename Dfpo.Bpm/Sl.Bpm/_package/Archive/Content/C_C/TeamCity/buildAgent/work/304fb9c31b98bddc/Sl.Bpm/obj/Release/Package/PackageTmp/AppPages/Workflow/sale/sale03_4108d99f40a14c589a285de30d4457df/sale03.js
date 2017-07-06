
function controller(base, form, program) {
    debugger;
    form.$page_load = function () {
        if (form.sale03.saleOrderType == null) {
            form.sale03.saleOrderType = "5ad5c1ac-5911-41af-9d1b-fd8a13ec2b7c";
        }
    }
    form.sum = function (data) {
        if (form.sale03.expireDay != "" && form.sale03.effectiveDay != "") {
            if (CompareDate(form.sale03.expireDay, form.sale03.effectiveDay)) {
                form.$alert("售价失效日期必须大于售价生效日期");
                form.sale03.expireDay = null;
                form.sale03.effectiveDay = null;
                return;
            }
        };
    }

    //form.$event_submit_before = function (context) {
    //    debugger;
    //    if (form.sale03.expireDay < form.sale03.effectiveDay) {
    //        form.$alert("售价失效日期不能早于售价生效日期");
    //        return false;
    //    } else {
    //        return context.$continue();
    //    }
    //}
    function CompareDate(t1, t2) {
        var strs1 = new Array(); //定义一数组
        strs1 = t1.split("-"); //字符分割
        var strs2 = new Array(); //定义一数组
        strs2 = t2.split("-"); //字符分割
        if (strs1[0] > strs2[0]) { return false; }
        else if (strs1[0] < strs2[0]) { return true; }
        else { }
        if (strs1[1] > strs2[1]) { return false; }
        else if (strs1[1] < strs2[1]) { return true; }
        else { }
        if (strs1[2] > strs2[2]) { return false; }
        else if (strs1[2] < strs2[2]) { return true; }
        else { }
        return true;
    }
}
