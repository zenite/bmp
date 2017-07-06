
function controller(base, form, program) {
    debugger;
    form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);
    form.filter = { areaCode: 'All' }//HQ主报表默认查询所有公司的数据
    //form.$watch('form.currentData', function (newV) {
    //    if (!!newV) {
    //        var allSnNumber = $('.snNumber');
    //        allSnNumber.addClass('link-label');
    //        allSnNumber.on('click', function () {
    //            var id = $(this).attr('id');
    //            var row = _.find(form.Pur07Report, { id: id });
    //            window.open("/SysPages/AppPage?nodeId={0}&pageId={1}&jobId={2}&taskId={3}&procId={4}&draftId={5}&isPrint={6}".fill(
    //                row.wfdWorkflowNodeId,
    //                row.appPageId,
    //                '',
    //                row.id,
    //                '',
    //                ''
    //            ));
    //        });
    //    }
  
    //});



    form.$watch('form.currentData', function (newV) {
        if (!!newV) {
            var allSnNumber = $('.snNumber');
            allSnNumber.addClass('link-label');
            allSnNumber.on('click', function () {
                var id = $(this).attr('id');
                var row = _.find(form.pur07Report, { id: parseInt(id) });
                window.open("/SysPages/SnNumber?id={0}".fill(row.snNumber));
            });
        }
    });
    //导出PDF
    form.PdfReport= function() {


        program('GetPDF', {
            input: "http://localhost:49604/SysPages/AppPage/?nodeId=609af9cd-ad68-478b-a571-51b084a2604a&pageId=50cd9d96-e632-4146-b6ea-298bc9729fe2&taskId=4D7B5BC4-4EFC-4086-B659-92B0DFBC3952&areaCode=YFVIC",
            taskId: "4D7B5BC4-4EFC-4086-B659-92B0DFBC3952"
        }, function (data) {
            if (data) {
                
            }
        });
    }

    //搜索查询
    form.select = function () {
        form.refreash = !form.refreash;
    }

    //重置查询条件
    form.clear = function () {
        form.paging.currentPage = 1;
        form.filter = {
            currency: null,
            supplierCode: null,
            noNumber: null,
            snNumber:null
        };
    }

}