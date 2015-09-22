'use strict';

angular.module('checkin.userAuth')

.service('User', ['$http', '$rootScope', '$location', '$window', function($http, $rootScope, $location, $window){
    var user = {};
    user.info = {};
    user.family = {};

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
            return user.getFamily();

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
        FB.login(function(response){
            if (response.status === 'connected'){
                var token = response.authResponse.accessToken
                sessionStorage.setItem('fbtoken', token);
                $http.defaults.headers.common.Authorization = ' Bearer facebook ' + token;
                return user.getInfo();
            } else if (response.status === 'not_authorized') {
                // not authenticated with the app
              document.getElementById('status').innerHTML = 'Please log ' +
                'into this app.';
            } else {
                // not logged in to facebook
              $location.path('/login')
            }
        }, {scope: 'public_profile,email'})
    }

    user.getFamily = function(){
        $http.get(backendUrl + '/families/' + user.info.info.family + '/').then(function(data){
            user.family = data.data
        })
    }

    // Consider adding check-ins to the User service


    user.token_name = 'auth-token';
    user.update_broadcast = 'user-updated';
    return user
}])
