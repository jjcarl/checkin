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
    $scope.new_info = {}
    $scope.user_info = {}
    $http.get(backendUrl + '/families/').then(function(response){
        $scope.families = response.data
    }, function(response){
        $scope.errors = response.status
    })
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
        $http.post(backendUrl + '/families/', $scope.newfam).then(function(response){
            $scope.success = response.status
            $scope.new_info.family = response.data.id
            $scope.new_info.user = $scope.user.id
            $http.post(backendUrl + '/info/', $scope.new_info).then(function(response){
                $scope.success = response.data
                $window.location.reload();
                $location.path('/user-info')
            }, function(response){
                $scope.errors = response.status
            })
        }, function(response){
            $scope.errors = response.status
        })
    }
    $scope.info = function(){
        $scope.user_info.user = $scope.user.id
        $http.put(backendUrl + '/info/' + $scope.user.id + '/', $scope.user_info).then(function(response){
            $scope.success = response.data
            $window.location.reload();
            $location.path('/user-info')
        }), function(response){
            $scope.errors = response.status
        }
    }
    $scope.image_upload = function(){
        $scope.user_info.user = $scope.user.id
        var file = document.getElementById('pic').files[0],
            reader = new FileReader();
        reader.onload = function(e){
            $scope.user_info.profile_pic = 'data:image/png;base64,' + btoa(e.target.result);
            $scope.$apply();
        }
        reader.readAsBinaryString(file);

        $http.put(backendUrl + '/info/' + $scope.user.id + '/', $scope.user_info).then(function(response){
            $scope.success = response.data
            $window.location.reload();
            $location.path('/user-info')
        }), function(response){
            $scope.errors = response.status
        }
    }
}])