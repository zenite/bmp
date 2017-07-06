function controller(base, form, program) {
    form.paging = _shared.initialPage(form, 1, 10, "SubsidiaryCode", true);
    form.$load();
}