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

    .factory('GetServicesAPI', ['$resource', function($resource) {
        var remoteBaseURL  = 'http://localhost:3040/get/microservices',
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
