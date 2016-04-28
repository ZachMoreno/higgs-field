(function() {
    'use strict';

    angular.module('higgs.services', [])

    // authentication
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
    }])

    // database
    .factory('DatabaseAPI', ['$resource', function($resource) {
        var remoteBaseURL = 'http://localhost:3040/connect/databases/where/id/:id',
            databaseAPI   = {
                connect: $resource(remoteBaseURL, { id: '@id' }, {
                    query: {
                        method: 'GET'
                    }
                })
            };

        return databaseAPI;
    }])

    // services
    .factory('AddServicesAPI', ['$resource', function($resource) {
        var remoteBaseURL = 'http://localhost:3040/add/microservices/',
            addServicesAPI = {
                add: $resource(remoteBaseURL, {}, {
                    query: {
                        method: 'POST',
                        params: {
                            post: true
                        }
                    }
                })
            };

        return addServicesAPI;
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

    // service
    .factory('GetServiceAPI', ['$resource', '$cookies', '$cookieStore', function($resource, $cookies, $cookieStore) {
        var userID;

        if($cookieStore.get('authentication')){
            userID = $cookieStore.get('authentication').id;
        }

        var remoteBaseURL  = 'http://localhost:3040/get/microservices/where/id/:serviceID/and/users/id/' + userID,
            getServiceAPI  = {
                get: $resource(remoteBaseURL,
                    {
                        id: '@serviceID'
                    }, {
                        query: {
                            method: 'GET',
                            isArray: true
                        }
                    }
                )
            };

        return getServiceAPI;
    }])

    .factory('DeleteServiceAPI', ['$resource', function($resource) {
        var remoteBaseURL  = 'http://localhost:3040/delete/microservices/where/id/:serviceID',
            deleteServiceAPI  = {
                delete: $resource(remoteBaseURL,
                    {
                        id: '@serviceID'
                    }, {
                        query: {
                            method: 'GET',
                            isArray: true
                        }
                    }
                )
            };

        return deleteServiceAPI;
    }])

    .factory('UpdateServiceAPI', ['$resource', '$route', function($resource, $route) {
        var remoteBaseURL  = 'http://localhost:3040/update/microservices/where/id/' + $route.current.params.serviceID,
            updateServiceAPI  = {
                update: $resource(remoteBaseURL,
                    {
                        id: '@serviceID'
                    }, {
                        query: {
                            method: 'POST',
                            isArray: true
                        }
                    }
                )
            };

        return updateServiceAPI;
    }])

    // endpoints
    .factory('AddEndPointAPI', ['$resource', function($resource) {
        var remoteBaseURL = 'http://localhost:3040/add/endpoints',
            addEndPointAPI = {
                add: $resource(remoteBaseURL, {}, {
                    query: {
                        method: 'POST',
                        params: {
                            post: true
                        }
                    }
                })
            };

        return addEndPointAPI;
    }])

    .factory('GetEndPointsAPI', ['$resource', function($resource) {
        var remoteBaseURL  = 'http://localhost:3040/get/endpoints/where/microservices/id/:serviceID',
            getEndPointsAPI  = {
                get: $resource(remoteBaseURL,
                    {
                        id: '@serviceID'
                    }, {
                        query: {
                            method: 'GET',
                            isArray: true
                        }
                    }
                )
            };

        return getEndPointsAPI;
    }]);

})();
