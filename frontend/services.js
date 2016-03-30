(function() {
    'use strict';

    angular.module('higgs.services', [])


    .factory('AuthenticationAPI', ['$resource', function($resource) {
        var remoteBaseURL = 'http://localhost:3040/login',
            authenticationAPI = {
                authenticate: $resource(remoteBaseURL, {}, {
                    query: {
                        method: 'POST',
                        params: {
                            post: true
                        }
                    }
                })
            };

        return authenticationAPI;
    }])


    .factory('GetServicesAPI', ['$rootScope', '$resource', '$cookies', '$cookieStore',
                        function($rootScope, $resource, $cookies, $cookieStore) {

        // $rootScope.$on('$routeChangeStart', function (event, next) {
            var userID;

            // route interception & forced login
            // if(next.originalPath !== '/login') {
                if($cookieStore.get('authentication')){
                    userID = $cookieStore.get('authentication').id;

                    console.log('$cookieStore.get(\'authentication\').id');
                } else if($rootScope.id) {
                    userID = $rootScope.id;

                    console.log('$rootScope.id');
                } else {
                    console.log('no userID');
                }
            // }

            var remoteBaseURL  = 'http://localhost:3040/get/microservices/where/users/id/' + userID,
                getServicesAPI   = {
                    get: $resource(remoteBaseURL, {}, {
                        query: {
                            method: 'GET',
                            isArray: true
                        }
                    })
                };

            return getServicesAPI;
        // });

    }])


    .factory('AddUsersAPI', ['$resource', function($resource) {
        var remoteBaseURL = 'http://localhost:3040/add/users',
            addUsersAPI = {
                add: $resource(remoteBaseURL, {}, {
                    query: {
                        method: 'POST',
                        params: {
                            post: true
                        }
                    }
                })
            };

        return addUsersAPI;
    }]);
})();
