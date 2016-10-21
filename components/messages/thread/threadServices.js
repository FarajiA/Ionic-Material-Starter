﻿; (function () {
    angular.module('App').factory("Thread", ['$http', '$q', 'Messages', 'UserStore', 'Encryption', function ($http, $q, Messages, UserStore, Encryption) {
        var messages = [];
        var Thread = {};


        Thread.thread = function (index, user) {
            var deffered = $q.defer();

            if (user === 'blast') {
                var activeThread = Messages.active();
                var recipients = _.split(activeThread.corresponder, ',');
                var msg = { 'recipients': recipients };
                $http.post(baseURL_CONSTANT + "api/messages/blast/" + index + "/" + countSet_CONSTANT, msg)
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

        Thread.sendMessage = function (recipients, msg, parentMsg, publickeys) {
            var deffered = $q.defer();
            
            var promises = [];
            var msgsArray = [];
            
            _.forEach(publickeys, function (value) {
                updateMsg(value);
            });

            $q.all(promises).then(function (value) {
                var zippedMsgs = _.zipObject(recipients, msgsArray);
                var msg = { 'MessageParentID': parentMsg, 'Body': zippedMsgs };
                $http.post(baseURL_CONSTANT + "api/messages", msg)
                .success(function (d) {
                    deffered.resolve(d);
                })
                .error(function (data, status) {
                    deffered.reject(data);
                    console.log("Request failed " + status);
                });
            });            

            function updateMsg(key) {
                var innerDeffered = $q.defer();
                Encryption.Encrypt(msg, key).then(function (response) {
                    msgsArray.push(response);
                    innerDeffered.resolve(response);
                });

                promises.push(innerDeffered); // add promise to array
            };

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