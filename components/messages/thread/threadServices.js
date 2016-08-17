; (function () {
    angular.module('App').factory("Thread", ['$http', '$q', 'Messages', 'UserStore', function ($http, $q, Messages, UserStore) {
        var messages = [];
        var Thread = {};

        Thread.thread = function (index, user) {
            var deffered = $q.defer();

            if (user === 'blast') {

                var activeThread = Messages.active();                
                $http.get(baseURL_CONSTANT + "api/messages/blast/" + activeThread.messageID + "/" + index + "/" + countSet_CONSTANT, {
                    cache: false
                })
               .success(function (d) {
                   deffered.resolve(d);
               })
               .error(function (data, status) {
                   console.log("Request failed " + status);
               });
               
            } else {
                $http.get(baseURL_CONSTANT + "api/messages/" + user + "/" + index + "/" + countSet_CONSTANT, {
                    cache: false
                })
                .success(function (d) {
                    deffered.resolve(d);
                })
                .error(function (data, status) {
                    console.log("Request failed " + status);
                });
            }
            return deffered.promise;
        };

        Thread.viewed = function (user) {
            var deffered = $q.defer();
            var msg = {'user': user };
            $http.put(baseURL_CONSTANT + "api/messages/viewed", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Thread.sendMessage = function (recipients, msg, parentMsg) {
            var deffered = $q.defer();
            var msg = { 'SendTo': recipients, 'MessageParentID': parentMsg, 'Body': msg };
            $http.post(baseURL_CONSTANT + "api/messages", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Thread.sendNotification = function (message) {
            var deffered = $q.defer();
            var msg = {'messageID': message };
            $http.post(baseURL_CONSTANT + "api/messages/notify", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Thread.composeList = function (index) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/accounts/user/compose/" + index + "/" + countSet_CONSTANT)
            .success(function (d) {
               deffered.resolve(d);
            })
            .error(function (data, status) {
               console.log("Request failed " + status);
            });

            return deffered.promise;
        };

        Thread.messageThread = function () { return messages; };
        return Thread;
    }]);

})();