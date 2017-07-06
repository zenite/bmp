
function controller(base, form, program) {

    var myDate = new Date();

    //初始化分页对象及数据 
    form.hr01List = [];
    form.paging = _shared.initialPage(form, 1, 50, "EmployeeNumber", false); 
    //默认查询条件
    form.filter = {
        year: myDate.getFullYear() 
    }

    //加载数据
    form.load = function (isRefresh) { 
        $("#DetailHtml").empty()
        $scope.Vacation = 0;
        $scope.UseVacation = 0;
        $scope.LeftVacation = 0;
        form.$getView("Hr01VacationSearch", form.filter, isRefresh, form.paging, function (data) { 
            form.hr01List = data.viewTable;
            form.table = [];
            form.paging.totalCount = data.totalCount;
            for (var i = 0; i < form.hr01List.length; i++) {
                var obj = {};
                for (var j = 0; j < form.$column.length; j++) {
                    var temp = form.hr01List[i][form.$column[j]];
                    obj[form.$column[j]] = temp;
                }
                if (!form.hr01List[i].id) {
                    obj.id = i + 1;
                    form.hr01List[i].id = i + 1;
                } else {
                    obj.id = form.hr01List[i].id;
                }
                if (!obj.status) {
                    obj.status = form.hr01List[i].status;
                } 
                form.table.push(obj);
                $scope.Vacation = parseFloat($scope.Vacation) + parseFloat(obj['vacation']);
                $scope.UseVacation = parseFloat($scope.UseVacation) + parseFloat(obj['useVacation']);
                $scope.LeftVacation = parseFloat($scope.LeftVacation) + parseFloat(obj['canUseLeft']);
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
            year: myDate.getFullYear()
        };
        form.load(false);
    }


    form.$watch('form.currentPageData', function (newV) {
        debugger;
        if (!!newV) {
            for (var i = 0; i < newV.length; i++) {
                var html = '<tr>';
                html = html + '<td style="text-align: left; max-width: 300px"  class="ng-scope" ><span  class="ng-binding">' + newV[i].area + '</span></td>'
                html = html + '<td style="text-align: left; max-width: 300px"  class="ng-scope" ><span  class="ng-binding">' + newV[i].groupName + '</span></td>'
                html = html + '<td style="text-align: left; max-width: 300px"  class="ng-scope" ><span  class="ng-binding">' + newV[i].employeeNumber + '</span></td>'
                html = html + '<td style="text-align: left; max-width: 300px"  class="ng-scope" ><span  class="ng-binding">' + newV[i].applicationName + '</span></td>'
                html = html + '<td style="text-align: left; max-width: 300px"  class="ng-scope" ><span  class="ng-binding">' + newV[i].vacation + '</span></td>'
                html = html + '<td style="text-align: left; max-width: 300px"  class="ng-scope" ><span  class="ng-binding">' + newV[i].companyRemain + '</span></td>'
                html = html + '<td style="text-align: left; max-width: 300px"  class="ng-scope" ><span  class="ng-binding">' + newV[i].canUse + '</span></td>'
                html = html + '<td style="text-align: left; max-width: 300px"  class="ng-scope" ><span  class="ng-binding">' + newV[i].useVacation + '</span></td>'

                var snall = newV[i].sn.split(",")
                var snString="";
                for (var z = 0;z<snall.length;z++){
                    snString = snString + '<a   target="_Blank"  href="/SysPages/SnNumber?id=' + snall[z] + '">' + snall[z] + '</a>' + '<br/>'
                }
                html = html + '<td style="text-align: left; max-width: 300px"  class="ng-scope" ><span  class="ng-binding">' + snString + '</span></td>'
                html = html + '<td style="text-align: left; max-width: 300px"  class="ng-scope" ><span  class="ng-binding">' + newV[i].canUseLeft + '</span></td>'
                html = html + '</tr>';
                $('#DetailHtml').append(html)
 
            }
            //debugger;
            //var allSnNumber = $('.sn');
            //allSnNumber.addClass('link-label');
            //allSnNumber.on('click', function () {
            //    var id = $(this).attr('id');
            //    var row = _.find(newV, { id: id });
            //    window.open("/SysPages/SnNumber?id={0}".fill(row.sn));
            //});
        }
    });




    //初始化加载数据
    form.load();


}