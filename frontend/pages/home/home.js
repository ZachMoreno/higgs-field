(function () {
    'use strict';

    angular.module('higgs.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'pages/home/home.html',
            controller: 'HomeController'
        });

        $routeProvider.otherwise({ redirectTo: '/home' });
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

    .controller('HomeController', ['$scope', '$rootScope', 'GetServicesAPI',
                            function($scope, $rootScope, GetServicesAPI) {
        GetServicesAPI.get.query().$promise.then(function(promisedServices) {
            $rootScope.services = promisedServices;
        });
    }]);
})();
