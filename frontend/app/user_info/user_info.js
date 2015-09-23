'use strict';

angular.module('checkin.userInfo', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/user-info', {
        templateUrl: 'user_info/user_info.html',
        controller: 'UserInfoController'
    });
}])
.controller('UserInfoController', ['$scope', 'User', '$http', '$location', '$window', function($scope, User, $http, $location, $window){
    $scope.user = User.info
    $scope.new_info = {}
    $scope.user_info = {}
    $scope.partial = {}
    if ($scope.user.info != null){
        if ($scope.user.info.family != null) {
            $http.get(backendUrl + '/families/' + $scope.user.info.family + '/').then(function(response){
                $scope.family = response.data;
            }), function(response){
                $scope.errors = response.status;
            }
        }
    }
    $scope.submit = function(){
        $http.post(backendUrl + '/families/', $scope.newfam).then(function(response){
            $scope.success = response.status;
            $scope.new_info.family = response.data.id;
            $scope.new_info.user = $scope.user.id;
            $http.post(backendUrl + '/info/', $scope.new_info).then(function(response){
                $scope.success = response.data;
                $scope.user.info = $scope.new_info;
                $window.location.reload();
            }, function(response){
                $scope.errors = response.status;
            })
        }, function(response){
            $scope.errors = response.status;
        })
    }
    $scope.info = function(){
        $scope.user_info.user = $scope.user.id
        $http.put(backendUrl + '/info/' + $scope.user.id + '/', $scope.user_info).then(function(response){
            $scope.success = response.data;
            $scope.user.info.phone_number = $scope.user_info.phone_number;
        }), function(response){
            $scope.errors = response.status;
        }
    }
    $scope.image_upload = function(){
        $scope.user_info.user = $scope.user.id
        var file = document.getElementById('pic').files[0],
            reader = new FileReader();
        reader.onload = function(e){
            $scope.user_info['profile_pic'] = 'data:image/png;base64,' + btoa(e.target.result);
            $scope.$apply();
        }
        reader.readAsBinaryString(file);

        $http.put(backendUrl + '/info/' + $scope.user.id + '/', $scope.user_info).then(function(response){
            $scope.success = response.data;
            $scope.user.info.profile_pic = $scope.user_info.profile_pic;
            }, function(response){
                $scope.errors = response.status;
        })
    }
    $scope.showform = function(){
        if($('.user-update-form').attr('visible') === 'true'){
            $('.user-update-form').hide();
            $('.user-update-form').attr('visible', 'false');
        } else {
            $('.user-update-form').show();
            $('.user-update-form').attr('visible', 'true');
        }
    }
    $scope.update = function(){
        $http.put(backendUrl + '/users/' + $scope.user.id + '/', $scope.user).then(function(response){
            $scope.success = response.status;
            $scope.partial['user'] = $scope.user.id
            $scope.partial['phone_number'] = $scope.user.info.phone_number
            $http.put(backendUrl + '/info/' + $scope.user.id + '/', $scope.partial).then(function(data){
                $scope.text = 'Your informaiton has been updated';
                $scope.success = response.status
            }, function(data){
                $scope.errors = response.status
            })
        }, function(response){
            $scope.errors = response.status;
        })
    }
    $scope.image_update = function(){
        $scope.user_info.user = $scope.user.id
        var file = document.getElementById('new_pic').files[0],
            reader = new FileReader();
        reader.onload = function(e){
            $scope.user_info.profile_pic = 'data:image/png;base64,' + btoa(e.target.result);
            $scope.$apply();
        }
        reader.readAsBinaryString(file);

        $http.put(backendUrl + '/info/' + $scope.user.id + '/', $scope.user_info).then(function(response){
            $scope.success = response.data;
            $scope.user.info.profile_pic = $scope.user_info.profile_pic;
            }, function(response){
                $scope.errors = response.status;
        })
    }
}])