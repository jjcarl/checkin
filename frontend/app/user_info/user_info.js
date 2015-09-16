'use strict';

angular.module('checkin.userInfo', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/user-info', {
        templateUrl: 'user_info/user_info.html',
        controller: 'UserInfoController'
    });
}])
.controller('UserInfoController', ['$scope', 'User', '$http', '$location', '$window', function($scope, User, $http, $location, $window){
    $scope.user = User.info
    $http.get(backendUrl + '/families/').then(function(response){
        $scope.families = response.data
    }), function(response){
        $scope.errors = response.status
    }
    if ($scope.user.info != null){
        if ($scope.user.info.family != null) {
            $http.get(backendUrl + '/families/' + $scope.user.info.family + '/').then(function(response){
                $scope.family = response.data
            }), function(response){
                $scope.errors = response.status
            }
        }
    }
    $scope.submit = function(){
        $scope.newfam.users = [$scope.user]
        $scope.newfam.locations = []
        console.log($scope.newfam)
        $http.post(backendUrl + '/families/', $scope.newfam).then(function(response){
            $scope.success = response.status
            $scope.new_info.family = response.data.id
            $scope.new_info.user = $scope.user.id
            $http.post(backendUrl + '/info/', $scope.new_info).then(function(response){
                $scope.success = response.data
                $window.location.reload();
                $location.path('/user-info')
            }), function(response){
                $scope.errors = response.status
            }
        }), function(response){
            $scope.errors = response.status
        }
    }
}])