_shared
    /*数据table*/
.directive('fmTable', [
'mabp.app.module', 'mabp.app.file', 'fmTool', function (service, fileSv, fmTool) {
    return {
        restrict: 'E',
        replace: true,
        template: function (elem, attr) {
            return '<div>' +
                        '<div class="col-xs-12"><button class="btn btn-info btn-sm" ng-if="allColumnFilter && hasSearch" ng-click="show()">过滤条件</button></div>' +
                        '<div class="panel-heading" ng-if="!!show1 && !!allColumnFilter && !!displayColumListAll">' +
                            '<div class="row search-condition">' +
                                '<div class="col-xs-3" ng-repeat="col in displayColumListAll" ng-show="col.isWhereEnable">' +
                                    '<div class="input-group" style="margin-bottom:5px;">' +
                                        '<span class="input-group-addon input-sm">{{col.name}}</span>' +
                                        '<input name="{{col.displayColumn}}" type="text" class="form-control input-sm" placeholder="{{col.name}}">' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div class="col-xs-6">' +
                                    '<input type="button" value="搜索" class="btn btn-block btn-info btn-xs" style="padding: 1px 5px;" ng-click="filterData()" />' +
                                '</div>' +
                                '<div class="col-xs-6">' +
                                    '<input type="button" value="清空" class="btn btn-block btn-default btn-xs" style="padding: 1px 5px;" ng-click="clearCondition()" />' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div id="{{guid}}" class="col-xs-12" style="height:380px;width:100%;overflow:scroll;display: block;">' +
                            '<div style="width:' + (!!attr.width ? attr.width : '100%') + ';">' +
                            '<table class="table table-striped table-hover table-condensed" style="width:100%;">' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th style="width:50px;" ng-if="checkbox"><input class="uniform" type="checkbox" ng-click="checkAll()" ng-checked="isAllChecked" /></th>' +
                                        '<th style="width:50px;" ng-if="radiobox">选择</th>' +
                                        '<th style="text-align: left;max-width:500px;min-width:80px;position: relative;" nowrap="nowrap" ng-repeat="col in columnText track by $index">{{col}}' +
                                            '<i style="position: absolute;top: calc(50% - 11px);" class="icon icon-angle-up" ng-if="page && sortable" ng-click="sort(col,$index,true)"></i>' +
                                            '<i style="position: absolute;top: calc(50% + -2px);" class="icon icon-angle-down" ng-if="page && sortable" ng-click="sort(col,$index,false)"></i>' +
                                        '</th>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody>' +
                                    '<tr ng-repeat="item in currentPageData " ng-class="{ \'active\': item.$checked}" ng-click="checkItem(item)" ng-checked="!item.$checked">' +
                                        '<td style="position:relative;max-width:300px;min-width:50px;" ng-if="checkbox"><input class="uniform" type="checkbox" ng-model="item.$checked"/><div class="checkbox_div"></div></td>' +
                                        '<td style="position:relative;max-width:300px;min-width:50px;" ng-if="radiobox"><input class="uniform" type="radio" name="selectItem" ng-model="item.$checked" value="1"/><div class="checkbox_div"></div></td>' +
                                        '<td id="{{item.id}}" class="{{column[$index]}}" style="vertical-align:middle;max-width:500px;min-width:80px;border-left:1px solid #ddd;border-right:1px solid #ddd;border-bottom:1px solid #ddd" ng-if="$index<column.length" ng-repeat="obj in item">{{obj}}</td>' +
                                    '</tr>' +
                                '</tbody>' +
                            '</table>' +
                        '</div>' +
                        '</div>' +
                        '<div class="col-xs-12">' +
                            '<div class="col-xs-4" style="text-align:left;" >' +
                                '<button ng-if="isExcel || isMergeExcel" class="btn btn-info btn-sm" ng-click="exportExcel()">导出</button>' +
                                '<button ng-if="zip" class="btn btn-info btn-sm" ng-click="exportZip()" style="margin-left:2px;">附件</button>' +
                            '</div>' +
                            '<div ng-if="pageSizeList" class="col-xs-1" style="text-align:left;" >' +
                                '<select class="form-control input-sm" ng-change="changePageSize()" ng-model="paging.pageSize" ng-options="val for val in pageSizeList"></select>' +
                            '</div>' +
                            '<div ng-if="pageSizeList && (isExcel || isMergeExcel)" class="col-xs-2">&nbsp;</div>' +
                            //'<div ng-if="!pageSizeList && isExcel" class="col-xs-5">&nbsp;</div>' +
                            //'<div ng-if="pageSizeList && !isExcel" class="col-xs-5">&nbsp;</div>' +
                            //'<div ng-if="!pageSizeList && !isExcel" class="col-xs-6">&nbsp;</div>' +
                            '<div ng-if="!isExcel && !isMergeExcel && page" class="col-xs-2">&nbsp;</div>' +
                            '<div class="col-xs-10" style="text-align:right;" ng-if="!page">' +
                                '<span class="control-label" style="vertical-align: top;line-height: 32px;">{{ "Count" | translate}}：{{table.length}}</span> &nbsp;&nbsp;&nbsp;' +
                                '<ul class="pager" >' +
                                    '<li class="previous" ng-class="{\'disabled\':currentPageIndex==0}"><a ng-click="changePage(0)">首页</a></li>' +
                                    '<li ng-repeat="page in showPages" ng-class="{\'active\':page.index==currentPageIndex}"><a ng-click="changePage(page.index)">{{page.index+1}}</a></li>' +
                                    '<li class="next" ng-class="{\'disabled\':currentPageIndex==pageNum-1}"><a ng-click="changePage(pageNum-1)">末页</a></li>' +
                                '</ul>' +
                            '</div>' +
                            '<div class="col-xs-7" style="text-align:right;" ng-if="page">' +
                                '<span class="control-label page-count" style="vertical-align: top;line-height: 32px;">{{ "Count" | translate}}：{{paging.totalCount}}</span> &nbsp;&nbsp;&nbsp;' +
                                '<ma-pager ng-if="page && paging.totalCount > 0" current-page="paging.currentPage" load="load(true)" total-count="paging.totalCount" page-size="paging.pageSize"></ma-pager>' +
                            '</div>' +
                            '<div  class="col-xs-3" style="text-align:right;" style="display: inline-flex;" ng-if="page && paging.totalCount > 0">' +
                                    '<span class="control-label" style="vertical-align: top; line-height: 32px;">共 {{pageNum}} 页</span>&nbsp;&nbsp;' +
                                    '<span class="control-label" style="vertical-align: top; line-height: 32px;">跳转到第</span>' +
                                    '&nbsp;<input style="width: 30px;text-align: center;" ng-model="toPage"/>&nbsp;' +
                                    '<span class="control-label" style="vertical-align: top; line-height: 32px;">页</span>&nbsp;' +
                                '<input class="btn btn-sm btn-info" type="button" value="确定" ng-click="changePage(toPage)" /> &nbsp;</div>' +
                            '</div>' +
                    '</div>';
        },
        scope: {
            view: '=',
            data: '=',
            filter: '=',
            refreashData: '=',
            selectItems: '=',
            guid: '=',
            currentPageData: '=',
            excel: '&',
            mergeExcel: '&',
            mergeColumns: '=',
            sumColumns: '=',
            mergeNum: '=',
            zip: '&'
        },
        link: function (scope, element, attr, ctrl) {
            var reg = /^\d{4}-\d{2}-\d{2}[T]([01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d.\d?\d?\d?$/;
            /*分页*/
            scope.showPages = [];
            scope.currentPageIndex = 0;
            scope.currentPageData = [];
            scope.pageNum = 0;
            scope.pageSize = 10;
            var tempTable = [];
            scope.selectItems = [];
            scope.refreash = false;
            scope.guid = _$.getGUID(true);
            scope.column = [];
            scope.columnText = [];
            scope.isExcel = null;
            scope.isMergeExcel = null;
            scope.zip = false;
            scope.page = null;
            scope.paging = {};
            scope.paging.totalCount = 0;
            scope.checkbox = false;
            scope.radiobox = false;
            scope.sortable = false;
            scope.pageSizeList = null;
            scope.isAllChecked = false;
            scope.allColumnFilter = false;
            scope.show1 = false;

            //各种属性判断
            //是否需要导出Excel
            if (scope.excel || attr.excel !== undefined) {
                scope.isExcel = true;
            }

            if (scope.mergeExcel || attr.mergeExcel !== undefined) {
                scope.isMergeExcel = true;
            }
            if (scope.zip || attr.zip !== undefined) {
                scope.zip = true;
            }

            //是否需要真分页和排序
            if (scope.page || attr.page !== undefined) {
                scope.page = true;
                if (!!attr.page) {
                    scope.paging = JSON.parse(attr.page);
                    scope.paging.totalCount = 1;
                    scope.toPage = scope.paging.currentPage;
                }
            }
            //是否需要选择列 多选
            if (scope.checkbox || attr.checkbox !== undefined) {
                scope.checkbox = true;
            }
            //是否需要选择列 单选
            if (scope.radiobox || attr.radiobox !== undefined) {
                scope.radiobox = true;
            }

            //是否需要列自定义排序
            if (scope.sortable || attr.sortable !== undefined) {
                scope.sortable = true;
            }

            //是否需要每页条数切换
            if (scope.pageSizeList || attr.pageSizeList !== undefined) {
                scope.pageSizeList = [10, 20, 50, 100];
            }

            //是否让每个字段都参与过滤
            if (scope.allColumnFilter || attr.allColumnFilter !== undefined) {
                scope.allColumnFilter = true;
            }

            scope.load = function (isRefresh) {
                if (!!attr.view) {
                    scope.condition();
                    if (scope.page) {
                        service.getViewTable({ code: attr.view, filters: mabp.toArray(scope.filter), allColumnFilter: true, tableFilters: mabp.toArray(scope.tableFilters), pageInput: scope.paging }).then(function (data) {
                            if (!!data) {
                                scope.table = [];
                                scope.paging.totalCount = data.totalCount;
                                scope.displayColumList = data.displayColumList;
                                scope.pageNum = parseInt(scope.paging.totalCount / scope.paging.pageSize);
                                if (scope.paging.totalCount % scope.paging.pageSize !== 0 && scope.paging.totalCount > scope.paging.pageSize || scope.pageNum === 0)
                                    scope.pageNum++;

                                scope.data = data.viewTable;
                                if (!isRefresh) {
                                    var _obj = {};
                                    for (var i = 0; i < data.displayColumList.length; i++) {
                                        if (data.displayColumList[i].isDisplayEnable) {
                                            data.displayColumList[i].displayColumn = data.displayColumList[i].displayColumn.substring(0, 1).toLowerCase() + data.displayColumList[i].displayColumn.substring(1);
                                            _obj[data.displayColumList[i].displayColumn] = data.displayColumList[i].name;
                                        }
                                    }
                                    var cols = _obj;
                                    for (var col in cols) {
                                        scope.column.push(col);
                                        scope.columnText.push(cols[col]);
                                    }

                                    scope.displayColumListAll = data.displayColumListAll;
                                    for (var i = 0; i < data.displayColumListAll.length; i++) {
                                        if (data.displayColumListAll[i].isWhereEnable) {
                                            scope.hasSearch = true; break;
                                        }
                                    }
                                }
                                for (var i = 0; i < scope.data.length; i++) {
                                    var obj = {};
                                    for (var j = 0; j < scope.column.length; j++) {
                                        var temp = scope.data[i][scope.column[j]];
                                        if (reg.test(temp)) {
                                            temp = moment(temp).format("YYYY-MM-DD");
                                        }
                                        obj[scope.column[j]] = temp;
                                    }
                                    if (!scope.data[i].id) {
                                        obj.id = i + 1;
                                        scope.data[i].id = i + 1;
                                    } else {
                                        obj.id = scope.data[i].id;
                                    }
                                    scope.table.push(obj);
                                }
                                scope.currentPageData = scope.table;
                            }
                        });
                    } else {
                        service.getViewTable({ code: attr.view, filters: mabp.toArray(scope.filter) }).then(function (data) {
                            if (!!data) {
                                scope.table = [];
                                scope.data = data.viewTable;
                                scope.displayColumList = data.displayColumList;
                                if (!isRefresh) {
                                    var _obj = {};
                                    for (var i = 0; i < data.displayColumList.length; i++) {
                                        if (data.displayColumList[i].isDisplayEnable) {
                                            data.displayColumList[i].displayColumn = data.displayColumList[i].displayColumn.substring(0, 1).toLowerCase() + data.displayColumList[i].displayColumn.substring(1);
                                            _obj[data.displayColumList[i].displayColumn] = data.displayColumList[i].name;
                                        }
                                    }
                                    var cols = _obj;
                                    for (var col in cols) {
                                        scope.column.push(col);
                                        scope.columnText.push(cols[col]);
                                    }

                                    scope.displayColumListAll = data.displayColumListAll;
                                    for (var i = 0; i < data.displayColumListAll.length; i++) {
                                        if (data.displayColumListAll[i].isWhereEnable) {
                                            scope.hasSearch = true; break;
                                        }
                                    }
                                }
                                for (var i = 0; i < scope.data.length; i++) {
                                    var obj = {};
                                    for (var j = 0; j < scope.column.length; j++) {
                                        var temp = scope.data[i][scope.column[j]];
                                        if (reg.test(temp)) {
                                            temp = moment(temp).format("YYYY-MM-DD");
                                        }
                                        obj[scope.column[j]] = temp;
                                    }
                                    if (!scope.data[i].id) {
                                        obj.id = i + 1;
                                        scope.data[i].id = i + 1;
                                    } else {
                                        obj.id = scope.data[i].id;
                                    }
                                    scope.table.push(obj);
                                }

                                tempTable = [];
                                if (!!scope.selectTxt) {
                                    for (var i = 0; i < scope.table.length; i++) {
                                        for (var o = 0; o < scope.column.length; o++) {
                                            if (("" + (scope.table[i][scope.column[o]] || "")).indexOf(scope.selectTxt) >= 0) {
                                                tempTable.push(scope.table[i]);
                                                break;
                                            }
                                        }
                                    }
                                } else {
                                    for (var i = 0; i < scope.table.length; i++) {
                                        tempTable.push($.extend({}, scope.table[i]));
                                    }
                                }

                                scope.pageNum = parseInt(tempTable.length / scope.pageSize);
                                if (tempTable.length % scope.pageSize !== 0 && tempTable.length > scope.pageSize || scope.pageNum === 0) scope.pageNum++;

                                scope.showPages = [];
                                for (var i = 0; i <= scope.pageNum - 1; i++) {
                                    if (i >= scope.currentPageIndex - 2 && i <= scope.currentPageIndex + 2) {
                                        scope.showPages.push({
                                            index: i
                                        });
                                    }
                                }
                                var datas = [];
                                var dataStartNum = scope.currentPageIndex * scope.pageSize;
                                var dataEndNum = scope.currentPageIndex * scope.pageSize + scope.pageSize;
                                if (dataEndNum > tempTable.length) dataEndNum = tempTable.length;
                                for (var i = dataStartNum; i < dataEndNum; i++) {
                                    datas.push(tempTable[i]);
                                }
                                scope.currentPageData = datas;
                                scope.currentPageIndex = 0;
                            }
                        });
                    }

                }
            }

            scope.checkItem = function (v) {
                if (scope.checkbox) {
                    var allSelectedItem = _.filter(scope.currentPageData, { $checked: true });
                    scope.selectItems = _.map(allSelectedItem, 'id');
                    var isAll = _.every(scope.currentPageData, { $checked: true });
                    if (isAll) {
                        scope.isAllChecked = true;
                    } else {
                        scope.isAllChecked = false;
                    }
                }
                if (scope.radiobox || !scope.checkbox) {
                    scope.selectItems = [];
                    _.filter(scope.currentPageData, function (data) {
                        return data.$checked = false;
                    });

                    v.$checked = !v.$checked;
                    var select = _.find(scope.data, { id: v.id });
                    scope.selectItems.push(select);
                }

            }

            scope.checkAll = function () {
                scope.selectItems = [];
                scope.isAllChecked = !scope.isAllChecked;
                _.forEach(scope.currentPageData, function (val) {
                    val.$checked = scope.isAllChecked;
                    if (val.$checked)
                        scope.selectItems.push(val.id);
                });
            }

            scope.changePageSize = function () {
                scope.pageSize = scope.paging.pageSize;
                scope.load(true);
            }

            scope.sort = function (col, index, asc) {
                scope.paging.orderByProperty = scope.column[index];
                scope.paging.Ascending = asc;
                scope.load(true);
            }

            scope.$watch('refreashData', function (newV, oldV) {
                console.log(newV, oldV);
                if (newV !== oldV) {
                    scope.paging.currentPage = 1;
                    scope.filterData();
                }
            }, true);

            scope.$watch("pageNum", function (oldvalue, newvalue) {
                if (!scope.page) {
                    scope.showPages = [];
                    for (var i = 0; i <= scope.pageNum - 1; i++) {
                        if (i >= scope.currentPageIndex - 2 && i <= scope.currentPageIndex + 2) {
                            scope.showPages.push({
                                index: i
                            });
                        }
                    }
                    var datas = [];
                    var dataStartNum = scope.currentPageIndex * scope.pageSize;
                    var dataEndNum = scope.currentPageIndex * scope.pageSize + scope.pageSize;
                    if (dataEndNum > tempTable.length) dataEndNum = tempTable.length;
                    for (var i = dataStartNum; i < dataEndNum; i++) {
                        datas.push(tempTable[i]);
                    }
                    scope.currentPageData = datas;
                    scope.currentPageIndex = 0;
                }
            });

            scope.$watch("pageSize", function (oldvalue, newvalue) {
                if (!scope.page) {
                    scope.pageNum = parseInt(tempTable.length / scope.pageSize);
                    if (tempTable.length % scope.pageSize !== 0 && tempTable.length > scope.pageSize || scope.pageNum === 0) scope.pageNum++;

                    scope.showPages = [];
                    for (var i = 0; i <= scope.pageNum - 1; i++) {
                        if (i >= scope.currentPageIndex - 2 && i <= scope.currentPageIndex + 2) {
                            scope.showPages.push({
                                index: i
                            });
                        }
                    }
                    var datas = [];
                    var dataStartNum = scope.currentPageIndex * scope.pageSize;
                    var dataEndNum = scope.currentPageIndex * scope.pageSize + scope.pageSize;
                    if (dataEndNum > tempTable.length) dataEndNum = tempTable.length;
                    for (var i = dataStartNum; i < dataEndNum; i++) {
                        datas.push(tempTable[i]);
                    }
                    scope.currentPageData = datas;
                }
            });

            scope.$watch("currentPageIndex", function (oldvalue, newvalue) {
                if (!scope.page) {
                    scope.showPages = [];
                    for (var i = 0; i <= scope.pageNum - 1; i++) {
                        if (i >= scope.currentPageIndex - 2 && i <= scope.currentPageIndex + 2) {
                            scope.showPages.push({
                                index: i
                            });
                        }
                    }
                    var datas = [];
                    var dataStartNum = scope.currentPageIndex * scope.pageSize;
                    var dataEndNum = scope.currentPageIndex * scope.pageSize + scope.pageSize;
                    if (dataEndNum > tempTable.length) dataEndNum = tempTable.length;
                    for (var i = dataStartNum; i < dataEndNum; i++) {
                        datas.push(tempTable[i]);
                    }
                    scope.currentPageData = datas;
                    scope.toPage = scope.currentPageIndex;
                }
            });

            scope.changePage = function (index) {
                if (!scope.page) {
                    if (scope.currentPageIndex === index || index > scope.pageNum || index < 1) {
                        scope.toPage = scope.currentPageIndex;
                        return;
                    }
                    scope.currentPageIndex = index;
                } else {
                    if (scope.paging.currentPage === index || index > scope.pageNum || index < 1) {
                        scope.toPage = scope.paging.currentPage;
                        return;
                    }
                    scope.paging.currentPage = index;
                    scope.load(true);
                }
            }

            scope.currentPageIndex = 0;

            scope.exportExcel = function () {
                var query = {};
                if (scope.page) {
                    scope.pagingExport = {};
                    scope.pagingExport.pageSize = 2147483647;
                    scope.pagingExport.currentPage = 1;
                    scope.pagingExport.orderByProperty = scope.paging.orderByProperty;
                    scope.pagingExport.Ascending = scope.paging.Ascending;
                    query = {
                        code: attr.view,
                        filters: mabp.toArray(scope.filter),
                        allColumnFilter: true,
                        tableFilters: mabp.toArray(scope.tableFilters),
                        pageInput: scope.pagingExport
                    };
                } else {
                    query = {
                        code: attr.view,
                        filters: mabp.toArray(scope.filter),
                        allColumnFilter: true,
                        tableFilters: mabp.toArray(scope.tableFilters),
                        pageInput: { pageSize: 2147483647, currentPage: 1, orderByProperty: "Id", Ascending: true }
                    };
                }
                if (attr.excel === "") {
                    fileSv.downloadView(query, { responseType: 'blob' });
                }
                if (attr.mergeExcel === "") {
                    query.value = JSON.stringify(query);
                    query.mergeColumns = scope.mergeColumns || "0";
                    query.sumColumns = scope.sumColumns || null;
                    query.mergeNum = scope.mergeNum || 0;

                    fileSv.downloadMergeExcel(query, { responseType: 'blob' });
                }

            }

            scope.exportZip = function () {
                fileSv.zip(JSON.stringify(scope.selectItems), { responseType: 'blob' });
            }

            scope.filterData = function () {
                if (!scope.page) {
                    scope.filterUnPaged();
                } else {
                    scope.filterPaged();
                }
            }

            scope.filterPaged = function () {
                //scope.condition();
                scope.load(true);
            }

            scope.filterUnPaged = function () {
                var conditionList = {};
                var conList = document.querySelectorAll(".search-condition [name]");
                for (var i = 0; i < conList.length; i++) {
                    if (!!conList[i].value) {
                        conditionList[conList[i].getAttribute("name")] = conList[i].value;
                    }
                }
                var tempTable = [];
                var istrue = true;
                if (Object.keys(conditionList).length > 0) {
                    for (var i = 0; i < scope.data.length; i++) {
                        istrue = true;
                        for (var con in conditionList) {
                            var con1 = con.lowerFirst();
                            if (("" + (angular.lowercase(scope.data[i][con1]) || "")).indexOf(angular.lowercase(conditionList[con])) < 0) {
                                istrue = false;
                                break;
                            }
                        }
                        if (istrue) tempTable.push(scope.table[i]);
                    }
                } else {
                    for (var i = 0; i < scope.data.length; i++) {
                        tempTable.push($.extend({}, scope.table[i]));
                    }
                }
                scope.pageNum = parseInt(tempTable.length / scope.pageSize);
                if (tempTable.length % scope.pageSize !== 0 && tempTable.length > scope.pageSize || scope.pageNum === 0) scope.pageNum++;

                scope.showPages = [];
                for (var i = 0; i <= scope.pageNum - 1; i++) {
                    if (i >= scope.currentPageIndex - 2 && i <= scope.currentPageIndex + 2) {
                        scope.showPages.push({
                            index: i
                        });
                    }
                }
                var datas = [];
                var dataStartNum = scope.currentPageIndex * scope.pageSize;
                var dataEndNum = scope.currentPageIndex * scope.pageSize + scope.pageSize;
                if (dataEndNum > tempTable.length) dataEndNum = tempTable.length;
                for (var i = dataStartNum; i < dataEndNum; i++) {
                    datas.push(tempTable[i]);
                }
                scope.currentPageData = datas;
            }

            scope.condition = function () {
                //拼接自定义过滤参数
                var conditionList = {};
                var conList = document.querySelectorAll(".search-condition [name]");
                for (var i = 0; i < conList.length; i++) {
                    if (!!conList[i].value) {
                        conditionList[conList[i].getAttribute("name")] = conList[i].value;
                    }
                }
                scope.tableFilters = conditionList;
            }

            scope.show = function () {
                scope.show1 = !scope.show1;
            }

            scope.clearCondition = function () {
                var conList = document.querySelectorAll(".search-condition [name]");
                for (var i = 0; i < conList.length; i++) {
                    conList[i].value = "";
                }
                if (!scope.page) {
                    scope.filterUnPaged();
                } else {
                    scope.filterPaged();
                }
            }

            scope.load();
        }
    }
}
]);