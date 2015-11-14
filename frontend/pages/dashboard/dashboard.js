(function () {
    'use strict';

    angular.module('higgs.dashboard', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: 'pages/dashboard/dashboard.html',
            controller: 'DashboardController',
            access: {
                requiresLogin: true
            }
        });
    }])

    .factory('GetServicesAPI', ['$resource', '$cookies', '$cookieStore', function($resource, $cookies, $cookieStore) {
        if($cookieStore.get('authentication')){
            var userID = $cookieStore.get('authentication').id
        }
        
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
    }])

    .controller('DashboardController', ['$scope', '$rootScope', 'GetServicesAPI',
                            function($scope, $rootScope, GetServicesAPI) {
        GetServicesAPI.get.query().$promise.then(function(promisedServices) {
            $rootScope.services = promisedServices;
        });
    }]);
})();
