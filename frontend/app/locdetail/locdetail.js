'use strict';

angular.module('checkin.locDetail', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/viewloc/:locationId', {
        templateUrl: 'locdetail/locdetail.html',
        controller: 'LocationDetailController'
    })
}])
.controller('LocationDetailController', ['$scope', '$routeParams', 'Location', '$http', '$location', function($scope, $routeParams, Location, $http, $location, $attrs, $observe){
    Location.get({locationId: $routeParams.locationId}, function(response){
        $scope.location = response
        $scope.title = $scope.location.title
        $scope.marker = {'lat': $scope.location.lat, 'lng': $scope.location.lng}
        $scope.lists = $scope.location.todos

        
    })
    var todo = $scope.todo
    $scope.submit = function(){
        $scope.todo.user = 1 // TODO --- Assign this to the authenticated user
        $scope.todo.location = $scope.location.id
        $http.post(backendUrl + '/todo/', $scope.todo)
        .then(function(response){
            $scope.success = response.status
            $scope.posted = "The item has been saved to your list"
            $scope.lists.push(response.data)
            $scope.todo = null
        }),
         function(response){
            $scope.errors = response.status;
         }
    }
    $scope.reset = function(){
        $scope.todo = null
    }
    // TODO - Get this function working. This might be better in a different view....
    // $scope.change = function(){
    //     var id = $(this).attr('data-id')
    //     console.log(id)
    //     $http.post(backendUrl + '/todo/' + id, $scope.completed)
    //     .then(function(response){
    //         $scope.changed = response.status
    //         if ($scope.completed === false){
    //             $scope.message = "Your item has been marked completed"
    //         } else{
    //             $scope.message = "Your item is not completed"
    //         }
    //     }),
    //     function(response){
    //         $scope.errors = response.status
    //     }
    // }
    // $scope.edit = function(){
        // TODO - either write this function here or put it in a separate view
    // }
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