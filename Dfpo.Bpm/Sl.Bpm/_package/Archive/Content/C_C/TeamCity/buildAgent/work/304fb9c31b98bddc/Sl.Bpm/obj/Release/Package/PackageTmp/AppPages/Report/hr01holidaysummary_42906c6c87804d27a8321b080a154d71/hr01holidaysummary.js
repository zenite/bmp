
function controller(base, form, program) {
    form.cumulative = 0; 
    form.start = true;
    form.page = _shared.initialPage(form, 1, 25, "GroupName", false);
    //初始化分页对象及数据
    form.currentPageData = [];
    form.hr01List = [];
   

    //默认查询条件
    form.filter = {
        LeaveDateFrom: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
        LeaveDateTo: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"
    }

    //加载数据
    form.load = function (isRefresh) {
        var ViewName = "";
        $scope.Lieu = 0;
        $scope.Medical = 0;
        $scope.Vacation = 0;
        $scope.Maternity = 0;
        $scope.Marriage = 0;
        $scope.Bereavement = 0;
        $scope.Family = 0;
        $scope.Total = 0;
        if (form.start == true || (form.filter.EmployeeNumber != '' && form.filter.EmployeeNumber != null) || (form.filter.ApplicationName != '' && form.filter.ApplicationName != null)) {
            ViewName = 'Hr01HolidaySummaryEmp';
            form.show='1'
        }
        else {
            ViewName = 'Hr01HolidaySummaryGroup';
            form.show = '2'
        }
        form.start = false;
        form.$getView(ViewName, form.filter, isRefresh, form.paging, function (data) {

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
                $scope.Lieu = parseFloat($scope.Lieu) + parseFloat(obj['调休']);
                $scope.Medical = parseFloat($scope.Medical) + parseFloat(obj['病假']);
                $scope.Vacation = parseFloat($scope.Vacation) + parseFloat(obj['年假']);
                $scope.Maternity = parseFloat($scope.Maternity) + parseFloat(obj['产假']);
                $scope.Marriage = parseFloat($scope.Marriage) + parseFloat(obj['婚假']);
                $scope.Bereavement = parseFloat($scope.Bereavement) + parseFloat(obj['丧假']);
                $scope.Family = parseFloat($scope.Family) + parseFloat(obj['探亲假']);
                $scope.Total = parseFloat($scope.Total) + parseFloat(obj['total']); 
              
                
                form.table.push(obj);
            } 
            form.currentPageData = form.table;
        });
    }

    //搜索查询
    form.select = function () {
        form.load(false);
    }
    //重置查询条件
    form.clear = function () {
        form.filter = {
            LeaveDateFrom: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
            LeaveDateTo: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59"
        };
        form.load(false);
    }
    //初始化加载数据
    form.load();


}