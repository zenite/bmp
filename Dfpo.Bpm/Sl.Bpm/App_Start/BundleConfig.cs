using System.Collections.Generic;
using System.Web.Optimization;

namespace Sl.Bpm
{
    public static class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.IgnoreList.Clear();

            bundles.Add(new StyleBundle("~/syspages/Css") { Orderer = new AsIsBundleOrderer() }
                //zui component start
                .Include("~/Content/Lib/zui/css/zui.css", new CssRewriteUrlTransform())
                .Include("~/Content/Lib/zui/css/zui-theme.css", new CssRewriteUrlTransform())
                //语法高亮
                .Include("~/Content/Lib/component/codeprettify/css/prettify.css")
                .Include("~/Content/Lib/component/codeprettify/css/atelier-dune-light.css")
                //语法高亮
                .Include("~/Content/Lib/zui/lib/datatable/zui.datatable.css", new CssRewriteUrlTransform())
                .Include("~/Content/Lib/zui/lib/datetimepicker/datetimepicker.css", new CssRewriteUrlTransform())
                //zui component end
                .Include("~/Content/Lib/angularjs/angular-strap/angular-strap.min.css", new CssRewriteUrlTransform())
                //.Include("~/Content/Lib/bootstrap-3.3.5/css/bootstrap.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/Lib/pnotify/pnotify.custom.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/Lib/component/tooltip/tooltip.css", new CssRewriteUrlTransform())
                .Include("~/Content/Lib/component/jstree/themes/default/style.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/Lib/component/select2/select2.css", new CssRewriteUrlTransform())
                .Include("~/Content/Lib/trNgGrid/trNgGrid.css", new CssRewriteUrlTransform())
                .Include("~/App/SysPages/Global/app.css", new CssRewriteUrlTransform())
                .IncludeDirectory("~/Content/Lib/miniabp/framework", "*.css", true)
                .IncludeDirectory("~/Content/Lib/miniabp/auto", "*.css", true)
                .IncludeDirectory("~/Content/Lib/miniabp/auto", "*.css", true)
                //组织树相关css
                .Include("~/Content/Lib/org-tree/orgChart.css", new CssRewriteUrlTransform())
                .Include("~/Content/Lib/smartMenu/smartMenu.css", new CssRewriteUrlTransform())
                //组织树相关css
                //设计器相关

                //共享相关
                .IncludeDirectory("~/App/_shared/css", "*.css", true)
                .IncludeDirectory("~/App/SysPages", "*.css", true)

                 //设计器相关
                 .IncludeDirectory("~/App/SysPages/Global", "*.css", true)
                 //延锋电子专用样式
                 .Include("~/AppPages/Css/DefaultPage.css", new CssRewriteUrlTransform()));



            var bundleGlobal = new ScriptBundle("~/syspages/js") { Orderer = new AsIsBundleOrderer() };
            bundleGlobal
                .Include("~/Content/Lib/jquery-1.11.3/jquery-1.11.3.js")
                //charts
                .Include("~/Content/Lib/ECharts/echarts.min.js")
                //语法高亮
                .Include("~/Content/Lib/component/codeprettify/js/prettify.js")
                .Include("~/Content/Lib/component/codeprettify/js/lang-sql.js")
                .Include("~/Content/Lib/component/sheetJs/xlsx.core.min.js")
                //语法高亮
                //zui component start
                .Include("~/Content/Lib/component/tooltip/tooltip.js")
                .Include("~/Content/Lib/zui/js/zui.js", new CssRewriteUrlTransform())
                .Include("~/Content/Lib/zui/lib/datatable/zui.datatable.js")
                //zui component end
                .Include("~/Content/Lib/lodash/lodash-3.10.1.min.js")
                .Include("~/Content/Lib/moment/moment.min.js")
                .Include("~/Content/Lib/angularjs/angular.js")
                .Include("~/Content/Lib/angularjs/angular-translate.js")
                .Include("~/Content/Lib/moment/moment-with-locales.js")
                .Include("~/Content/Lib/moment/moment-timezone-with-data.js")
                .Include("~/Content/Lib/zui/lib/datetimepicker/datetimepicker.js")
                .Include("~/Content/Lib/ng-sortable/Sortable.js")
                .Include("~/Content/Lib/ng-sortable/ng-sortable.js")

