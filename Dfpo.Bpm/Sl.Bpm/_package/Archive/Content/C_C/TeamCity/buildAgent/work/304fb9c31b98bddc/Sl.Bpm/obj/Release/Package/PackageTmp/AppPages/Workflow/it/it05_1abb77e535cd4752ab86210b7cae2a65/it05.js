
function controller(base, form, program) {
    // form.$page_load = function () {
    debugger;
    //     console.log('Start GetAllTypes');
    //     console.log('GetAllTypes');
    //     program('GetAllTypes', { language: base.language }, function (data) {
    //         form.$state.leaveCompany = data;
    //        debugger;
    //    });
    // }
    //获取离职日期
    form.chooseLeaveNo = function (row) {
        debugger;
        if (row[0] != null) {
            form.it05.leaveDate = row[0].terminationDateTime;
            debugger;
        }
    }
}