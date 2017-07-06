function controller(base, form, program) {
    form.paging = _shared.initialPage(form, 1, 10, "MailType", true);
    form.$load();

    form.getMpl01ReportPath = function () {
        program('GetMpl01ReportPath', {}, function (data) {
            if (!!data) {
                form.pathValue = data;
            }
        });
    }

    form.getMpl01ReportPath();

    form.saveMpl01ReportPath = function () {
        program('SaveMpl01ReportPath', { value: form.pathValue }, function () {

        });
    }
}