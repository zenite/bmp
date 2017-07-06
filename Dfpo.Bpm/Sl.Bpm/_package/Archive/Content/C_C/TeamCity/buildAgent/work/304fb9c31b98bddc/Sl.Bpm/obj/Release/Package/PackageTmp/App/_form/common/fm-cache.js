_shared
    .directive('fmCache', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            controller: ['$scope', function (scope) {
                this.fmCache = {
                    dict: [], // { key: 'code', items: [], isLoading: true}
                    callback: [], // { key: '', func: function(data){}}
                    get: function (key, service, param, callbackFunc) {
                        var that = this;
                        var item = _.find(that.dict, { key: key });
                        if (item != null && item.isLoading === false) {
                            callbackFunc(item.items);
                        } else if (item != null && item.isLoading === true) {
                            that.callback.push({ key: key, func: callbackFunc });
                        } else {
                            that.dict.push({ key: key, isLoading: true });
                            that.callback.push({ key: key, func: callbackFunc });
                            service(param).then(function (data) {
                                var item = _.find(that.dict, { key: key });
                                item.items = data;
                                item.isLoading = false;
                                var callFuncs = _.filter(that.callback, { key: key });
                                _.forEach(callFuncs, function (item) {
                                    item.func(data);
                                });

                            });
                        }
                    }

                };
            }]
        }
    }])