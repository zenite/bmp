
function controller(base, form, program) { 

    form.pageInfo = _shared.initialPage(form, 1, 50, "PartName", false);

    //初始化分页对象及数据
    form.currentPageData = [];
    form.hr04List = [];


    //默认查询条件
    form.filter = {
        ApplicationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
        ApplicationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"
    }

    //加载数据
    form.load = function (isRefresh) {
        $scope.Total = 0;
        ViewName = 'GetHr04DetailReport';
        form.$getView(ViewName, form.filter, isRefresh, form.pageInfo, function (data) {

            form.hr04List = data.viewTable;
            form.table = [];
            form.pageInfo.totalCount = data.totalCount;
            for (var i = 0; i < form.hr04List.length; i++) {
                var obj = {};
                for (var j = 0; j < form.$column.length; j++) {
                    var temp = form.hr04List[i][form.$column[j]];
                    obj[form.$column[j]] = temp;
                }
                debugger;
                var actualhours = 0;
                if (obj['actualOtHours'] == '' || obj['actualOtHours'] == null) {

                    actualhours = 0;
                }
                else {
                    actualhours = parseFloat(obj['actualOtHours'])
                }
                $scope.Total =parseFloat(parseFloat($scope.Total) + actualhours);

                form.table.push(obj);
            }
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
            ApplicationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
            ApplicationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"
        };
        form.load(true);
    }
    //初始化加载数据
    form.load();

 
}