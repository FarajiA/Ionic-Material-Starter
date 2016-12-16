; (function () {
    var app = angular.module('App');
    app.controller('AddEditController', ['$scope', '$ionicPopup', '$stateParams', 'Traffic', 'Groups', 'Search', function ($scope, $ionicPopup, $stateParams, Traffic, Groups, Search) {

        var vm = this;
        vm.groupID = _.toNumber($stateParams.groupID);
        vm.groupMembersIndex = 0;
        vm.groupMembersTotal = 0;
        vm.groupName = "";
        vm.showChasers = true; 
        vm.listChasers = Traffic.getChasers();
        vm.deleteMemberList = [];

        if (vm.groupID > 0)
        {
            vm.groupTitle = groupEditGroup_CONSTANT;
            vm.buttonText = groupSaveButtonText_CONSTANT;
            Groups.getGroupDetails(vm.groupID).then(function (response) {
                vm.groupName = response.result.name;
                vm.groupMembersTotal = response.result.membersAmount;
            });

            Groups.getMembers(vm.groupID, vm.groupMembersIndex).then(function (response) {
                vm.Members = response.results;
                vm.OGmembers = response.results;
                _.forEach(vm.Members, function (parentValue, parentKey) {
                    var user = _.find(vm.listChasers.results, { 'id': parentValue.id });
                    if (user)
                        user.checked = true;
                });
                vm.groupMembersTotal = response.total;
                vm.groupMembersIndex++;
            });
        }
        else {
            vm.groupTitle = groupNewGroup_CONSTANT;
            vm.buttonText = groupAddButtonText_CONSTANT;
        }

        vm.updateMembers = function (user) {
            if (vm.Members.length <= 9) {
                var present = _.some(vm.Members, ['id', user.id]);

                if (present) {
                    _.remove(vm.Members, function (n) {
                        return n.id === user.id;
                    });
                    vm.groupMembersTotal--;
                }
                else {
                    vm.groupMembersTotal++;
                    vm.Members.push(user);
                }
            }
            else {
                var confirmPopup = $ionicPopup.confirm({
                    title: groupMax_CONSTANT
                });
            }
        };


       
    }]);
})();