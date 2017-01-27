; (function () {
    angular.module('App').factory('Block', ['$http', '$q', 'UserStore', function ($http, $q, UserStore) {
        var Block = {};
        var data = [];

        Block.blocks = function (index) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/blocks/" + index + "/" + countSet)
            .success(function (d) {
                data = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Block.block = function (guid) {
            var deffered = $q.defer();
            var msg = { "blocked": guid };
            $http.post(baseURL_CONSTANT + "api/blocks", msg)
            .success(function (d) {
                data = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Block.DeleteBlock = function (ID) {
            var deffered = $q.defer();
            $http.delete(baseURL_CONSTANT + "api/blocks/" + ID)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Block.data = function () { return data; };
        return Block;
    }]);

})();