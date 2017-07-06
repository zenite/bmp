(function () {
    var controllerId = _shared.dialogs.define('formSelect', '/App/_shared/component/data/form.select.html');
    angular.module('app.shared').controller(controllerId, ['fmTool', 'params', '$scope', 'dialog', 'mabp.app.module',
        function (fmTool, params, $scope, dialog, service) {
            var vm = this;
            vm.params = params;
            vm.model = {};
            vm.valueMember = params.valueMember;
            vm.fmModel = params.selectData || "";
            var reg = /^\d{4}-\d{2}-\d{2}[T]([01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d.\d?\d?\d?$/;
            vm.column = [];
            vm.columnText = [];
            vm.table = [];
            vm.size = params.size;
            vm.displayColumList = [];
            vm.hasSearch = false;


            if (!params.data) {
                if (params.datatype != 'service') {
                    fmTool.getView(vm.params.datacode, vm.params.filter, service, function (data) {
                        vm.displayColumList = data.displayColumList;
                        vm.displayColumListAll = data.displayColumListAll;
                        for (var i = 0; i < data.displayColumListAll.length; i++) {
                            if (data.displayColumListAll[i].isWhereEnable) vm.hasSearch = true;
                        }
                        vm.data = data.viewTable;
                        vm.title = data.viewName;
                        var _obj = {};
                        for (var i = 0; i < data.displayColumList.length; i++) {
                            data.displayColumList[i].displayColumn = data.displayColumList[i].displayColumn.substring(0, 1).toLowerCase() + data.displayColumList[i].displayColumn.substring(1);
                            _obj[data.displayColumList[i].displayColumn] = data.displayColumList[i].name;
                        }
                        var cols = _obj;
                        for (var col in cols) {
                            vm.column.push(col);
                            vm.columnText.push(cols[col]);
                        }

                        /*给table填充数据*/
                        for (var i = 0; i < vm.data.length; i++) {
                            var obj = {};
                            for (var o = 0; o < vm.column.length; o++) {
                                var temp = vm.data[i][vm.column[o]];
                                if (reg.test(temp)) {
                                    temp = moment(temp).format("YYYY-MM-DD");
                                }
                                obj[vm.column[o]] = temp;
                            }
                            if (!vm.data[i].id) {
                                obj.id = i + 1;
                                vm.data[i].id = i + 1;
                            } else {
                                obj.id = vm.data[i].id;
                            }
                            vm.table.push(obj);
                        }
                    });
                } else {
                    service.getMySubbmitterAgent(vm.params).then(function (data) {
                        vm.title = "选择申请人";
                        vm.data = data;
                        vm.valueMember = 'id';
                        var cols = { groupJobName: '岗位', name: '人员' };
                        for (var col in cols) {
                            vm.column.push(col);
                            vm.columnText.push(cols[col]);
                        }

                        /*给table填充数据*/
                        for (var i = 0; i < vm.data.length; i++) {
                            var obj = {};
                            for (var o = 0; o < vm.column.length; o++) {
                                var temp = vm.data[i][vm.column[o]];
                                if (reg.test(temp)) {
                                    temp = moment(temp).format("YYYY-MM-DD");
                                }
                                obj[vm.column[o]] = temp;
                            }
                            if (!vm.data[i].id) {
                                obj.id = i;
                                vm.data[i].id = i + 1;
                            } else {
                                obj.id = vm.data[i].id;
                            }
                            vm.table.push(obj);
                        }


                    });
                }
            } else {
                vm.data = params.data;
                vm.title = vm.params.title;

                var cols = params.column;
                for (var col in cols) {
                    vm.column.push(col);
                    vm.columnText.push(cols[col]);
                }

                /*给table填充数据*/
                for (var i = 0; i < vm.data.length; i++) {
                    var obj = {};
                    for (var o = 0; o < vm.column.length; o++) {
                        var temp = vm.data[i][vm.column[o]];
                        if (reg.test(temp)) {
                            temp = moment(temp).format("YYYY-MM-DD");
                        }
                        obj[vm.column[o]] = temp;
                    }
                    if (!vm.data[i].id) {
                        obj.id = i + 1;
                        vm.data[i].id = "" + (i + 1);
                    } else {
                        obj.id = "" + vm.data[i].id;
                    }
                    vm.table.push(obj);
                }
            }

            vm.pageSizeList = [10, 20, 50, 100];


            vm.ismulti = params.ismulti != "false" && params.ismulti ? true : false;
            vm.table = vm.table || [];
            vm.column = vm.column || [];
            vm.columnText = vm.columnText || [];
            vm.row = [];
            /*分页*/
            vm.showPages = [];
            vm.currentPageIndex = 0;
            vm.currentPageData = [];
            vm.pageNum = 0;
            vm.pageSize = 10;
            /*搜索之后的table*/
            var _tempTable = [];


            vm.save = function () {
                $scope.$close({ items: vm.data, selectItem: vm.fmModel });
            };

            vm.cancel = function () {
                $scope.$close();
            };

            //判断是否已选择
            vm.isCheck = function (item) {
                return !!item ? ((vm.fmModel || "").split(",").indexOf(item[vm.valueMember]) >= 0) : false;
            }

            vm.trCheck = function (item) {
                if (vm.ismulti) {
                    var _ids = !vm.fmModel ? [] : (vm.fmModel || "").split(",");
                    var _index = _ids.indexOf(item[vm.valueMember]);
                    if (_index >= 0) _ids.splice(_index, 1);
                    else _ids.push(item[vm.valueMember]);
                    vm.fmModel = _ids.join(",");
                } else {
                    $scope.$close({ items: vm.data, selectItem: item[vm.valueMember] });
                }
            }

            vm.event_Keydown = function (event) {
                if (event.keyCode == 13) {
                    $scope.loadTableData();
                }
            }

            vm.searchData = function () {
                $scope.loadTableData();
            }

            vm.getShowPages = function () {
                vm.showPages = [];
                for (var i = 0; i <= vm.pageNum - 1; i++) {
                    if (i >= vm.currentPageIndex - 2 && i <= vm.currentPageIndex + 2) {
                        vm.showPages.push({
                            index: i
                        });
                    }
                }
                while (vm.showPages[0].index == 0 && vm.showPages.length < 5 && vm.showPages[vm.showPages.length - 1].index < vm.pageNum - 1) {
                    vm.showPages.push({ index: vm.showPages[vm.showPages.length - 1].index + 1 });
                }
                while (vm.showPages[0].index > 0 && vm.showPages.length < 5 && vm.showPages[vm.showPages.length - 1].index == vm.pageNum - 1) {
                    vm.showPages.splice(0, 0, { index: vm.showPages[0].index - 1 });
                }
            }

            $scope.$watch("vm.table.length", function (oldvalue, newvalue) {
                $scope.loadTableData();
            });

            $scope.loadTableData = function () {
                _tempTable = [];
                if (!!vm.selectTxt) {
                    for (var i = 0; i < vm.table.length; i++) {
                        for (var o = 0; o < vm.column.length; o++) {
                            if (("" + (angular.lowercase(vm.table[i][vm.column[o]]) || "")).indexOf(angular.lowercase(vm.selectTxt)) >= 0) {
                                _tempTable.push(vm.table[i]);
                                break;
                            }
                        }
                    }
                } else {
                    for (var i = 0; i < vm.table.length; i++) {
                        _tempTable.push($.extend({}, vm.table[i]));
                    }
                }
                vm.pageNum = parseInt(_tempTable.length / vm.pageSize);
                if (_tempTable.length % vm.pageSize != 0 && _tempTable.length > vm.pageSize || vm.pageNum == 0) vm.pageNum++;

                vm.getShowPages();
                var _datas = [];
                var _dataStartNum = vm.currentPageIndex * vm.pageSize;
                var _dataEndNum = vm.currentPageIndex * vm.pageSize + vm.pageSize;
                if (_dataEndNum > _tempTable.length) _dataEndNum = _tempTable.length;
                for (var i = _dataStartNum; i < _dataEndNum; i++) {
                    _datas.push(_tempTable[i]);
                }
                vm.currentPageData = _datas;
                vm.currentPageIndex = 0;
            }

            //清空筛选值
            vm.clearCondition = function () {
                var conList = document.querySelectorAll(".search-condition [name]");
                for (var i = 0; i < conList.length; i++) {
                    conList[i].value = "";
                }
                vm.selectCondition();
            }

            //根据多条件搜索
            vm.selectCondition = function () {
                var conditionList = {};
                var conList = document.querySelectorAll(".search-condition [name]");
                for (var i = 0; i < conList.length; i++) {
                    if (!!conList[i].value) {
                        conditionList[conList[i].getAttribute("name")] = conList[i].value;
                    }
                }
                _tempTable = [];
                var istrue = true;
                if (Object.keys(conditionList).length > 0) {
                    for (var i = 0; i < vm.table.length; i++) {
                        istrue = true;
                        for (var con in conditionList) {
                            var con1 = con.lowerFirst();
                            if (("" + (angular.lowercase(vm.data[i][con1]) || "")).indexOf(angular.lowercase(conditionList[con])) < 0) {
                                istrue = false;
                                break;
                            }
                        }
                        if (istrue) _tempTable.push(vm.table[i]);
                    }
                } else {
                    for (var i = 0; i < vm.table.length; i++) {
                        _tempTable.push($.extend({}, vm.table[i]));
                    }
                }
                vm.pageNum = parseInt(_tempTable.length / vm.pageSize);
                if (_tempTable.length % vm.pageSize != 0 && _tempTable.length > vm.pageSize || vm.pageNum == 0) vm.pageNum++;

                vm.getShowPages();
                var _datas = [];
                var _dataStartNum = vm.currentPageIndex * vm.pageSize;
                var _dataEndNum = vm.currentPageIndex * vm.pageSize + vm.pageSize;
                if (_dataEndNum > _tempTable.length) _dataEndNum = _tempTable.length;
                for (var i = _dataStartNum; i < _dataEndNum; i++) {
                    _datas.push(_tempTable[i]);
                }
                vm.currentPageData = _datas;
                vm.currentPageIndex = 0;
            }

            $scope.$watch("vm.pageNum", function (oldvalue, newvalue) {
                vm.getShowPages();
                var _datas = [];
                var _dataStartNum = vm.currentPageIndex * vm.pageSize;
                var _dataEndNum = vm.currentPageIndex * vm.pageSize + vm.pageSize;
                if (_dataEndNum > _tempTable.length) _dataEndNum = _tempTable.length;
                for (var i = _dataStartNum; i < _dataEndNum; i++) {
                    _datas.push(_tempTable[i]);
                }
                vm.currentPageData = _datas;
                vm.currentPageIndex = 0;
            });

            $scope.$watch("vm.pageSize", function (oldvalue, newvalue) {
                vm.pageNum = parseInt(_tempTable.length / vm.pageSize);
                if (_tempTable.length % vm.pageSize != 0 && _tempTable.length > vm.pageSize || vm.pageNum == 0) vm.pageNum++;

                vm.getShowPages();
                var _datas = [];
                var _dataStartNum = vm.currentPageIndex * vm.pageSize;
                var _dataEndNum = vm.currentPageIndex * vm.pageSize + vm.pageSize;
                if (_dataEndNum > _tempTable.length) _dataEndNum = _tempTable.length;
                for (var i = _dataStartNum; i < _dataEndNum; i++) {
                    _datas.push(_tempTable[i]);
                }
                vm.currentPageData = _datas;
            });

            $scope.$watch("vm.currentPageIndex", function (oldvalue, newvalue) {
                vm.getShowPages();
                var _datas = [];
                var _dataStartNum = vm.currentPageIndex * vm.pageSize;
                var _dataEndNum = vm.currentPageIndex * vm.pageSize + vm.pageSize;
                if (_dataEndNum > _tempTable.length) _dataEndNum = _tempTable.length;
                for (var i = _dataStartNum; i < _dataEndNum; i++) {
                    _datas.push(_tempTable[i]);
                }
                vm.currentPageData = _datas;
            });

            vm.changePage = function (index) {
                vm.currentPageIndex = index;
            }

            vm.currentPageIndex = 0;
        }
    ]);
})();