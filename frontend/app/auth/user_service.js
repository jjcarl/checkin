'use strict';

angular.module('checkin.userAuth')

.service('User', ['$http', '$rootScope', '$location', '$window', function($http, $rootScope, $location, $window){
    var user = {};
    user.info = {};
    // user.family = {};
    var clientId = '8MKwdnQxInAwOKO7MOc1zJiAqWuLJEqp7RIuVfR9'
    var clientSecret = 'LqE3ENDTXTAWUQNVbBnDQMHXPKQJqPxrF2m1t7dG3cJiNpevw19WEqdgCUKRgf7hlRu5sckhp8d6cl3uKOY7orkaoFzxSNT5RGhfSXu4GDHGefPRcDsSBQo8hXNmBmFU'

    

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
            // return user.getFamily();
        })
    };
    user.logout = function(){
        user.info = {};
        sessionStorage.removeItem(user.token_name);
        sessionStorage.removeItem('fbtoken');
        sessionStorage.removeItem('facebook_auth');
        $window.location.reload();
    };

    user.facebookLogin = function(token){
        sessionStorage.setItem('facebook_auth', token);
        $http.defaults.headers.common.Authorization = ' Bearer facebook ' + token;
        return user.getInfo();
    }

    // Need to figure out displaying new content in order to use this.
    // Maybe try appending the new locations to this User.Family value
    // user.getFamily = function(){
    //     return $http.get(backendUrl + '/families/' + user.info.info.family + '/').then(function(data){
    //         user.family = data.data;
    //     })
    // }
    user.token_name = 'auth-token';
    user.update_broadcast = 'user-updated';
    return user
}])
