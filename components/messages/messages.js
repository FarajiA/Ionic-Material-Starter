; (function () {
    var app = angular.module('App');
    app.controller('MessagesController', ['$scope', '$q', 'UserStore', 'Messages', function ($scope, $q, UserStore, Messages) {
        
        var vm = this;
        vm.MessageService = Messages;
        vm.imageURL = imgURL_CONSTANT;
        vm.messagesIndex = 0;

        vm.user = UserStore.data();


        var unbindGetInbox = $scope.$watch('vm.MessageService.inboxMessages()', function (newVal, oldVal) {
            if (_.has(newVal, 'index')) {
                vm.Messages = newVal.results;
                vm.messagesNo = newVal.total;
                vm.moMessages = (vm.messagesNo > countSet_CONSTANT);
                vm.messagesIndex++;
                //unbindGetInbox();
            }
        });
        
        vm.loadMoreMessages = function () {
            var deffered = $q.defer();
            var pagingMessageMax = Math.ceil(vm.messagesNo / countSet_CONSTANT, 1);
            if (vm.messagesIndex < pagingMessageMax && vm.messagesIndex > 0) {
                Messages.inbox(vm.messagesIndex).then(function (data) {
                    var messagesMerged = vm.Messages.concat(data.results);
                    vm.messagesNo = data.total;
                    vm.Messages = messagesMerged;
                    vm.messagesIndex++;
                    vm.moMessages = (vm.messagesNo > countSet_CONSTANT);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    deffered.resolve();
                });
            }
            else if (vm.messagesIndex >= pagingMessageMax)
                vm.moMessages = false;

            return deffered.promise;
        };

        vm.MessageViewed = function (index) {
            vm.Messages[index].viewed = true;            
            Messages.activemessage(index).then(function (response) {
                if (!response.viewed)
                    Messages.viewed(response.corresponder);
            });
        };


    }]);
})();