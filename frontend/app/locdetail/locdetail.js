'use strict';

angular.module('checkin.locDetail', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/viewloc/:locationId', {
        templateUrl: 'locdetail/locdetail.html',
        controller: 'LocationDetailController'
    })
}])
.controller('LocationDetailController', ['$scope', '$routeParams', 'Location', '$http', '$location', 'User', function($scope, $routeParams, Location, $http, $location, User){

    Location.get({locationId: $routeParams.locationId}, function(response){
        $scope.location = response
        $scope.title = $scope.location.title
        $scope.marker = {'lat': $scope.location.lat, 'lng': $scope.location.lng}
        $scope.lists = $scope.location.todos

        
    })
    var todo = $scope.todo
    $scope.submit = function(){
        $scope.todo.user = User.info.id
        $scope.todo.location = $scope.location.id
        $scope.todo.family = User.info.info.family
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
    $scope.complete = function(list){
        list.completed = true
        $http.put(backendUrl + '/todo/' + list.id + '/', list).then(function(response){
        }, function(response){
            $scope.errors = response.status
        })
    }
    $scope.incomplete = function(list){
        list.completed = false
        $http.put(backendUrl + '/todo/' + list.id + '/', list).then(function(response){
        }, function(response){
            $scope.errors = response.status
        })
    }
    $scope.showform = function(){
        if($('.edit-todo-form').attr('visible') === 'true'){
            $('.edit-todo-form').hide();
            $('.edit-todo-form').attr('visible', 'false');
        } else {
            $('.edit-todo-form').show();
            $('.edit-todo-form').attr('visible', 'true');
        }
    }
    $scope.update = function(list){
        $http.put(backendUrl + '/todo/' + list.id + '/', list).then(function(data){
            $scope.success = data.status
            $('.edit-todo-form').hide();
            $('.edit-todo-form').attr('visible', 'false');
        }, function(data){
            $scope.errors = data.status
        })
    }
   
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