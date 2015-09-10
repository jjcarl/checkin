'use strict';

angular.module('checkin', [
  'ngRoute',
  'ngResource',
  'checkin.home',
  'checkin.map',
  'checkin.version',
  'checkin.newLocationDirective',
  'checkin.viewLocation',
  'checkin.locDetail'
]).config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}])

var backendUrl = 'http://api.jc2dev.com'
