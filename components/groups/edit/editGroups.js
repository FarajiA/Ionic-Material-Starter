; (function () {
    var app = angular.module('App');
    app.controller('AddEditController', ['$scope', '$stateParams', 'Groups', 'Search', function ($scope, $stateParams, Groups, Search) {

        var vm = this;
        vm.groupID = _.toNumber($stateParams.groupID);
        vm.groupMembersIndex = 0;
        vm.groupMembersTotal = 0;
        vm.groupName = "";
        vm.showChasers = true;

        if (vm.groupID > 0)
        {
            vm.buttonText = groupSaveButtonText_CONSTANT;
            Groups.getGroupDetails(vm.groupID).then(function (response) {
                vm.groupName = response.result.name;
                vm.groupMembersTotal = response.result.membersAmount;
            });

            Groups.getMembers(vm.groupID, vm.groupMembersIndex).then(function (response) {
                vm.Members = response.results;
                vm.groupMembersTotal = response.total;
                vm.groupMembersIndex++;
            });
        }
        else {
            vm.buttonText = groupAddButtonText_CONSTANT;
        }








       
    }]);
})();