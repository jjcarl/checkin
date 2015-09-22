'use strict';

angular.module('checkin.familyDetail', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/family/:memberId', {
        templateUrl: 'view_family/family_detail/family_detail.html',
        controller: 'FamilyDetailController'
    })
}])

.controller('FamilyDetailController', ['$routeParams', '$scope', '$http', 'User', function($routeParams, $scope, $http, User){
    var memberId = $routeParams.memberId
    $scope.checkins = []
    var one = {}
    var locations = User.family.locations
    $http.get(backendUrl + '/users/' + memberId + '/').then(function(data){
        $scope.member = data.data
        for (var i=0; i < $scope.member.checkins.length; i++) {
            $http.get(backendUrl + '/checkins/' + $scope.member.checkins[i] + '/').then(function(response){
                one = response.data
                for (var i = 0; i < locations.length; i++) {
                    if (one.location === locations[i].id) {
                        one.location = locations[i]
                    };
                };
                $scope.checkins = $scope.checkins.concat([one])
            }, function(response){
                $scope.errors = response.data
            })
        }
    }, function(data){
        $scope.errors = data.status
    })
}])