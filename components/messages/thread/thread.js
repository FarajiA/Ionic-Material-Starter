﻿; (function () {
    var app = angular.module('App');
    app.controller('ThreadController', ['$scope', '$timeout', '$state', '$stateParams', '$filter', '$templateCache', 'Thread', 'Messages', 'Encryption', 'UserStore', function ($scope, $timeout, $state, $stateParams, $filter, $templateCache, Thread, Messages, Encryption, UserStore) {
        //$templateCache.removeAll();
        $scope.$on("$ionicView.beforeEnter", function () {
                $scope.showTabs.show = false;
        });
        $scope.$on("$ionicView.beforeLeave", function () {
            $scope.showTabs.show = true;
        });

        var vm = this;
        var activeMessage = Messages.active();

        vm.corresponder = $filter('messageUsername')(activeMessage.username);
        //var stuff = $stateParams.username;

        vm.userID = $stateParams.userID;
        vm.threadIndex = 0;
        vm.user = UserStore.data();

        var extra = $state.current.name;
        
        var getUserThread = function () {
            Thread.thread(vm.threadIndex, vm.userID).then(function(response) {
                vm.MessageThread = _.reverse(response.results);
                vm.messagesNo = response.total;
                vm.threadIndex++;

                if (_.some(vm.MessageThread, ['viewed', false]))
                    Thread.viewed(vm.userID);
            });
        };

        getUserThread();

        $scope.$watch('$parent.activeThread', function (newVal, oldVal) {
            if (!_.isEmpty(newVal) && !_.isEmpty(vm.MessageThread)) {
                vm.MessageThread.push(newVal);
            }
        });

        vm.sendMessage = function (msg) {
            var msgObject = { 'username': vm.user.userName, 'date': new Date() };
            Encryption.Encrypt(msg, vm.user.publicKey).then(function (response) {
                msgObject.body = response;
                vm.MessageThread.push(msgObject);
            });

            activeMessage = Messages.active();
            var recipients = _.split(activeMessage.corresponder, ',');
            recipients.unshift(vm.user.id);
            
            Thread.sendMessage(recipients, msg, activeMessage.messageID, activeMessage.blast).then(function (response) {
                if (response) {
                    Thread.sendNotification(response.messageID);
                    Messages.updateActive(response)
                    Messages.updateThread(response, false);
                }
            }, function (error) {
                console.log("message didn't send");
            });           
        };

        vm.loadMoreMessages = function () {
            var deffered = $q.defer();
            var pagingMessageMax = Math.ceil(vm.messagesNo / countSet_CONSTANT, 1);
            if (vm.threadIndex < pagingMessageMax && vm.threadIndex > 0) {
                Thread.thread(vm.threadIndex, vm.userID).then(function (data) {
                    var messagesMerged = vm.MessageThread.concat(data.results);
                    vm.messagesNo = data.total;
                    vm.Messages = messagesMerged;
                    vm.threadIndex++;
                    vm.moMessages = (vm.messagesNo > countSet_CONSTANT);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    deffered.resolve();
                });
            }
            else if (vm.messagesIndex >= pagingMessageMax)
                vm.moMessages = false;

            return deffered.promise;
        };


    }]);
})();