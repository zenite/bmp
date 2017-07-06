_shared.directive('maSiderbar', [
    '$rootScope', '$compile', function (rootScope, $compile) {
        return {
            restrict: "E",
            scope: {
                ngModel: '=',
                activeMenu: '='
            },
            replace: true,
            template: '<nav class="menu" data-toggle="menu" style="width: 200px"><span class="toggler" ma-toggler="{{target}}"></span></nav>',
            link: function (scope, element, attr) {
                scope.target = attr.target;
                var defaultOpen = attr.expend === "true";
                var ul = '<ul class="nav nav-primary">{0}</ul>';
                var li = '<li ng-class="{ active : activeMenu.name == \'{4}\' }" ><a {1}><i class="{0}"></i>{2}</a>{3}</li>';
                var liTopLevel = '<li class="show" ><a {1}><i class="{0}"></i>{2}</a>{3}</li>';
                var sref = 'ui-sref="{0}"';
                var ulchildren = '<ul class="nav">{0}</ul>';
                var navTree = scope.ngModel;

                var cildrenHtml = "";
                function buildNav(nav) {
                    if (nav instanceof Array) {
                        for (var j = 0; j < navTree.length; j++) {
                            if (navTree[j].isDispaly) {
                                cildrenHtml += buildNav(navTree[j]);
                            }
                        }
                        return cildrenHtml;
                    } else {
                        var childrenHtml = "";
                        if (nav.children != null) {
                            var childrenNavList = nav.children;
                            for (var i = 0; i < childrenNavList.length; i++) {
                                if (childrenNavList[i].isDispaly) {
                                    childrenHtml += buildNav(childrenNavList[i]);
                                }
                            }
                        }
                        var srefHtml = nav.defaultState || nav.menu || '';
                        if (srefHtml !== '') {
                            srefHtml = sref.fill(srefHtml);
                        }
                        var childrenUlHtml = (childrenHtml === "") ? "" : ulchildren.fill(childrenHtml);
                        var liHtml = "";
                        if (defaultOpen && childrenUlHtml !== "") {
                            liHtml = liTopLevel.fill(nav.icon, srefHtml, L(nav.displayName), childrenUlHtml);
                        } else {
                            liHtml = li.fill(nav.icon, srefHtml, L(nav.displayName), childrenUlHtml, nav.menu);
                        }
                        return liHtml;
                    }
                }

                buildNav(navTree);
                var totalHtml = ul.fill(cildrenHtml);
                var treeNavDom = $compile(totalHtml)(scope);
                element.append(treeNavDom);
                $(element).menu(element, { auto: true });
            }
        }
    }
])