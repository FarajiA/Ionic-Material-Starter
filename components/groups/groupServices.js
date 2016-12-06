; (function () {
    angular.module('App').factory("Groups", ['$http', '$q', 'UserStore', function ($http, $q, UserStore) {
       
        var groupsList = [];
        var Groups = {};

        Groups.allGroups = function (index) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/groups/" + index + "/" + countSet_CONSTANT)
            .success(function (d) {
                groupsList = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };
        
        Groups.addGroup = function (name, addlist) {
            var deffered = $q.defer();
            var msg = { "name": name, "MembersList": addlist};
            $http.post(baseURL_CONSTANT + "api/groups", msg)
            .success(function (d) {
                groupsList.push(d);
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Groups.updateGroup = function (name, groupID, deleteMembers, addMembers) {
            var deffered = $q.defer();
            var msg = {"name": name, "ID": groupID, "DeleteMembersList": deleteMembers, "MembersList": addMembers}
            $http.put(baseURL_CONSTANT + "api/groups", msg)
            .success(function (d) {
                _.remove(groupsList, function (group) {
                    return  group.id == d.id;
                });
                groupsList.push(d);
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Groups.getGroupDetails = function (groupID) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/groups/" + groupID)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Groups.getMembers = function (groupID, index) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/groups/" + groupID + "/" + index + "/" + countSet_CONSTANT)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Groups.deleteGroup = function (groupID, index) {
            var deffered = $q.defer();
            $http.delete(baseURL_CONSTANT + "api/groups/" + groupID)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Groups.getGroups = function () { return groupsList; };
        return Groups;

    }]);

})();