                .Include("~/Content/Lib/component/jstree/jstree.min.js")
                .Include("~/Content/Lib/component/select2/select2.js")
                .Include("~/Content/Lib/angularjs/angular-sanitize.min.js")
                .Include("~/Content/Lib/angularjs/angular-ui/angular-ui-router.min.js")
                .Include("~/Content/Lib/angularjs/angular-strap/angular-strap.js")
                .Include("~/Content/Lib/angularjs/angular-strap/angular-strap.tpl.js")
                .Include("~/Content/Lib/angularjs/angular-file-upload.min.js")
                .Include("~/Content/Lib/angularjs/angular-ui/angular-animate.min.js")
                .Include("~/Content/Lib/angularjs/angular-ui/ui-bootstrap.min.js")
                .Include("~/Content/Lib/angularjs/angular-ui/ui-bootstrap-tpls.min.js")
                .Include("~/Content/Lib/angularjs/ocLazyLoad/ocLazyLoad.min.js")
                .Include("~/Content/Lib/component/w5cvalidator/w5cvalidator.js")
                .Include("~/Content/Lib/trNgGrid/trNgGrid.js")
                .Include("~/Content/Lib/pnotify/pnotify.custom.min.js")
                .Include("~/Content/Lib/Backstretch/jquery.backstretch.min.js")
                //组织树相关js
                .Include("~/Content/Lib/smartMenu/jquery-smartMenu.js")
                .Include("~/Content/Lib/requirejs/requirejs-2.1.11.min.js")
                .Include("~/Content/Lib/zrender/zrender.min.js")
                .Include("~/Content/Lib/org-tree/orgChart.js")
                .Include("~/Content/Lib/org-tree/orgChartDirective.js")
                .Include("~/Content/Lib/SimpleExcel/simple-excel.js")
                //设计器相关
                .Include("~/Content/Lib/miniabp/framework/mabp.js")
                .IncludeDirectory("~/Content/Lib/miniabp/framework", "*.js", true)
                .IncludeDirectory("~/Content/Lib/miniabp/auto", "*.js", true)
                .Include("~/App/_shared/shared.js")
                .IncludeDirectory("~/App/_shared", "*.js", true)
                .IncludeDirectory("~/App/_form", "*.js", true)
                .Include("~/App/SysPages/app.js")
                .IncludeDirectory("~/App/SysPages", "*.js", true);

