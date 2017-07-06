function controller(base, form, program) {
    debugger;
    form.paging = _shared.initialPage(form, 1, 10, "Id", false);
    form.$load();

    form.$page_load=function()
    {
        debugger;
    }

    form.delete= function(item) {
        var isdelete = program("DelectById", { id: item.id });
        if (isdelete) {
            form.$toast("删除成功!");
            form.$delete(item.id);
        }
    }
    //删除全部数据
    form.deleteAll = function (items) {
        var ids = "";
        var itemlength = items.length;
        if (itemlength > 0) {
            for (var i = 0; i < itemlength; i++) {
                if (items[i].checked) {
                    ids += (itemlength > 1 && i === itemlength-1) ? items[i].id : items[i].id + ",";
                }
            }
            if (!!ids) {
                var isdelete = program("DelectById", { id: ids });
                if (isdelete) {

                    form.$toast("删除成功!");
                    form.$delete(ids);
                }
            }
        }
    }
    form.checkAll= function(ischecked,items) {
        if (!!items && items.length > 0) 
            for (var i = 0; i < items.length; i++) {
                items[i].checked = !!ischecked;
            }
    }
}