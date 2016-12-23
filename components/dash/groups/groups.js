; (function () {
    var app = angular.module('App');
    app.controller('DashGroupController', ['$scope', '$state', 'Groups', function ($scope, $state, Groups) {

        var vm = this;
        vm.groupIndex = 0;
        vm.groupsTotal = 0;

        Groups.allGroups(vm.groupIndex).then(function (response) {
            vm.Groups = response.results;
            vm.groupsTotal = response.total;
            vm.groupIndex++;
        });


    }]);
})();