            //设计器引用js
            var designerGlobal = new ScriptBundle("~/SysDesinger/js") { Orderer = new AsIsBundleOrderer() };
            designerGlobal.Include("~/Content/Lib/jquery-1.11.3/jquery-1.11.3.js")
                //zui component start
                .Include("~/Content/Lib/component/tooltip/tooltip.js")
                .Include("~/Content/Lib/zui/js/zui.js", new CssRewriteUrlTransform())
                //zui component end
                .Include("~/Content/Lib/moment/moment.min.js")
                .Include("~/Content/Lib/lodash/lodash-3.10.1.min.js")
                //.Include("~/Content/Lib/bootstrap-3.3.5/bootstrap.min.js")
                .Include("~/Content/Lib/component/select2/select2.js")
                .Include("~/Content/Lib/angularjs/angular.js")
                .Include("~/Content/Lib/angularjs/angular-translate.js")
                .Include("~/Content/Lib/ng-sortable/Sortable.js")
                .Include("~/Content/Lib/ng-sortable/ng-sortable.js")
                .Include("~/Content/Lib/angularjs/angular-sanitize.min.js")
                .Include("~/Content/Lib/angularjs/angular-ui/angular-ui-router.min.js")
                .Include("~/Content/Lib/angularjs/angular-strap/angular-strap.js")
                .Include("~/Content/Lib/angularjs/angular-strap/angular-strap.tpl.js")
                .Include("~/Content/Lib/angularjs/angular-ui/angular-animate.min.js")
                .Include("~/Content/Lib/angularjs/angular-ui/ui-bootstrap.min.js")
                .Include("~/Content/Lib/angularjs/angular-ui/ui-bootstrap-tpls.min.js")
                .Include("~/Content/Lib/angularjs/ocLazyLoad/ocLazyLoad.min.js")
                .Include("~/Content/Lib/pnotify/pnotify.custom.min.js")
                .Include("~/Content/Lib/component/noslider/nouislider.js")
                .Include("~/Content/Lib/component/w5cvalidator/w5cvalidator.js")
                .Include("~/Content/Lib/component/jstree/jstree.min.js")
                .Include("~/Content/Lib/des-lib/des/js/raphael.min.js")
                .Include("~/Content/Lib/requirejs/requirejs-2.1.11.min.js")
                .Include("~/Content/Lib/zrender/zrender.min.js")
                .Include("~/Content/Lib/org-tree/orgChart.js")
                .Include("~/Content/Lib/des-lib/des/js/seajs/sea.js")
                .Include("~/Content/Lib/des-lib/des/js/seajs/seajs-text.js")
                .Include("~/Content/Lib/org-tree/orgChartDirective.js")
                .Include("~/Content/Lib/miniabp/framework/mabp.js")
                .IncludeDirectory("~/Content/Lib/miniabp/framework", "*.js", true)
                .IncludeDirectory("~/Content/Lib/miniabp/auto", "*.js", true)
                .Include("~/App/_shared/shared.js")
                .IncludeDirectory("~/App/_shared", "*.js", true)
                .IncludeDirectory("~/App/_form", "*.js", true)
                .Include("~/App/SysDesigner/app.js")
                .IncludeDirectory("~/App/SysDesigner", "*.js", true);
            //设计器Css
            bundles.Add(new StyleBundle("~/SysDesinger/Css") { Orderer = new AsIsBundleOrderer() }
                .Include("~/App/_shared/css/app.css", new CssRewriteUrlTransform())
                .Include("~/Content/Lib/angularjs/angular-strap/angular-strap.min.css", new CssRewriteUrlTransform())
                .Include("~/Content/Lib/component/tooltip/tooltip.css", new CssRewriteUrlTransform())
                .Include("~/Content/Lib/component/noslider/nouislider.css", new CssRewriteUrlTransform())
                .Include("~/Content/Lib/component/select2/select2.css", new CssRewriteUrlTransform())
                //.Include("~/Content/Lib/bootstrap-3.3.5/css/bootstrap.min.css", new CssRewriteUrlTransform())
                //zui component start
                .Include("~/Content/Lib/zui/css/zui.css", new CssRewriteUrlTransform())
                .Include("~/Content/Lib/zui/css/zui-theme.css", new CssRewriteUrlTransform())
                //zui component end
                .Include("~/Content/Lib/des-lib/des/css/wfd.css", new CssRewriteUrlTransform())
                .Include("~/App/_shared/css/workflowPage.css", new CssRewriteUrlTransform())
                .IncludeDirectory("~/App/SysDesigner/Global", "*.css", true)
                .IncludeDirectory("~/Content/Lib/miniabp/framework", "*.css", true)
                .IncludeDirectory("~/Content/Lib/miniabp/auto", "*.css", true)
                .Include("~/Content/Lib/component/jstree/themes/default/style.min.css", new CssRewriteUrlTransform()));

            //bundles.Add(zuiJs);
            bundles.Add(bundleGlobal);
            bundles.Add(designerGlobal);

        }
        /// <summary>
        /// 按顺序加载
        /// </summary>
        public sealed class AsIsBundleOrderer : IBundleOrderer
        {
            public IEnumerable<BundleFile> OrderFiles(BundleContext context, IEnumerable<BundleFile> files)
            {
                return files;
            }
        }
    }
}