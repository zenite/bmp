_shared
/*表单组标题指令*/
.directive('fmGroupHead', [
    '$compile', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            template: function (elem, attr) {
                return '<div class="row fm-group-head">' +
                            '<div class="col-xs-12">' +
                                    '<span class="fm-group-head-ltitle">{{lTitle}}</span>&nbsp;&nbsp;' +
                                    (!!attr.subTitle ? '<span class="fm-group-head-stitle">{{sTitle}}</span>' : '') +
                            '</div><hr />' +
                        '</div>';
            },
            scope: {
                lTitle: '=',
                sTitle: '='
            },
            link: function (scope, element, attr, ctrl) {
                scope.lTitle = attr.title;
                scope.sTitle = attr.subTitle;

                scope.$watch('lTitle', function (newValue, oldValue) {
                    if (!!newValue)
                        scope.lTitle = newValue;
                });
                scope.$watch('sTitle', function (newValue, oldValue) {
                    if (!!newValue)
                        scope.sTitle = newValue;
                });

            }
        }
    }
])