_shared
/*流程附件指令*/
.directive('fmAttachment', [
        'fmTool', '$compile', 'FileUploader', 'mabp.app.file', 'appSession', function (fmTool, $compile, fileUploader, service, appSession) {
            return {
                restrict: 'E',
                replace: true,
                template: function (elem, attr) {
                    var _validate = fmTool.setValidate(attr);
                    return '<table field-name="{{fieldName}}" ' + _validate.join(' ') + ' class="input-sm fm-attachment table table-condensed" ng-class="state">' +
                               //'<thead>' +
                               //  '<tr>' +
                               //    '<td></td>' +
                               //  '</tr>' +
                               //'</thead>' +
                               '<tbody>' +
                                 '<tr ng-repeat="item in files">' +
                                   '<td>' +
                                        '<i class="fileIcon {{getFileIcon(item)}}"></i>' +
                                        '&nbsp;<a target="_blank" ng-href="/File/Download?fileId={{item.id}}">{{item.fileName}}&nbsp;&nbsp;</a>' +
                                        '<i ng-if="state==\'normal\' && nodeId == item.nodeId && userId == item.creatorUserId" class="fileRemoveIcon icon-times" ng-click="event_delete(item)"></i>' +
                                        '<i class="file-upload-date">{{item.creationTime | date:"yyyy-MM-dd hh:mm"}}</i>' +
                                        '<i class="file-upload-username">{{item.userName}}</i>' +
                                    '</td>' +
                                 '</tr>' +
                               '</tbody>' +
                               '<tfoot ng-if="state==\'normal\'">' +
                                   '<tr>' +
                                       '<td colspan="1">' +
                                            '<input type="file" class="picUpload" nv-file-select uploader="uploader" multiple="true" />' +
                                            '<input type="button" class="btn btn-sm btn-info ng-scope" ng-click="event_upload()" value="{{btnname}}" />' +
                                        '</td>' +
                                    '</tr>' +
                                '</tfoot>' +
                             '</table>';
                },
                scope: {
                    files: '=',
                    fmModel: '=',
                    taskId: '=',
                    uploader: '=',
                    getFileIcon: '&',
                    linkId: '=',
                    bpmFiles: '=',
                    userId: '=',
                    nodeId: '=',
                    draftId: '=',
                    formFiles: '=',
                    fmRequired: '=',
                    fmDisabled: '=',
                    fmNormal: '='
                },
                compile: function (tElement, tAttrs, transclude) {
                    return {
                        pre: function preLink(scope, element, attr, ctrl) {
                            fmTool.setDefaultWatch(attr, scope, element);
                            scope.fieldName = attr.fieldName;
                            scope.uploader = new fileUploader({
                                url: 'fileApi/File/UploadFiles'
                            });
                            scope.getFileIcon = function (item) {
                                scope.fileType = item.extensionName.toLowerCase().substring(1);
                                switch (item.extensionName.toLowerCase().substring(1)) {
                                    case "png":
                                    case "jpg":
                                    case "bmp":
                                    case "gif":
                                    case "jpeg":
                                        return "icon-file-image";
                                    case "txt":
                                    case "xml":
                                    case "json":
                                    case "config":
                                        return "icon-file-text-o";
                                        break;
                                    case "doc":
                                    case "docx":
                                        return "icon-file-word";
                                        break;
                                    case "xls":
                                    case "xlsx":
                                        return "icon-file-excel";
                                        break;
                                    case "ppt":
                                    case "pptx":
                                        return "icon-file-powerpoint";
                                        break;
                                    case "mp3":
                                    case "wav":
                                    case "mid":
                                        return "icon-file-audio";
                                        break;
                                    case "mp4":
                                    case "avi":
                                    case "wmv":
                                    case "flv":
                                    case "rmvb":
                                        return "icon-file-movie";
                                        break;
                                    case "js":
                                    case "cs":
                                    case "css":
                                    case "c":
                                    case "java":
                                    case "sql":
                                        return "icon-file-code";
                                        break;
                                    case "pdf":
                                    case "fdf":
                                    case "xdp":
                                        return "icon-file-pdf";
                                        break;
                                    case "zip":
                                    case "rar":
                                    case "cab":
                                    case "7z":
                                        return "icon-file-archive";
                                        break;
                                    default:
                                        return "icon-file-o";
                                }
                            }
                        },
                        post: function postLink(scope, element, attr, ctrl) {
                            scope.btnname = attr.buttonName || "上传附件";
                            scope.userId = appSession.userId;
                            attr.pageState = $(".fm-content").attr("page-state");
                            //控件状态控制
                            fmTool.setScopeState(scope, attr);

                            scope.files = [];
                            scope.fileIds = [];
                            scope.fileFiles = scope.files;
                            scope.bpmFiles = {
                                linkId: scope.linkId,
                                FileId: scope.fileIds,
                                files:scope.files
                            };

                            if (!!scope.taskId) {
                                service.getTaskLinkedFiles({ taskId: scope.taskId, linkId: scope.linkId }).then(function (result) {
                                    scope.files = result;
                                    _.forEach(scope.files, function (data) {
                                        scope.fileIds.push(data.id);
                                    });
                                    scope.bpmFiles.files = scope.files;
                                });
                            }
                            if (!!scope.draftId) {
                                service.getDraftFile({ draftId: scope.draftId, linkId: scope.linkId }).then(function (result) {
                                    scope.files = result;
                                    _.forEach(scope.files, function(data) {
                                        scope.fileIds.push(data.id);
                                    });
                                    scope.bpmFiles.files = scope.files;
                                });
                            }
                            //上传
                            scope.event_upload = function () {
                                $(element).find(".picUpload").click();
                            }
                            //删除
                            scope.event_delete = function (m) {
                                var def = {};
                                def.taskId = scope.taskId;
                                def.fileId = m.id;
                                service.deleteFile(def).then(function () {
                                    console.log("移除成功");
                                    var idx = scope.files.indexOf(m);
                                    scope.files.splice(idx, 1);
                                    scope.fileIds.splice(idx, 1);
                                });
                            }

                            // 文件个数
                            //scope.uploader.filters.push({
                            //    name: 'customFilter',
                            //    fn: function (item /*{File|FileLikeObject}*/, options) {
                            //        return this.queue.length < 10;
                            //    }
                            //});

                            // 文件大小
                            scope.uploader.filters.push({
                                name: 'customFilter',
                                fn: function (item /*{File|FileLikeObject}*/, options) {
                                    var num = item.size;
                                    //for (var i = 0; i < this.queue.length; i++) {
                                    //    num += this.queue[i]._file.size;
                                    //}
                                    //var isTrue = num < 1024 * 1024 * 10;
                                    //if (!isTrue)
                                    //    console.log("附件应该小于10MB");
                                    var isTrue = num < 1024 * 1024 * 15;
                                    if (!isTrue)
                                        mabp.notify.warn("附件应小于15MB");
                                    return isTrue;
                                }
                            });


                            scope.uploader.onAfterAddingFile = function (fileItem) {
                                if (scope.uploader.getNotUploadedItems().length) {
                                    scope.uploader.uploadAll();
                                }
                            };

                            scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                                var statuss = response.isSuccess;
                                if (statuss) {
                                    for (var i = 0; i < response.result.length; i++) {
                                        var _tempfile = response.result[i];
                                        _tempfile.creationTime = new Date().format("yyyy-MM-dd hh:mm");
                                        _tempfile.userName = appSession.userName;
                                        _tempfile.creatorUserId = appSession.userId;
                                        _tempfile.nodeId = scope.nodeId;
                                        scope.files.push(_tempfile);
                                        scope.fileIds.push(_tempfile.id);
                                    }
                                }
                            };

                            scope.formFiles.push(scope.bpmFiles);

                            scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
                                scope.uploader.queue[scope.uploader.queue.length - 1].remove();
                                console.log("附件上传失败");
                                mabp.notify.warn("附件上传失败");
                            };

                            scope.$watch("files", function () {
                                if (!!scope.files) {
                                    var _ids = [];
                                    for (var i = 0; i < scope.files.length; i++) {
                                        _ids.push(scope.files[i].id);
                                    }
                                    scope.fmModel = _ids.join(",");
                                    if (scope.fmModel == "") scope.fmModel = null;
                                }
                            }, true);
                        }
                    }
                }
            }
        }
])