function controller(base, form, program) {
    //初始化分页对象及数据
    form.currentPageData = [];
    form.pur10SummaryList = [];
    form.paging = _shared.initialPage(form, 1, 5, "CreationTime", false);

    //默认查询条件
    form.filter = {
        procStatus: '',
        //开始时间
        ApplicationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
        //结束时间
        ApplicationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
    }
    //加载数据
    form.load = function (isRefresh) {
        form.$getView('GetPur10Report', form.filter, isRefresh, form.paging, function (data) {
            $scope.Total = 0;
            $scope.TotalRmb = 0;
            form.pur10SummaryList = data.viewTable;
            form.table = [];
            form.paging.totalCount = data.totalCount;
            for (var i = 0; i < form.pur10SummaryList.length; i++) {
                var obj = {};
                for (var j = 0; j < form.$column.length; j++) {
                    var temp = form.pur10SummaryList[i][form.$column[j]];
                    obj[form.$column[j]] = temp;
                    if (!obj.id)
                    {
                        obj.id = form.pur10SummaryList[i].taskId;

                    }
                }
                //总金额合计
                var totalAmount = 0;
                if (obj['totalAmount'] == '' || obj['totalAmount'] == null) {

                    totalAmount = 0;
                }
                else {
                    totalAmount = parseFloat(obj['totalAmount']);
                }
                $scope.Total = parseFloat(parseFloat($scope.Total) + totalAmount).toFixed(2);
                //人民币合计
                var rmbtotal = 0;
                if (obj['rmbtotal'] == '' || obj['rmbtotal'] == null) {

                    rmbtotal = 0;
                }
                else {
                    rmbtotal = parseFloat(obj['rmbtotal']);
                }
                $scope.TotalRmb = parseFloat(parseFloat($scope.TotalRmb) + rmbtotal).toFixed(2);

                form.table.push(obj);
            }
            debugger;
            form.currentPageData = form.table;
        });
    }

    form.openPage = function(item) {
        debugger;
        if (!!item) {
            var row = _.find(form.pur10SummaryList, { id: item.id });
            window.open("/SysPages/SnNumber?id={0}".fill(row.snNumber));
        };
    }

    //搜索查询
        form.select = function () {
            form.load(true);
        }
        //重置查询条件
        form.clear = function () {
            form.filter = {
                procStatus: '',
                //开始时间
                ApplicationTimeStart: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
                //结束时间
                ApplicationTimeEnd: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
            }
            form.load(true);
        }
        //初始化加载数据
        form.load();
    }