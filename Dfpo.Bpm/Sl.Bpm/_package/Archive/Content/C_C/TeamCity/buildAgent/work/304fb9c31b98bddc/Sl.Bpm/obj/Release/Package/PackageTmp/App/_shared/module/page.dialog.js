(function () {
    var controllerId = _shared.dialogs.define('$pageDialog', '/App/_shared/module/page.dialog.html');
    _shared.controller(controllerId, ['$scope', 'params', 'mabp.app.workflow', 'mabp.app.data', 'formHelper', '$compile', '$timeout', '$pageDialog',
        function($scope, params, service, dataService, formHelper, $compile, $timeout, $pageDialog) {
            var vm = this;
            var para = params || { pageData: {} };
            var base = $scope.base = {
                basicAndViewData: para.base.basicAndViewData, //初始加载视图和基础数据
                pageId : para.base.pageId, // 弹窗一定是子页面
                parentPageId: para.base.pageId, //父页面的parentId
                fileName: para.base.fileName, //要打开子页面名称
                size: para.base.size || 'md', //默认窗体大小
                js: para.pageData.pcController,
                html: para.pageData.pcHtml,
                title: para.pageData.pageName,
                aliasTables: para.pageData.aliasTables, //页面涉及的表别名
                close: function(data) { $scope.$close(data); }, //关闭当前窗体方法
                $pageLang: mabp.localization['Bpm.' + app.language], //系统多语言信息 参考 /App_Start/Localization
                ruleL: _shared.languageSetting.defaultRules[app.language], //静态多语言设置 参考App/_shared/language/languageSetting.js
                language: app.language, //页面当前语言
                parameter: para.param
            };
            var form = $scope.form = {
                //后台获取视图信息
                $openDialog: function(fileName, param, callBack, config) {
                    $pageDialog.open(fileName, $scope.base, param, callBack, config);
                },
                $save: function (item) {
                    vm.prepaddareBasicDataAndExecute(item);
                },
                $delete: function (item) {
                    vm.delete(item);
                },
                $toast: function(msg) { mabp.notify.error(msg); }
            };
            $timeout(function() {
                //加载页面的相关信息
                eval(base.js);

                function call(method, param, callbackFunc) {
                    if (angular.isFunction(callbackFunc))
                        formHelper.callAsync(base.parentPageId, method, param, callbackFunc);
                    else
                        return formHelper.callSync(base.parentPageId, method, param);
                    return null;
                }

                //加载js
                controller(base, form, call);
                //加载html
                var attachedDom = $compile(base.html)($scope);
                angular.element('._page-dialog').html(attachedDom);
                //调用页面初始化加载方法
                formHelper.pageLoad(base, form);
                vm.isLoaded = true;
                $('.entire-block').css('visibility', 'visible');

            }, 200);

            //准备新增数据 并执行新增事件 prepaddareBasicDataAndExecute
            vm.prepaddareBasicDataAndExecute = function (m) {
                $('.fm-has-error').removeClass('fm-has-error');
                //执行表单验证
                var isValidate = formHelper.validate($scope);
                if (!isValidate) return;

                //准备提交参数  
                var formData = { tables: {} };
                _.forEach(base.aliasTables, function (item) {
                    formData.tables[item.aliasName] = mabp.toArray(m);
                });

                formData.id = m.id;
                formData.pageId = base.pageId;

                dataService.saveBasicData(formData).then(function () {
                    form.$toast('保存成功');
                    base.close(true);
                });
            }

            vm.delete = function (m) {
                var formData = { tables: {} };
                _.forEach(base.aliasTables, function (item) {
                    formData.tables[item.aliasName] = mabp.toArray(m);
                });
                formData.id = m.id;
                formData.pageId = base.pageId;

                dataService.deleteBasicData(formData).then(function () {
                    form.$toast('删除成功');
                    base.close(true);
                });
            }

            //展示提示错误
            base.showErrorControl = function (e) {
                var scrollOffset = $(e.element).offset();
                var blockDom = $(e.element).parents(".entire-block");
                blockDom.animate({
                    scrollTop: blockDom.scrollTop() + scrollOffset.top - 100
                }, 300, "linear", function () {
                    $(e.element).removeClass("fm-has-error");
                    setTimeout(function () {
                        $(e.element).addClass("fm-has-error");
                        setTimeout(function () {
                            $(e.element).removeClass("fm-has-error");
                            setTimeout(function () {
                                $(e.element).addClass("fm-has-error");
                            }, 300);
                        }, 300);
                    }, 300);
                });
            }

        }
    ]);

    _shared.service('$pageDialog', [ 'mabp.app.module','dialog', function(service, dialog) {
            var sv = {};
            sv.open = function (fileName, base, para, callBack, config) {
                base.size = config && config.size;
                service.getSubPage({ parentPageId: base.pageId, moduleId: base.moduleId, fileName: fileName }).then(function(data) {
                    var param = { fileName: fileName, base: base, param: para, pageData: data };
                    param.pageData.pageName = base.titleNew === undefined ? param.pageData.pageName : base.titleNew;
                    dialog.open(_shared.dialogs.$pageDialog, param).then(function (result) {
                        if (callBack) callBack(result);
                    });
                });
            }
            return sv;
        }
    ]);
})();