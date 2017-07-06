var _shared = {};
//获取多语言值
function L(key) {
    var lan = app.language || currentLanguage;
    return mabp.localization['Bpm.' + lan][key];
}

(function () {
    _shared = angular.module('app.shared', ['mabp', 'mabp.orgChart']);
    _shared.dialogs = {};
    _shared.factory('appSession', ['mabp.app.system', 'mabp.app.permission',
        function (service, permissionService) {
            var session = {
                userId: null,
                nickName: null,
                userName: null,
                language: null,
                emailAddress: null,
                permissions: {},
                endLoad: function () { }
            };
            permissionService.getUserPermissions().then(function (permissions) {
                session.permissions = permissions;
//                console.table(permissions);
                service.getUserInfo().then(function (result) {
                    if (!!result) {
                        session.userName = result.name;
                        session.userId = result.id;
                        session.nickName = result.nickName;
                        session.language = result.language;
                        session.isSuperAdmin = result.isSuperAdmin;
                        session.telephone = result.telephone;
                        session.emailAddress = result.emailAddress;
                        app.language = session.language = result.language;
                        app.enterpriseName = session.enterpriseName = result.enterpriseName;
                        session.endLoad(session);
                    }
                });
            });
            return session;
        }
    ]);
    //验证框架配置
    _shared.config(["w5cValidatorProvider", function (w5cValidatorProvider) {
        // 全局配置
        w5cValidatorProvider.config({
            blurTrig: true,
            showError: function (element, errors) {
                $(element).maTips({ type: 'error', content: errors[0], isalways: true });
                //mabp.notify.error(errors[0]);
            },
            removeError: function (element) {
                $(element).maTips_close();
            }
        });
        var rules = {
            required: "该选项不能为空",
            maxlength: "该选项输入值长度不能大于{maxlength}",
            minlength: "该选项输入值长度不能小于{minlength}",
            email: "输入邮件的格式不正确",
            repeat: "两次输入不一致",
            pattern: "该选项输入格式不正确",
            number: "必须输入数字",
            w5cuniquecheck: "该输入值已经存在，请重新输入",
            url: "输入URL格式不正确",
            max: "该选项输入值不能大于{max}",
            min: "该选项输入值不能小于{min}",
            customizer: "自定义验证不通过"

        }
        w5cValidatorProvider.setDefaultRules(rules);
        w5cValidatorProvider.setRules({
            nickname: {
                pattern: "必须输入字母、数字、下划线,以字母开头"
            },
            password: {
                required: "密码不能为空",
                minlength: "密码长度不能小于{minlength}",
                pattern: "密码必须且只能包含字母和数字,长度不能小于6位"
            }
        });

    }]);
    //初始化分页对象
    _shared.initialPage = function (vm, currentPage, pageSize, orderByProperty, ascending) {
        var pageParam = {
            currentPage: currentPage || 1,
            pageSize: pageSize || 8,
            orderByProperty: orderByProperty || 'Id',
            Ascending: ascending || false,
            totalPage: 1
        }
        if (vm.paging != null)
            pageParam = angular.extend({}, vm.paging, pageParam);
        vm.paging = pageParam;
        return pageParam;
    }

    //选择处理人框
    _shared.directive("maNodeSelect", ['mabp.app.system', '$stateParams', 'dialog', function (service, stateParams, dialog) {
        return {
            restrict: 'E',
            replace: true,
            template: function (elem, attr) {
                return '<div class="input-group ma-node-select">' +
                        '<span class="input-group-addon">' + attr["title"] + '</span>' +
                        '<div class="input-group-btn fix-border">' +
                          //'<button type="button" class="btn btn-default" tabindex="-1">' + attr["title"] + '</button>' +
                          '<button type="button" class="btn btn-default dropdown-toggle {{disabled?\'\':\'dropdown-disabled\'}}" data-toggle="{{disabled?\'dropdown\':\'\'}}" tabindex="-1"><span style="vertical-align:middle;margin-right:10px;line-height:14px;">{{typeText||"请选择"}}</span>' +
                          '</button>' +
                          '<ul class="dropdown-menu pull-right" role="menu"><li ng-repeat="item in items" ng-mousedown="itemClick(item)"><a>{{item.text}}</a></li></ul>' +//<li ng-mousedown="itemClick({text:\"-1\",value:\"请选择\"})"><a>请选择</a></li><li class="divider"></li>
                        '</div><input type="hidden" ng-model="value" /><input ng-disabled="!disabled" ng-readonly="readonly" type="text" class="form-control" ng-model="valuetext" placeholder="{{placeholder}}">' +
                      '</div>';
            },
            scope: {
                type: '=',
                value: '=',
                valuetext: '=',
                items: '=',
                readonly: '=',
                placeholder: '='
            },
            link: function (scope, element, attr) {
                scope.readonly = true;
                scope.disabled = true;
                scope.$watch("valuetext", function (newvalue, oldvalue) {
                    if (!scope.readonly) {
                        scope.value = scope.valuetext;
                    }
                });

                scope.$watch("items", function (newvalue, oldvalue) {
                    //scope.value = null;
                    //scope.valuetext = "";
                    if (!!scope.items && scope.items.length > 0) {
                        scope.disabled = true;
                        for (var i = 0; i < scope.items.length; i++) {
                            if (scope.type == scope.items[i].value) {
                                scope.typeText = scope.items[i].text;
                                break;
                            }
                        }
                    } else {
                        scope.disabled = false;
                    }
                }, true);

                scope.$watch("type", function (newvalue, oldvalue) {
                    if (!!scope.items && scope.items.length > 0 && newvalue != null) {
                        for (var i = 0; i < scope.items.length; i++) {
                            if (newvalue == scope.items[i].value) {
                                scope.typeText = scope.items[i].text;
                                break;
                            }
                        }
                    }
                    if (newvalue == null) {
                        scope.typeText = "";
                    }
                });

                scope.text = "";
                scope.itemClick = function (obj) {
                    if (scope.type != obj.value) {
                        scope.readonly = true;
                        scope.placeholder = "";
                        scope.value = null;
                        scope.valuetext = "";
                    }
                    scope.type = obj.value;
                    scope.typeText = obj.text;
                    obj.fun(scope);
                };
            }
        }
    }]);

    _shared.directive("maTree", function () {
        return {
            restrict: 'EA',
            transclude: true,
            template: '<div></div>',
            scope: {
                ngModel: '=',
                selectedId: '='
            },
            link: function (scope, element, attr) {
                scope.$watch('ngModel', function () {
                    var treeData = scope.ngModel;
                    if (treeData == null || treeData.id == null) {
                        return;
                    }
                    var icon = attr.icon;
                    $(element).jstree({
                        'plugins': ["types"],
                        'core': {
                            "themes": {
                                "responsive": false
                            },
                            'data': treeData
                        },
                        "types": {
                            "default": {
                                "icon": icon
                            },
                            "file": {
                                "icon": icon
                            }
                        }
                    });

                    $(element).on('select_node.jstree', function (e, data) {
                        $(element).parent().parent().find('.jstree-clicked').removeClass('jstree-clicked');
                        $(element).parent().parent().find('#' + data.selected[0] + '>a').addClass('jstree-clicked');
                        scope.selectedId = data.selected[0];
                        scope.$apply();
                    });


                }, true);
            }
        };
    });

    _shared.filter('processortype', function () {
        return function (input) {
            switch (input + "") {
                case "0": return "发起人";
                case "1": return "业务相关人";
                case "2": return "岗位";
                case "3": return "角色";
                case "4": return "部门";
                case "5": return "与某一步处理人相同";
                case "6": return "岗位代码按人过滤";
                case "7": return "岗位级别按人过滤";
                case "8": return "角色按部门过滤";
                case "9": return "部门领导";
                case "10": return "直属主管";
                case "11": return "前置步骤的直属主管";
                case "12": return "前置步骤的部门领导";
                case "13": return "某组织某岗位级别的人员";
                case "14": return "指定步骤的直属主管";
                case "15": return "指定步骤的部门领导";
                case "16": return "从某岗位级别到某岗位级别";
                case "17": return "岗位代码按部门过滤";
                case "18": return "岗位级别按部门过滤";
                case "19": return "申请人";
                case "20": return "下一步处理人";
                default: return "";
            }
        }
    });

    _shared.filter('processordatatype', function () {
        return function (input) {
            switch (input + "") {
                case "0": return "数据源";
                case "1": return "数据字段";
                case "2": return "变量";
                default: return "";
            }
        }
    });

    _shared.filter('enumfilter', function () {
        return function (input, enumName) {
            var objs = enums.get(enumName);
            var result = _.find(objs, { 'id': input });
            if (!result) {
                return "";
            }
            return result.text;
        }
    });

    _shared.filter('procstatus', function () {
        return function (input) {
            switch (input + "") {
                case "1": return L("TaskFinishStatus");
                case "7": return L("Refused");
                default: return input;
            }
        }
    });

    _shared.buildDialog = function () {
        return {
            define: function (key, path) {
                if (this[key] == null) {
                    var ctrlId = "shared.dialogs.{0}".fill(key);
                    this[key] = {
                        templateUrl: _turl(path),
                        controller: ctrlId
                    }
                    return ctrlId;
                } else {
                    console.error("{0} duplicate defined.".fill(key));
                    return "errorCtrl";
                }
            }
        };
    }
    _shared.dialogs = _shared.buildDialog();

    //合并table行方法
    _shared.mergeTable = function (identity, data, colList) {
        hebingRows(identity, data);//从标识行取出开始和结束行号
        hebingRowsT(data, colList);//合并
    }

    function hebingRows(col, data) {
        var trs = $("table tr");
        var rows = 1;
        for (var i = trs.length; i > 0; i--) {
            if (!!data[i]) {
                data[i].end = i;
            }
            var cur = $($(trs[i]).find("td")[col]).text();
            var next = $($(trs[i - 1]).find("td")[col]).text();
            if (cur === next) {
                rows++;
                //$($(trs[i]).find("td")[col]).remove();
                //$($(trs[i]).find("td")[col]).text("");
                //$($(trs[i - 1]).find("td")[col]).css("border-bottom", "none");
                //$($(trs[i]).find("td")[col]).css("visibility", "hidden");
            } else {
                //$($(trs[i]).find("td")[col]).attr("rowspan", rows);
                if (rows > 1) {
                    if (!!data[i + rows - 2]) {
                        data[i + rows - 2].start = i - 1;
                        data[i + rows - 2].rows = rows;
                        //$($(trs[i]).find("td")[col]).css("border-bottom", "none");
                    }
                } else {
                    if (!!data[i]) {
                        data[i].start = i - 1;
                        data[i].rows = 1;
                    }
                }

                rows = 1;
            }
        }
    }

    function hebingRowsT(data, collist) {
        collist.sort(function (a, b) {
            return b - a;
        });
        for (var i = data.length; i >= 0; i--) {
            if (!!data[i] && (!!data[i].start || data[i].start === 0) && !!data[i].end && !data[i].yet && data[i].rows > 1) {
                var s = data[i].start;
                var e = data[i].end;
                for (var k = 0; k < collist.length; k++) {
                    var col = collist[k];
                    var trs = $("table tr");
                    for (var j = e + 1 ; j > s + 1; j--) {
                        data[j - 1].yet = true;
                        $($(trs[j]).find("td")[col]).remove();
                        //$($(trs[j]).find("td")[col]).text("");
                        //$($(trs[j - 1]).find("td")[col]).css("border-bottom", "none");
                    }
                    $($(trs[s + 1]).find("td")[col]).attr("rowspan", e - s + 1);
                    //$($(trs[s + 1]).find("td")[col]).css("border-bottom", "none");
                }
            }
        }
    }

})();

//在模板后跟版本后缀，防止首次从缓存中获取
_turl = function (url) {
    return url + '?' + +new Date();
}