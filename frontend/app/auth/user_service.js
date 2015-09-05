'use strict';

angular.module('checkin.userAuth')

.service('User', ['$http', '$rootScope', function($http, $rootScope){
    var user = {};
    user.info = {};
    

    user.registration = function(user_info){
        return $http.post(backendUrl + '/register-user/', user_info)
        .then(function(){
            return user.login(user_info)
        })
    };
    user.login = function(credentials){
        return $http.post(backendUrl + '/api-token-auth/', credentials).then(function(data){
            sessionStorage.setItem(user.token_name, data.data.token);
            $http.defaults.headers.common.Authorization = ' Token ' + data.data.token;
            return user.getInfo();
        })
    };

    user.getInfo = function(){
        return $http.get(backendUrl + '/get-user-info/').then(function(data){
            user.info = data.data;
            $rootScope.$broadcast(user.update_broadcast);
        })
    };
    user.logout = function(){
        user.info = {};
        sessionStorage.removeItem(user.token_name);
        $http.defaults.header.common.Authorization = '';
    };
    user.token_name = 'auth-token';
    user.update_broadcast = 'user-updated';
    return user
}]);