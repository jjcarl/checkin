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
    $http.get(backendUrl + '/families/' + $scope.user.info.family + '/').then(function(response){
        $scope.members = []
        $scope.family = response.data
        for (var i = 0; i < $scope.family.users.length; i++) {
            $http.get(backendUrl + '/users/' + $scope.family.users[i].user + '/').then(function(data){
                $scope.members = $scope.members.concat([data.data])
            }), function(data){
                $scope.error = data.data
            }
        };
        
    }), function(response){
        $scope.error = response.status
    }
}])