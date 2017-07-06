
function controller(base, form, program) {  

    //初始化分页对象及数据
    form.currentPageData = [];
    form.hr01List = [];

    form.paging = _shared.initialPage(form, 1, 25, "EmployeeNumber", false);

    //默认查询条件
    form.filter = { 
    }

    //加载数据
    form.load = function (isRefresh) { 
        $scope.Total = 0;

        form.$getView("Hr01OffinLieu", form.filter, isRefresh, form.paging, function (data) {
            form.hr01List = data.viewTable;
            form.table = [];
            form.paging.totalCount = data.totalCount;
            for (var i = 0; i < form.hr01List.length; i++) {
                var obj = {};
                for (var j = 0; j < form.$column.length; j++) {
                    var temp = form.hr01List[i][form.$column[j]];
                    obj[form.$column[j]] = temp;
                }
                //if (!form.hr01List[i].id) {
                //    obj.id = i + 1;
                //    form.hr01List[i].id = i + 1;
                //} else {
                //    obj.id = form.hr01List[i].id;
                //}
                //if (!obj.status) {
                //    obj.status = form.hr01List[i].status;
                //}
                debugger
                $scope.Total =$scope.Total + obj['canUseDay'];


                form.table.push(obj);
            }
            $scope.Total = $scope.Total.toFixed(2)
            form.currentPageData = form.table;
        });
    }

    //搜索查询
    form.select = function () {
        form.load(true);
    }
    //重置查询条件
    form.clear = function () {
        form.filter = { 
        };
        form.load(true);
    }
    //初始化加载数据
    form.load();


}