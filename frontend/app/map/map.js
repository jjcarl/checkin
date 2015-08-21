'use strict';

angular.module('checkin.map', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/map', {
    templateUrl: 'map/map.html',
    controller: 'NewLocationController'
  });
}])

.controller('NewLocationController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.marker = []
    var location = $scope.location
    $scope.submit = function() {
        $scope.location.user = 1 // TODO ---- Assign this to an authenticated user
        $scope.location.family = 1 // TODO ---- Assign this to an authenticated user's family
        $scope.location.lat = $scope.marker[0].lat
        $scope.location.lng = $scope.marker[0].lng
        $http.post(backendUrl + '/locations/', $scope.location)
        .then(function(response){
            $scope.success = response.status
            $scope.posted = "Your point has been saved"
            $location.path('/home')
        }), function(response){
            $scope.errors = response.status
        }
    }
    $scope.reset = function(){
        $scope.location = null;
    }
}]);