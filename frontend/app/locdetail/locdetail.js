'use strict';

angular.module('checkin.locDetail', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/viewloc/:locationId', {
        templateUrl: 'locdetail/locdetail.html',
        controller: 'LocationDetailController'
    })
}])
.controller('LocationDetailController', ['$scope', '$routeParams', 'Location', function($scope, $routeParams, Location){
    Location.get({locationId: $routeParams.locationId}, function(response){
        $scope.location = response
        $scope.title = $scope.location.title
    	$scope.marker = {'lat': $scope.location.lat, 'lng': $scope.location.lng}
    })
}])
.directive('locdetail', function(){
    return {
        restrict: 'E',
        scope: {
            marker: '=',
            title: '='
        },
        link: function(scope, element, attrs){
            var marker;
            var markerMap;

            var drawMap = function() {
                var mapInfo = {
                    zoom: 12,
                    center: new google.maps.LatLng(scope.marker.lat, scope.marker.lng),
                    mapTypeId: google.maps.MapTypeId.SATELLITE
                };

                markerMap = new google.maps.Map(element[0], mapInfo);
                    var marker = new google.maps.Marker({
                        position: scope.marker,
                        title:scope.title
                    })
                    marker.setMap(markerMap)
                
                
            }
            scope.$watch('marker', function(){
                if (scope.marker){
                    drawMap();
                }
            })
            
        }
    }
})
.service('Location', ['$resource', function($resource){
    return $resource(backendUrl + '/locations/:locationId/', {}, {})
}])