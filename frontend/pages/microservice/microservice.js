(function() {
    'use strict';

    angular.module('higgs.microservice', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/microservices/:serviceID', {
            templateUrl: 'pages/microservice/microservice.html',
            controller: 'MicroserviceController',
            resolve: {
                // available in controller
                service: function service(GetServiceAPI, $route) {
                    var serviceID = $route.current.params.serviceID;
                    return GetServiceAPI.get.query({serviceID: serviceID}).$promise;
                }
            }
        });
    }])

    .factory('GetServiceAPI', ['$resource', function($resource) {
        var remoteBaseURL  = 'http://localhost:3040/microservices/get/:serviceID',
            getServiceAPI  = {
                get: $resource(remoteBaseURL,
                    {
                        id: '@serviceID'
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
    		$scope.service = promisedService[0];
    	});
    }])
})();
