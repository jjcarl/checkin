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
    var locations = User.family.locations
    $http.get(backendUrl + '/users/' + memberId + '/').then(function(data){
        $scope.member = data.data
        if($scope.member.checkins.length > 0){
            for (var i=0; i < $scope.member.checkins.length; i++) {
                for (var i = 0; i < locations.length; i++) {
                    if ($scope.member.checkins[i].location === locations[i].id) {
                        $scope.member.checkins[i].location = locations[i]
                    };
                };
            }
        }
    }, function(data){
        $scope.errors = data.status
    })
}])