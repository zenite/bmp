

debugger;
form.page = _shared.initialPage(form, 1, 10, "CreationTime", false);

function controller(base, form, program) {

    form.ReprtQad = function () {
        if (form.selectItems.length > 0) {
            var m = 0;
            for (var i = 0; i < form.scheduleporeport.length; i++) {
                var item = form.scheduleporeport[i];
                for (var n = 0; n < form.selectItems.length; n++) {
                    if (form.selectItems[n] === form.scheduleporeport[i]["id"]) {
                      var aa =  program('ReortPur08', {
                            taskId: item.taskId,
                            status: item.status,
                            areaCode: item.areaCode
                      });
                        if (aa) {
                            m++;
                        }
                        break;
                    }
                }
            }
            form.select();
            mabp.notify.warn("共生成" + m + "行！");

        } else {
            mabp.notify.warn("请选择量产PO单！");
        }
    
        
    }
}
    form.select = function () {
        if (!!form.filter.status) {
            if (form.filter.status === '1d91ed8a-5807-4a36-bae0-c111a3d479e8') {
                form.filter.statu = '1';
            } else {
                form.filter.statu = '0';
            }
        }
        if (!!form.filter.areaCode) {
            if (form.filter.areaCode === '7a3b8b17-ce03-4fba-bf90-c236ca5d9769') {
                form.filter.areaCodes = 'YFVIC';
            }
            if (form.filter.areaCode === '802eb6da-1a4b-49b0-b1ef-0b51fcd138a1') {
                form.filter.areaCodes = 'YFVSJ';
            }
        }
        form.refreash = !form.refreash;
    }

form.$watch('form.currentData', function (newV) {
    if (!!newV) {
        var allSnNumber = $('.purchaseOrder');
        allSnNumber.addClass('link-label');
        allSnNumber.on('click', function () {
            var id = $(this).attr('id');
            var row = _.find(form.scheduleporeport, { id: id});
            window.open("/SysPages/SnNumber?id={0}".fill(row.purchaseOrder));
        });
    }
});

