'use strict';

angular.module('checkin.viewLocation', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/viewloc', {
        templateUrl: 'viewloc/viewloc.html',
        controller: 'ViewLocationController'
    });
}])
.controller('ViewLocationController', ['$scope', '$http', 'User', function($scope, $http, User){
    $scope.user = User.info
    $scope.locations = User.family.locations
    // Using the user.family in the User service instead of this code
    // Keeping the below code here for now, will delete after all services are good
    // $scope.family = $scope.user.info.family
    // $http.get(backendUrl + '/families/' + $scope.family + '/').then(function(response){
    //     $scope.locations = response.data.locations
    // }), function(response){
    //     $scope.error = response.status
    // }
    $scope.$watch('locations', function(){
        if ($scope.locations){
            $scope.points = []
            $scope.title = []

            for (var i = 0; i < $scope.locations.length; i++){
                $scope.points[i] = {
                    'lat': $scope.locations[i].lat, 
                    'lng': $scope.locations[i].lng
                }
                $scope.title[i] = $scope.locations[i].title
            }
        }
    })
}])
.directive('locmap', function(){
    return {
        restrict: 'E',
        scope: {
            points: '=',
            title: '='
        },
        link: function(scope, element, attrs){
            var marker;
            var markerMap;

            var markers = scope.points

            var drawMap = function() {
                var mapInfo = {
                    zoom: 12,
                    center: new google.maps.LatLng(scope.points[0].lat, scope.points[0].lng),
                    mapTypeId: google.maps.MapTypeId.SATELLITE
                };

                markerMap = new google.maps.Map(element[0], mapInfo);
                for (var i = 0; i < scope.points.length; i++){
                    var marker = new google.maps.Marker({
                        position: scope.points[i],
                        title:scope.title[i]
                    })
                    marker.setMap(markerMap)
                }
                
            }
            scope.$watch('points', function(){
                if (scope.points){
                    drawMap();
                }
            })
            
        }
    }
})