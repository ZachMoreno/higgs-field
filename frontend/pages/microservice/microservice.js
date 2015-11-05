(function() {
    'use strict';

    angular.module('higgs.microservice', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/microservice/:serviceID', {
            templateUrl: 'pages/microservice/microservice.html',
            controller: 'MicroserviceController',
            resolve: {
                // available in controller
                service: function service(GetServiceAPI, $route) {
                    var serviceID = $route.current.params.serviceID;
                    return GetServiceAPI.get.query({serviceID: serviceID}).$promise;
                },
                endPoints: function endPoints(GetEndPointsAPI, $route) {
                    var serviceID = $route.current.params.serviceID;
                    return GetEndPointsAPI.get.query({serviceID: serviceID}).$promise;
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


    .factory('GetEndPointsAPI', ['$resource', function($resource) {
        var remoteBaseURL  = 'http://localhost:3040/microservices/get/:serviceID/endpoints',
            getEndPointsAPI  = {
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

        return getEndPointsAPI;
    }])

    .controller('MicroserviceController', ['$scope', '$rootScope', 'GetServicesAPI', 'service', 'endPoints', function($scope, $rootScope, GetServicesAPI, service, endPoints) {
        service.$promise.then(function(promisedService) {
    		$scope.service = promisedService[0];
    	});

        GetServicesAPI.get.query().$promise.then(function(promisedServices) {
            $rootScope.services = promisedServices;
        });

        endPoints.$promise.then(function(promisedEndPoints) {
            $scope.endPoints = promisedEndPoints;
        });
    }])
})();
