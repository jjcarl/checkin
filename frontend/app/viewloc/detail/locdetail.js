'use strict';

angular.module('checkin.locDetail', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/viewloc/locationId', {
        templateUrl: 'viewloc/detail/locdetail.html',
        controller: 'LocationDetailController'
    })
}])
.controller('LocationDetailController', ['$scope', '$routeParams', 'Location', function($scope, $routeParams, Location){
    
}])