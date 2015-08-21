'use strict';

angular.module('checkin', [
  'ngRoute',
  'ngResource',
  'checkin.home',
  'checkin.map',
  'checkin.version',
  'checkin.newLocationDirective',
  'checkin.viewLocation'
]).config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]);

var backendUrl = 'http://127.0.0.1:8000'