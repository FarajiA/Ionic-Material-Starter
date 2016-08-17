; (function () {
    var app = angular.module('App');
    app.controller('ComposeController', ['$scope', '$timeout', '$state', 'UserStore', 'Thread', 'Search', function ($scope, $timeout, $state, UserStore, Thread, Search) {

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

        vm.inputPlaceholderText = composeNewMsg_CONSTANT;

        Thread.composeList(vm.composeIndex).then(function (response) {
            vm.listRecipients = response.results;
            vm.composeIndex++
        });

        vm.updateRecipients = function (user) {
            var item = {};
            item.thumbnailUrl = '././img/tyrion.jpg';
            item.title = user.username;
            item.subtitle = user.firstName + ' ' + user.lastName;
            item.id = user.id;
            var present = _.some(vm.selectedUsers, ['id', user.id]);

            if (present) {
                _.remove(vm.selectedUsers, function (n) {
                    return n.id === user.id;
                });
            }
            else {
                vm.selectedUsers.push(item);
            }
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
                //vm.moBroadcasters = (vm.broadcastersNo > countSet_CONSTANT);
                vm.searchIndex++;
            }
        });

        $scope.$watchCollection('vm.selectedUsers', function (newVal, oldVal) {
            if (newVal) {

            }
        });


        vm.removeChip = function (user) {
            console.log(user);
        };
        $scope.deleteChips = function (index) {
            console.log(user);
        };

    }]);
})();