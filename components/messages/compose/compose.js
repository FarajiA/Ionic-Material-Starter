; (function () {
    var app = angular.module('App');
    app.controller('ComposeController', ['$scope', '$timeout', '$state', 'Search', 'Thread', 'Messages', function ($scope, $timeout, $state, Search, Thread, Messages) {

        $scope.$on("$ionicView.beforeEnter", function () {
            $scope.showTabs.show = false;
        });
        $scope.$on("$ionicView.beforeLeave", function () {
            $scope.showTabs.show = true;
        });

        var vm = this;
        vm.composeIndex = 0;
        vm.searchIndex = 0;
        vm.SearchService = Search;
        vm.searchTotal = 0;
        vm.writingMessage = "";

        vm.inputPlaceholderText = composeNewMsg_CONSTANT;

        Thread.composeList(vm.composeIndex).then(function (response) {
            vm.listRecipients = response.results;
            vm.composeIndex++
        });

        vm.updateRecipients = function (user) {
            if (vm.selectedUsers.length <= 9) {
                var item = {};
                item.thumbnailUrl = '././img/tyrion.jpg';
                item.title = user.username;
                item.subtitle = user.firstName + ' ' + user.lastName;
                item.id = user.id;
                item.checked = user.checked;
                var present = _.some(vm.selectedUsers, ['id', user.id]);

                if (present) {
                    _.remove(vm.selectedUsers, function (n) {
                        return n.id === user.id;
                    });
                }
                else 
                    vm.selectedUsers.push(item);                
            }
            else 
                console.log("10 maximum allowed");

        };
                
        vm.itemsCollection = [{
            thumbnailUrl: '././img/sansa.jpg',
            title: 'Sansa Stark',
            subtitle: 'test@text.com',
            id: '45568fs44797879'
        },{
            thumbnailUrl: '././img/tyrion.jpg',
            title: 'Tyrion Lanister',
            subtitle: 'test@text.com',
            id: 'Bhmrr556lmd879'
        }];

        vm.selectedUsers = [];

        $scope.$watch('vm.SearchService.data()', function (newVal, oldVal) {
            if (_.has(newVal, 'index')) {
                vm.listRecipients = newVal.results;
                vm.searchTotal = newVal.total;
                vm.moRecipients = (vm.searchTotal > countSet_CONSTANT);
                vm.searchIndex++;

                _.forEach(vm.selectedUsers, function (parentValue, parentKey) {
                    var user = _.find(vm.listRecipients, { 'id': parentValue.id });
                    if (user)
                        user.checked = true;
                });
            }
        });

        vm.mdOnDelete = function (user) {
            var user = _.find(vm.listRecipients, { 'id': user });
            user.checked = false;
        };

        vm.submitFunction = function () {
            Thread.sendMessage(_.map(vm.selectedUsers, 'id'), vm.writingMessage, 0, true).then(function (response) {
                console.log(response);
                //Thread.sendNotification(response.messageID);
            });
        };


    }]);
})();