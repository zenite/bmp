
function controller(base, form, program) {
    debugger;
    //初始化分页对象及数据 
    form.hr04SummaryList = [];
    form.paging = _shared.initialPage(form, 1, 50, "PartWorkNo", false);
   
    //默认查询条件
    form.filter = {
        startDate: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
        endDate: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
        type:'1',
        epNo: '',
        isOffInLieu: '',
        approvestartDate: '',
        approveendDate: '',
    }

    //加载数据
    form.load = function (isRefresh) {
        
        $("#DetailHtml").empty();
        $("#DetailColumn").empty();
        $("#DetailFoot").empty();
        debugger;  
        if (form.filter.type == '1') { 
            var result = program('GetDetail', { EpNo: form.filter.epNo, IsOffInLieu: form.filter.isOffInLieu, StartDate: form.filter.startDate, EndDate: form.filter.endDate, ApprovestartDate: form.filter.approvestartDate, ApproveendDate: form.filter.approveendDate });
            if (result.length > 0) {
                form.table = [];
                form.paging.totalCount = result.length;
                var DetailColumn = '';
                for (var key in result[0]) {
                    DetailColumn = DetailColumn + ' <th style="text-align: left; max-width: 300px;" >' + key + '</th>'
                }
                var html = '';
                debugger;
                var nowpage = form.paging.currentPage
                var everycount = form.paging.pageSize;
                var startindex = (nowpage - 1) * everycount;
                var endinex = nowpage * everycount;
                if (endinex >= form.paging.totalCount) {
                    endinex = form.paging.totalCount
                }
                for (var i = startindex; i < endinex; i++) {
                    var obj = {};
                    html = html + '<tr>';
                    for (var key in result[i]) { 
                        obj[key] = result[i][key];
                        html = html + '<td style="text-align: left; max-width: 300px"  class="ng-scope" ><span  class="ng-binding">' + result[i][key] + '</span></td>'
                    }
                    html = html + '</tr>';
                    form.table.push(obj);
                }
                var footHtml = '<tr>'
                footHtml = footHtml + ' <td colspan="5" style="text-align:left;">  <span>Total</span></td>'
                var index=0;
                for (var key in result[0]) {
                    if(index<5){
                        index++;
                        continue;
                    }
                    var all = 0;
                    for (var i = startindex; i < endinex; i++) {
                        all = all + result[i][key];
                    }
                    footHtml = footHtml + ' <td>  <span>' + all + '</span></td>';
                }
                footHtml = footHtml + '</tr>';

                $("#DetailFoot").append(footHtml);
                $('#DetailHtml').append(html);
                $('#DetailColumn').append(DetailColumn);
                form.currentPageData = form.table;
            }
        }
        else {  
            form.$getView('GetHr04SummaryReport', form.filter, isRefresh, form.paging, function (data) {
                var workday = 0;
                var weekend = 0;
                var holiday = 0;
                var cumulative = 0;
                form.hr04SummaryList = data.viewTable;
                form.table = [];
                form.paging.totalCount = data.totalCount;



                var DetailColumn = '';
                for (var j = 0; j < form.$columnText.length; j++) {
                    DetailColumn = DetailColumn + ' <th style="text-align: left; max-width: 300px;" >' + form.$columnText[j] + '</th>'
                }
                var html = '';
                for (var i = 0; i < form.hr04SummaryList.length; i++) {
                    var obj = {};
                    html = html+'<tr>';
                    for (var j = 0; j < form.$column.length; j++) {
                        var temp = form.hr04SummaryList[i][form.$column[j]];
                        obj[form.$column[j]] = temp;
                        html = html + '<td style="text-align: left; max-width: 300px"  class="ng-scope" ><span  class="ng-binding">' + temp + '</span></td>'
                       
                    }
                    html = html + '</tr>';
                    if (!form.hr04SummaryList[i].id) {
                        obj.id = i + 1;
                        form.hr04SummaryList[i].id = i + 1;
                    } else {
                        obj.id = form.hr04SummaryList[i].id;
                    }
                    if (!obj.status) {
                        obj.status = form.hr04SummaryList[i].status;
                    }

                    workday = parseFloat(workday) + parseFloat(obj['workday']);
                    weekend = parseFloat(weekend) + parseFloat(obj['weekend']);
                    holiday = parseFloat(holiday) + parseFloat(obj['holiday']);
                    cumulative = parseFloat(cumulative) + parseFloat(obj['cumulative']);



                    form.table.push(obj);
                }
                var footHtml = '<tr>';
                footHtml = footHtml + ' <td colspan="4" style="text-align:left;">  <span>Total</span></td>';
                footHtml = footHtml + ' <td>  <span>' + workday + '</span></td>';
                footHtml = footHtml + ' <td>  <span>' + weekend + '</span></td>';
                footHtml = footHtml + ' <td>  <span>' + holiday + '</span></td>';
                footHtml = footHtml + ' <td>  <span>' + cumulative + '</span></td>';
                footHtml = footHtml + '</tr>';

                $("#DetailFoot").append(footHtml);
                $('#DetailHtml').append(html);
                $('#DetailColumn').append(DetailColumn);
                form.currentPageData = form.table;
            });

        }
       
    }

    //搜索查询
    form.select = function () {
        form.paging.currentPage = 1;
        form.load(false);
    }
    //重置查询条件
    form.clear = function () {
        form.filter = {
            startDate: moment(new Date()).startOf('month').format("YYYY-MM-DD") + " 00:00:00",
            endDate: moment(new Date()).endOf('month').format("YYYY-MM-DD") + " 23:59:59",
            type: '1',
            epNo: '',
            isOffInLieu: '',
            approvestartDate: '',
            approveendDate: '',
        };
        form.load(false);
    }

    form.$page_load = function () {
        debugger;
        //初始化加载数据
        form.load(false);
    }
    
    form.outExcel = function () {
        program('DownloadReport', { EpNo: form.filter.epNo, IsOffInLieu: form.filter.isOffInLieu, StartDate: form.filter.startDate, EndDate: form.filter.endDate, ApprovestartDate: form.filter.approvestartDate, ApproveendDate: form.filter.approveendDate }, function () { }, { type: 'file' })
    }

}