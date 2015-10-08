'use strict';

angular.module('checkin.map', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/map', {
    templateUrl: 'map/map.html',
    controller: 'NewLocationController'
  });
}])

.controller('NewLocationController', ['$scope', '$http', '$location', 'User', '$window', function($scope, $http, $location, User, $window) {
    $scope.marker = []
    $scope.user = User.info
    var location = $scope.location
    $scope.submit = function() {
        $scope.location.user = $scope.user.id
        $scope.location.family = $scope.user.info.family
        $scope.location.lat = $scope.marker[0].lat
        $scope.location.lng = $scope.marker[0].lng
        $http.post(backendUrl + '/locations/', $scope.location)
        .then(function(response){
            $scope.success = response.status;
            User.getFamily();
            $location.path('/home')
            
        }), function(response){
            $scope.errors = response.status
        }
    }
    $scope.reset = function(){
        $scope.location = null;
    }
}]);