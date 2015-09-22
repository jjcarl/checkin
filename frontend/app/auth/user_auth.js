'use strict';

angular.module('checkin.userAuth', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/login', {
        templateUrl: 'auth/login.html',
        controller: 'LoginController'
    })
    .when('/register', {
        templateUrl: 'auth/register.html',
        controller: 'CreateUserController'
    })
}])
.controller('LoginController', ['$scope', '$location', 'User', function($scope, $location, User){
    $scope.credentials = {};
    
    $scope.login = function(){
        User.login($scope.credentials).then(function(){
            $scope.credentials = {};
            $location.path('/home');

        }, function(data){
            $scope.alerts.push({msg: data.data.non_field_errors[0]});
        });
    };
    $scope.alerts = [];
    $scope.closeAlert = function(index){
        $scope.alerts.splice(index, 1)
    };

    $scope.fblogin = function(){
        var token = sessionStorage.getItem('fbtoken');
        User.facebookLogin(token);
        $location.path('/home');
    }

}])
.controller('CreateUserController', ['$scope', '$location', 'User', function($scope, $location, User){
    $scope.user_info = {};

    $scope.register = function(){
        User.registration($scope.user_info).then(function(){
            $scope.user_info = {};
            $location.path('/home')
        }, function(data){
            $scope.alerts.push({msg: data.data.non_field_errors[0]})
        })
    };
    $scope.alerts = [];
    $scope.closeAlert = function(index){
        $scope.alerts.splice(index, 1)
    }
}]);
