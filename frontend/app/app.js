'use strict';

angular.module('checkin', [
  'ngRoute',
  'ngResource',
  'checkin.home',
  'checkin.map',
  'checkin.version',
  'checkin.newLocationDirective',
  'checkin.viewLocation',
  'checkin.locDetail',
  'checkin.userAuth',
  'checkin.viewFamily',
  'checkin.userInfo',
  'checkin.familyDetail'
]).config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}])

.run(['$rootScope', '$window', 'User', function($rootScope, $window, User) {
  
  function statusChangeCallback(response) {
    if (response.status === 'connected') {
      var token = response.authResponse.accessToken
      sessionStorage.setItem('fbtoken', token);
      
    } else if (response.status === 'not_authorized') {
      console.log('User needs to log into this app.');
    } else {
      console.log('User needs to log into Facebook first.');
    }
  }

  $window.fbAsyncInit = function() {
    // This loads the Facebook SDK
    FB.init({ 
      appId: '1649649821950343', 
      // Set to check the authentication status at the start up of the app 
      status: true, 
      // Enable cookies to allow the server to access the session 
      cookie: true, 
      /* Parse XFBML */
      xfbml: true
    });

    FB.getLoginStatus(function(response){
      statusChangeCallback(response);
    });
  };
  

  (function(d){
    // load the Facebook javascript SDK asynchronously

    var js, 
    id = 'facebook-jssdk', 
    ref = d.getElementsByTagName('script')[0];

    if (d.getElementById(id)) {
      return;
    }

    js = d.createElement('script'); 
    js.id = id; 
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";

    ref.parentNode.insertBefore(js, ref);

  }(document));

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
  if (sessionStorage.getItem('facebook_auth')){
    var token = sessionStorage.getItem('facebook_auth');
    $http.defaults.headers.common.Authorization = ' Bearer facebook ' + token;
    User.getInfo().then(function(){
      $scope.user = User.info;
      $location.path('/home');
    }, function(response){
      sessionStorage.removeItem('facebook_auth');
      $window.location.reload();
    })
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
      if (User.info.id === undefined && (nextRoute != '/register' && nextRoute != '/login' && nextRoute != '/home')){
        $location.path('/login')
      }
    }
  });

}])

var backendUrl = 'http://127.0.0.1:8000';
// var backendUrl = 'http://api.jc2dev.com'
