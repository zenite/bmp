
function controller(base, form, program) {
    form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);
    form.$watch('form.currentData', function (newV) {
        if (!!newV) {
            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.Otr04Report, { id: id });
                window.open("/SysPages/AppPage?nodeId={0}&pageId={1}&jobId={2}&taskId={3}&procId={4}&draftId={5}&isPrint={6}".fill(
                    row.wfdWorkflowNodeId,
                    row.appPageId,
                    '',
                    row.id,
                    '',
                    ''
                ));
            });
        }
    });
    form.$page_load = function ()
    {
        form.filter = {
            filetype: '59a4d019-eef3-4187-a5c2-1e0d03d3f3ab'
        }
    }
  
}