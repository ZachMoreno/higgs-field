(function() {
    'use strict';

    angular.module('higgs.microservice', ['ng-route'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/microservice', {
                abstract: true
            })

            .when('/microservice/:serviceID', {
                templateUrl: 'pages/microservice/microservice.html',
                resolve: {
                    // available in controller
                    service: function($routeProvider, GetServiceAPI) {
                        var serviceID = $routeProvider.serviceID;
                        console.log(serviceID);
                        return GetServiceAPI.get.query({serviceID: serviceID}).$promise;
                    }
                },
                controller: 'MicroserviceController'
            });
    }])

    .factory('GetServiceAPI', ['$resource', function($resource) {
        var remoteBaseURL  = 'http://localhost:3040/microservices/:serviceID',
            getServiceAPI  = {
                get: $resource(remoteBaseURL,
                    {
                        serviceID: '@serviceID'
                    }, {
                        query: {
                            method: 'GET',
                            isArray: true,
                            cache: true
                        }
                    }
                )
            };

        return getServiceAPI;
    }])

    .controller('MicroserviceController', ['$scope', 'service',
                                    function($scope, service) {
        service.$promise.then(function(promisedService) {
    		$scope.service = promisedService;
    	});
    }])
})();
