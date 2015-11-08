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
                            isArray: true
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
                            isArray: true
                        }
                    }
                )
            };

        return getEndPointsAPI;
    }])

    .factory('DeleteServiceAPI', ['$resource', function($resource) {
        var remoteBaseURL  = 'http://localhost:3040/microservices/delete/:serviceID',
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

    .factory('UpdateServiceAPI', ['$resource', function($resource) {
        var remoteBaseURL  = 'http://localhost:3040/microservices/update/:serviceID',
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

    .controller('MicroserviceController', ['$scope', '$rootScope', '$location', '$route', 'GetServicesAPI', 'DeleteServiceAPI', 'UpdateServiceAPI', 'service', 'endPoints', function($scope, $rootScope, $location, $route, GetServicesAPI, DeleteServiceAPI, UpdateServiceAPI, service, endPoints) {
        $scope.deleteService = function deleteService() {
            var serviceID = $route.current.params.serviceID;
            DeleteServiceAPI.delete.query({serviceID: serviceID}).$promise.then(function() {
                $location.path('/home');
            });
        };

        $scope.updateService = function updateService() {
            var updateService = new UpdateServiceAPI.update($scope.service);
            updateService.$save();
            $location.path('/home');
        };

        service.$promise.then(function(promisedService) {
    		$scope.service = promisedService[0];
    	});

        endPoints.$promise.then(function(promisedEndPoints) {
            $scope.endPoints = promisedEndPoints;
        });

        // sidebar
        GetServicesAPI.get.query().$promise.then(function(promisedServices) {
            $rootScope.services = promisedServices;
        });
    }])
})();
