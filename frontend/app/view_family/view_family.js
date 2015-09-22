'use strict';

angular.module('checkin.viewFamily', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/family', {
        templateUrl: 'view_family/view_family.html',
        controller: 'ViewFamilyController'
    });
}])
.controller('ViewFamilyController', ['$scope', '$http', 'User', function($scope, $http, User){
    $scope.user = User.info
    $scope.available = []
    $scope.members = []

    // Using the new User.family service
    $scope.family = User.family
    for (var i = 0; i < $scope.family.users.length; i++) {
        $http.get(backendUrl + '/users/' + $scope.family.users[i].user + '/').then(function(data){
            $scope.members = $scope.members.concat([data.data])
        }), function(data){
            $scope.errors = data.data
        }
    };

    // Get a list of all users with no assigned family
    $http.get(backendUrl + '/users/').then(function(data){
        var list = data.data
        for(var i=0; i<list.length; i++){
            if(list[i].info === null){
                $scope.available = $scope.available.concat([list[i]])
            }else if (list[i].info.family === null){
                $scope.available = $scope.available.concat([list[i]])
            }
        }
    }, function(data){
        $scope.errors = data.status
    })
    $scope.add = function(){
        $scope.info = {}
        $scope.info['user'] = $scope.newfam.id
        $scope.info['family'] = $scope.user.info.family
        if ($scope.newfam.info === null){
            $http.post(backendUrl + '/info/', $scope.info).then(function(results){
                $scope.members = $scope.members.concat([$scope.newfam])
                $scope.success = results.status
            }, function(results){
                $scope.errors = results.status
            })
        } else {
            $http.post(backendUrl + '/info/' + $scope.newfam.id + '/', $scope.info).then(function(results){
                $scope.success = results.status
                $scope.members = $scope.members.concat([$scope.newfam])
            }, function(results){
                $scope.errors = results.status
            })
        }
        
    }
}])