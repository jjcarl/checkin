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
  'checkin.userInfo',
  'checkin.familyDetail'
]).config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}])

.run(['$rootScope', '$window', function($rootScope, $window) {

  $rootScope.user = {};

  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  $window.fbAsyncInit = function() {
    // This loads the Facebook SDK
    FB.init({ 
      appId: '1649649821950343', 
      /* 
       Adding a Channel File improves the performance 
       of the javascript SDK, by addressing issues 
       with cross-domain communication in certain browsers. 
      */
      channelUrl: 'app/channel.html', 
      /* 
       Set if you want to check the authentication status
       at the start up of the app 
      */
      status: true, 
      /* 
       Enable cookies to allow the server to access 
       the session 
      */
      cookie: true, 
      /* Parse XFBML */
      xfbml: true,
      // Facebook says to use version 2.2
      version    : 'v2.2' 
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

// .service('SocialAuth', ['$rootScope', function($rootScope){
//     watchLoginChange = function() {

//       var _self = this;

//       FB.Event.subscribe('auth.authResponseChange', function(res) {

//         if (res.status === 'connected') {
          
//           /* 
//            The user is already logged, 
//            is possible retrieve his personal info
//           */
//           _self.getUserInfo();

//           /*
//            This is also the point where you should create a 
//            session for the current user.
//            For this purpose you can use the data inside the 
//            res.authResponse object.
//           */

//         } 
//         else {

//           /*
//            The user is not logged to the app, or into Facebook:
//            destroy the session on the server.
//           */
           
//         }

//       });

//     }

//     getUserInfo = function() {

//       var _self = this;

//       FB.api('/me', function(res) {

//         $rootScope.$apply(function() { 

//           $rootScope.user = _self.user = res; 

//         });

//       });

//     }

//     logout = function() {

//       var _self = this;

//       FB.logout(function(response) {

//         $rootScope.$apply(function() { 

//           $rootScope.user = _self.user = {}; 

//         }); 

//       });

//     }
// }])

var backendUrl = 'http://127.0.0.1:8000';
// var backendUrl = 'http://api.jc2dev.com'