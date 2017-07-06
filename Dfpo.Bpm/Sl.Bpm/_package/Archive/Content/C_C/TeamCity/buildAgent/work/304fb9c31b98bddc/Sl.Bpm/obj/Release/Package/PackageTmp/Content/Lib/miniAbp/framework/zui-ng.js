﻿(function () {
    angular.module('mabp')
            .directive('confirmClick', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                scope: {
                    confirmClick: '&'
                },
                link: function (scope, element, attr) {
                    scope.title = attr.title || mabp.L('AreYouSure');
                    scope.content = attr.content || mabp.L('ClickSureForExecute');
                    scope.L = function(key) { return mabp.L(key); }
                    scope.$hide = function () {
                        $(element).popover('hide');
                    }
                    var confirm = scope.confirmClick;
                    scope.$ok = function () {
                        $(element).popover('hide');
                        confirm();
                    }
                    var getContent = function () {
                        var template = '<a class="popover-close-handler icon icon-remove" ng-click="$hide()"></a><div class="row"><div class="col-md-12"><p>{{content}}</p></div><div class="col-md-12"><center><button type="button" class="btn btn-danger btn-block" ng-click="$ok()">{{L("Sure")}}</button></center></div></div>';
                        return $compile(template)(scope);
                    }
                    var cpledTemplate = getContent();
                    $(element).popover(
                           {
                               title: scope.title,
                               content: cpledTemplate,
                               placement: 'bottom',
                               tipClass: 'no-arrow',
                               html: true,
                               template: '<div class="popover"><h3 class="popover-title">{{title}}</h3><div class="popover-content"></div></div>'
                           });
                }
            };
        }]
        ).directive('maPager', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                scope: {
                    currentPage: '=',
                    totalCount: '=',
                    pageSize: '=',
                    load: '&'
                },
                transclude: true,
                template:
                    '<ul class="pager pull-right"> <li class="previous" ng-class="{ false : \'disabled\'}[enableStart]"  ng-click="go(currentPage - 1 )"><a>« 上一页</a></li> ' +
                    '<li ng-repeat="p in pageIndex"  ng-class="{ \'disabled\' :  currentPage == p}" ng-click="go(p)"><a>{{p}}</a></li>' +
                    '<li class="next"  ng-class="{ false : \'disabled\'}[enableEnd]"  ng-click="go(currentPage +1 )"><a>下一页 »</a></li> ' +
                    '</ul>',
                   //'<div class="col-xs-1" style="text-align: left;">' +
                    //'<select class="form-control" ng-change="go(1)" ng-model="pageSize" ng-options="val for val in pageSizeList"></select>' +
                    //'</div>' +
                    //'<div class="col-xs-12" style="text-align: right;">' +
                    //'<div class="col-xs-9">' +
                    //'<span class="control-label" style="vertical-align: top; line-height: 32px;">' +
                    //'总条数：{{totalCount}}&nbsp;' +
                    //'</span> &nbsp;&nbsp;&nbsp;' +
                    //'<ul class="pager pull-right" ng-if="totalCount > pageSize"> <li class="previous" ng-class="{ false : \'disabled\'}[enableStart]"  ng-click="go(currentPage - 1 )"><a>« 上一页</a></li> ' +
                    //'<li ng-repeat="p in pageIndex"  ng-class="{ \'disabled\' :  currentPage == p}" ng-click="go(p)"><a>{{p}}</a></li>' +
                    //'<li class="next"  ng-class="{ false : \'disabled\'}[enableEnd]"  ng-click="go(currentPage +1 )"><a>下一页 »</a></li> ' +
                    //'</ul> &nbsp;' +
                    //'</div>' +
                    //'<div class="col-xs-3" style="display: inherit;">' +
                    //'<div style="display: inline-flex;">' +
                    //    '<span class="control-label" style="vertical-align: top; line-height: 32px;">共 {{totalPage}} 页 &nbsp;&nbsp; </span>' +
                    //    '<div ng-if="totalCount > pageSize">' +
                    //    '<span class="control-label" style="vertical-align: top; line-height: 32px;">跳转到第</span>' +
                    //    '&nbsp;<input style="width: 30px;text-align: center;" ng-model="toPage"/>&nbsp;' +
                    //    '<span class="control-label" style="vertical-align: top; line-height: 32px;">页</span>&nbsp;' +
                    //'<input class="btn btn-sm btn-primary" type="button" value="确定" ng-click="go(toPage)" /> &nbsp;</div>' +
                    //'</div>' +
                    //'</div>' +
                    //'</div>',
                link: function (scope, element, attr) {
                    scope.enableStart = false;
                    scope.enableEnd = false;
                    scope.pageIndex = [];
                    scope.toPage = scope.currentPage;
                    scope.pageSizeList = [5, 10, 20, 50, 100];

                    scope.loadPage = function (currentPage, totalPage) {
                        scope.enableStart = currentPage > 1 && totalPage > 1;
                        scope.enableEnd = currentPage < totalPage && totalPage !== currentPage;
                        var i;
                        if (totalPage < 11 && currentPage < 11) {
                            scope.pageIndex = [];
                            for (i = 1; i < totalPage + 1; i++) {
                                scope.pageIndex.push(i);
                            }
                        }
                        else if (totalPage >= 11 && currentPage < 6) {
                            scope.pageIndex = [];
                            for (i = 1; i < 11; i++) {
                                scope.pageIndex.push(i);
                            }
                        }
                        else if (totalPage >= 11 && currentPage > totalPage - 5) {
                            scope.pageIndex = [totalPage - 9, totalPage - 8, totalPage - 7, totalPage - 6, totalPage - 5, totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
                        }
                        else {
                            scope.pageIndex = [currentPage - 5, currentPage - 4, currentPage - 3, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, currentPage + 3, currentPage + 4]
                        }
                    }
                    scope.go = function (page) {
                        if (scope.currentPage === page || page > scope.totalPage || page < 1) {
                            return;
                        }
                        scope.currentPage = page;
                        $timeout(function () {
                            scope.load();
                        });
                    }

                    scope.$watch("totalCount", function (newValue, oldValue) {
                        if (newValue == null) return;
                        scope.totalPage = Math.ceil(scope.totalCount / scope.pageSize);
                        scope.loadPage(scope.currentPage, scope.totalPage);
                    });
                    scope.$watch("currentPage", function (newValue, oldValue) {
                        if (newValue == null) return;
                        scope.totalPage = Math.ceil(scope.totalCount / scope.pageSize);
                        scope.loadPage(scope.currentPage, scope.totalPage);
                    });
                    scope.$watch("pageSize", function (newValue, oldValue) {
                        if (newValue == null) return;
                        scope.totalPage = Math.ceil(scope.totalCount / scope.pageSize);
                        scope.loadPage(scope.currentPage, scope.totalPage);
                    });
                    scope.loadPage(scope.currentPage, scope.totalPage);
                }
            }
        }]).directive('listPager', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                scope: {
                    currentPage: '=',
                    totalPage: '=',
                    loadData: '&'
                },
                transclude: true,
                template: '<ul class="pager"> <li class="previous" ng-class="{ false : \'disabled\'}[enableStart]"  ng-click="go(currentPage - 1 )"><a>« 上一页</a></li> ' +
                    '<li ng-repeat="p in pageIndex"  ng-class="{ \'disabled\' :  currentPage == p}" ng-click="go(p)"><a>{{p}}</a></li>' +
                    '<li class="next"  ng-class="{ false : \'disabled\'}[enableEnd]"  ng-click="go(currentPage +1 )"><a>下一页 »</a></li> ' +
                    '</ul>',
                link: function (scope, element, attr) {
                    scope.enableStart = false;
                    scope.enableEnd = false;
                    scope.pageIndex = [];
                    scope.loadPage = function (currentPage, totalPage) {
                        scope.enableStart = currentPage > 1 && totalPage > 1;
                        scope.enableEnd = currentPage < totalPage && totalPage !== currentPage;

                        var i;
                        if (totalPage < 11 && currentPage < 11) {
                            scope.pageIndex = [];
                            for (i = 1; i < totalPage + 1; i++) {
                                scope.pageIndex.push(i);
                            }
                        }
                        else if (totalPage >= 11 && currentPage < 6) {
                            scope.pageIndex = [];
                            for (i = 1; i < 11; i++) {
                                scope.pageIndex.push(i);
                            }
                        }
                        else if (totalPage >= 11 && currentPage > totalPage - 5) {
                            scope.pageIndex = [totalPage - 9, totalPage - 8, totalPage - 7, totalPage - 6, totalPage - 5, totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
                        }
                        else {
                            scope.pageIndex = [currentPage - 5, currentPage - 4, currentPage - 3, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, currentPage + 3, currentPage + 4]
                        }
                    }
                    scope.go = function (page) {
                        if (scope.currentPage === page || page > scope.totalPage || page < 1) {
                            return;
                        }
                        scope.currentPage = page;
                        $timeout(function () {
                            scope.loadData();
                        });
                    }

                    scope.$watch("totalPage", function (newValue, oldValue) {
                        if (newValue == null) return;
                        scope.loadPage(scope.currentPage, scope.totalPage);
                    });
                    scope.$watch("currentPage", function (newValue, oldValue) {
                        if (newValue == null) return;
                        scope.loadPage(scope.currentPage, scope.totalPage);
                    });
                    scope.loadPage(scope.currentPage, scope.totalPage);
                }
            }
        }])
    .directive('maListView', function () {
        return {
            restrict: 'E',
            scope: {
                load: '&',
                models: '=',
                paging: '='
            },
            transclude: true,
            template: '<div class="list"> <header> <div class="pull-right"> <div class="btn-group" data-toggle="buttons-radio"> ' +
                '<button type="button" class="btn btn-default" ng-class="{\'list\' :\'blue\'}[activePanel]" ng-click="switch(\'list\')"><i class="icon-th-list"></i></button> ' +
                '<button type="button" class="btn btn-default" ng-class="{\'block\' :\'blue\'}[activePanel]" ng-click="switch(\'block\')"><i class="icon-th"></i></button> </div> </div> <h3><i class="icon-list-ul icon-border-circle"></i> <span class="card-title"><span> <small>{{paging.totalCount}}</small></h3> </header> ' +
                '<section class="cards"> <div class="col-md-12 card-main"> ' +
                '<div class="card-list" ng-hide="activePanel != \'list\'"></div>' +
                '<div class="card-block" ng-hide="activePanel != \'block\'"></div> </div> </section> <footer> ' +
                '<list-pager ng-if="paging.totalCount > paging.pageSize" load-data="loadData()" current-page="paging.currentPage" total-page="paging.totalPage"></list-pager> </footer> <div class="transcluded" ng-transclude></div></div>',
            link: function (scope, element, attr) {
                var titleBlock = element.find('div.card-title');
                var listBlock = element.find('div.card-list');
                var blockBlock = element.find('div.card-block');
                var load = scope.load();
                scope.loadData = load;
                scope.$watch("paging.totalCount", function (newValue, oldValue) {
                    if (newValue == null) {
                        return;
                    }
                    var p = scope.paging;
                    scope.paging.totalPage = Math.ceil(p.totalCount / p.pageSize);
                });
                scope.title = attr.head;
                scope.activePanel = 'block';
                scope.switch = function (panelName) {
                    panelName === 'block' ? (listBlock.hide() && blockBlock.show()) : (blockBlock.hide() && listBlock.show());
                    scope.activePanel = panelName;
                }
                var transcludedBlock = element.find('div.transcluded');
                angular.forEach(transcludedBlock.children(), function (elem) {
                    if (angular.element(elem).hasClass('content-list')) {
                        listBlock.append(elem);
                    } else if (angular.element(elem).hasClass('content-blocker')) {
                        blockBlock.append(elem);
                    } else if (angular.element(elem).hasClass('content-title')) {
                        titleBlock.append(elem);
                    }
                });
                transcludedBlock.remove();
            }
        }
    })
    .directive('listView', function () {
        return {
            restrict: 'E',
            scope: {
                load: '&',
                models: '=',
                paging: '='
            },
            transclude: true,
            template: '<div class="list"> <header> <div class="pull-right"> <div class="btn-group" data-toggle="buttons-radio"> ' +
                '<button type="button" class="btn btn-default" ng-class="{\'list\' :\'blue\'}[activePanel]" ng-click="switch(\'list\')"><i class="icon-th-list"></i></button> ' +
                '<button type="button" class="btn btn-default" ng-class="{\'block\' :\'blue\'}[activePanel]" ng-click="switch(\'block\')"><i class="icon-th"></i></button> </div> </div> <h3><i class="icon-list-ul icon-border-circle"></i> {{ title }} <small>{{paging.totalCount}}</small></h3> </header> ' +
                '<section class="cards"> <div class="col-md-12 card-main"> ' +
                '<div class="card-list" ng-hide="activePanel != \'list\'"></div>' +
                '<div class="card-block" ng-hide="activePanel != \'block\'"></div> </div> </section> <footer> ' +
                '<list-pager ng-if="paging.totalCount > paging.pageSize" load-data="loadData()" current-page="paging.currentPage" total-page="paging.totalPage"></list-pager> </footer> <div class="transcluded" ng-transclude></div></div>',
            link: function (scope, element, attr) {
                var listBlock = element.find('div.card-list');
                var blockBlock = element.find('div.card-block');
                var load = scope.load();
                scope.loadData = load;
                scope.$watch("paging.totalCount", function (newValue, oldValue) {
                    if (newValue == null) {
                        return;
                    }
                    var p = scope.paging;
                    scope.paging.totalPage = Math.ceil(p.totalCount / p.pageSize);
                });
                scope.title = attr.head;
                scope.activePanel = 'block';
                scope.switch = function (panelName) {
                    panelName === 'block' ? (listBlock.hide() && blockBlock.show()) : (blockBlock.hide() && listBlock.show());
                    scope.activePanel = panelName;
                }
                var transcludedBlock = element.find('div.transcluded');
                angular.forEach(transcludedBlock.children(), function (elem) {
                    if (angular.element(elem).hasClass('content-list')) {
                        listBlock.append(elem);
                    } else if (angular.element(elem).hasClass('content-blocker')) {
                        blockBlock.append(elem);
                    }
                });
                transcludedBlock.remove();
            }
        }
    }).directive('maToggler', [
    '$rootScope', '$compile', function(rootScope, $compile) {
        return {
            restrict: "A",
            template: '',
            link: function(scope, element, attr) {
                element.click(function() {
                    angular.element(attr.maToggler).toggleClass("hide-siderbar");
                });
            }
        }
    }
    ]);

})();