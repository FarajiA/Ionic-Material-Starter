﻿; (function () {
    var app = angular.module('App');
    app.controller('DashGroupController', ['$scope', '$state', '$ionicHistory', 'Groups', 'Broadcast', 'ShareLink', function ($scope, $state, $ionicHistory, Groups,Broadcast, ShareLink) {

        var vm = this;
        vm.groupIndex = 0;
        vm.groupsTotal = 0;

        vm.allChasers = AllChasers_CONSTANT;
        vm.anyonewithLink = AnyoneWithLink_CONSTANT;
        vm.everyone = Everyone_CONSTANT;
        vm.groupOnly = Group_CONSTANT;
        vm.coords = {longitude: "-09898723.28", latitude: "541.1488994"};


        Groups.allGroups(vm.groupIndex).then(function (response) {
            vm.Groups = response.results;
            vm.groupsTotal = response.total;
            vm.groupIndex++;
        });

        vm.broadcast = function (groupID, type) {
            Broadcast.On(vm.coords, groupID, type).then(function (response) {               
                $scope.shareLink = response.share;
                ShareLink.setLink(response.share);
                console.log(response);
                $ionicHistory.goBack();
                Broadcast.Notify(type, groupID);
            });

        };

    }]);
})();