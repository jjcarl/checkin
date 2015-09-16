'use strict';

angular.module('checkin', [
  'ngRoute',
  'ngResource',
  // 'ngCookies',
  'checkin.home',
  'checkin.map',
  'checkin.version',
  'checkin.newLocationDirective',
  'checkin.viewLocation',
  'checkin.locDetail',
  'checkin.userAuth',
  'checkin.viewFamily',
  'checkin.userInfo'
]).config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}])

.controller('AuthController', ['$scope', '$location', '$http', 'User', '$window', '$routeParams', function($scope, $location, $http, User, $window, $routeParams){
  if (sessionStorage.getItem(User.token_name)){
    var token = sessionStorage.getItem(User.token_name);

    if(token){
      $http.defaults.headers.common.Authorization = ' Token ' + token;
      User.getInfo().then(function(){
        $scope.user = User.info;
        $location.path('/home');
        
      }, function(response){
        sessionStorage.removeItem(User.token_name);
        $window.location.reload();
      })
    }
  }
  $scope.logout = function(){
    User.logout();
    $scope.user = null;
    $window.location.reload();
    $location.path('/login');
  };

  $scope.$on(User.update_broadcast, function(){
    $scope.user = User.info;
  })

  $scope.$on('$routeChangeStart', function(event, next){
    if(next.$$route != undefined){
      var nextRoute = next.$$route.originalPath;
      if (User.info.id === undefined && (nextRoute != '/register' && nextRoute != '/login')){
        $location.path('/login')
      }
    }
  });

}]);

var backendUrl = 'http://127.0.0.1:8000';
// var backendUrl = 'http://api.jc2dev.com'