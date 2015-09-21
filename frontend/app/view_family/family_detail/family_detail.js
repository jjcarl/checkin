'use strict';

angular.module('checkin.familyDetail', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/family/:memberId', {
        templateUrl: 'view_family/family_detail/family_detail.html',
        controller: 'FamilyDetailController'
    })
}])

.controller('FamilyDetailController', ['$routeParams', '$scope', '$http', function($routeParams, $scope, $http){
    var memberId = $routeParams.memberId
    $scope.checkins = []
    $http.get(backendUrl + '/users/' + memberId + '/').then(function(data){
        $scope.member = data.data
        console.log($scope.member)
        for (var i=0; i < $scope.member.checkins.length; i++) {
            $http.get(backendUrl + '/checkins/' + $scope.member.checkins[i] + '/').then(function(response){
                $scope.checkins = $scope.checkins.concat([response.data])
                console.log($scope.checkins)
            }, function(response){
                $scope.errors = response.data
            })
        }

        
    }, function(data){
        $scope.errors = data.status
    })
}])