; (function () {
    var app = angular.module('App');
    app.controller('UserController', ['$scope', '$timeout', '$stateParams', '$ionicModal', 'UserStore', 'User', 'Block', 'CentralHub', function ($scope, $timeout, $stateParams, $ionicModal, UserStore, User, Block, CentralHub) {
        var vm = this;
        vm.username = $stateParams.username;
        vm.title = vm.username;
        vm.broadcast = {};

        $scope.chaserBroadcast = {};

        var getUserRequest = function () {
            User.Info(vm.username).then(function (response) {
                vm.fullName = response.fullName;
                vm.id = response.id;
                vm.photo = response.photo;
                vm.private = response.private;
                vm.publicKey = response.publicKey;
                $scope.chasing = response.chasing;
                $scope.chasers = response.chasers;
                vm.broadcasting = response.broadcasting;
                $scope.relationship = response.relationship;                
            });
        };

        getUserRequest();
        
        /*  Map logic */
        $ionicModal.fromTemplateUrl('mapModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.mapModal = modal;
        });

        vm.openMap = function () {
            CentralHub.joinbroadcast($scope.$parent.proxyCentralHub, vm.username).then(function (coords) {
                vm.broadcast.coords = {
                    latitude: _.toNumber(coords.Latitude),
                    longitude: _.toNumber(coords.Longitude)
                };
                CentralHub.streamBroadcast($scope.$parent.proxyCentralHub);
            });
            vm.mapModal.show();            
        };

        vm.closeMap = function () {
            vm.mapModal.hide();
            CentralHub.leavebroadcast($scope.$parent.proxyCentralHub, vm.id);
        };

        $scope.$on('$destroy', function () {
            vm.mapModal.remove();

        });

        $scope.$on('mapUpdate', function (event, value) {
            $scope.$apply(function () {
            vm.broadcast.coords = {
                latitude: _.toNumber(value.coords.Latitude),
                longitude: _.toNumber(value.coords.Longitude)
            };
            });
        });
        /* End map*/

        $scope.$on('$ionicView.enter', function () {
            if (!(vm.id === UserStore.data().id)) {
                //$scope.chaserLink = '#/main/' + $scope.segment + '/chasers/' + $scope.GUID;
                //$scope.chasingLink = '#/main/' + $scope.segment + '/chasing/' + $scope.GUID;

                $scope.$watch("broadcasting", function (newValue, oldValue) {
                    if (newValue) {

                    }

                });
            }
        });

        $scope.$on('$ionicView.leave', function () {
            if (!$scope.selfIdentity) {
                clearGeoWatch();
                UserView.SetUserPageCurrent(false);
            }
        });





    }]);
})();