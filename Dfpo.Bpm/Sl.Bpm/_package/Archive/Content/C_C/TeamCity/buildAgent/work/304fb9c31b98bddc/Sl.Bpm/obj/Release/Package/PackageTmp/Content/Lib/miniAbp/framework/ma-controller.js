angular.module('mabp')
    .directive('maPanelCommand', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="ma-panel-command text-right" ng-transclude></div>',
            transclude: true
        }
    })
    .directive('maHeader', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="ma-header"><div ng-transclude></div><hr/></div>',
            transclude: true
        };
    })
    //创建面包屑导航
    //ngModel 被选中的值 通常为id
    //items 数据源
    //preItem 再此之前插入固定值
    .directive("maBreadcrumb", ['treeHelper', '$compile', function (treeHelper, $compile) {
        return {
            restrict: 'EA',
            transclude: true,
            template: '<div></div>',
            scope: {
                ngModel: '=',
                items: '=',
                preItem: '=',
                selectedItem:'='
            },
            link: function (scope, element, attr) {
                
                function refreshBreadcrumb() {
                    var groupArray = scope.items;
                    var ngModel = scope.ngModel;
                    var html = [];

                    if (groupArray == null || scope.ngModel == null) {
                        element.html('');
                        return;
                    }
                    var txtStr = attr.textField || 'text';
                    var idStr = attr.idField || 'id';
                    var arr = treeHelper.getBreadcrumb(groupArray, ngModel);
                    if (arr != null && arr.length > 0 && scope.preItem != null) {
                        arr.unshift(scope.preItem);
                    }
                    for (var j = 0; j < arr.length; j++) {
                        html.push("<span ng-click= 'ngModel =\"{0}\"' class='cursor-pointer crumb'>{1}</span>".fill(arr[j][idStr], arr[j][txtStr]));
                    }
                    var totalHtml = _.join(html, ">");
                    element.html($compile(totalHtml)(scope));
                    scope.selectedItem = arr;
                };

                scope.$watch("items", function (newValue, oldValue) {
                    refreshBreadcrumb();
                });
                scope.$watch("ngModel", function (newValue, oldValue, scope) {
                    refreshBreadcrumb();
                });
            }
        }

    }])


;