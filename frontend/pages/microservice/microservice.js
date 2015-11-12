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
        var remoteBaseURL  = 'http://localhost:3040/get/microservices/where/id/:serviceID',
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
    }])

    .factory('DeleteServiceAPI', ['$resource', function($resource) {
        var remoteBaseURL  = 'http://localhost:3040/delete/microservices/:serviceID',
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
        var remoteBaseURL  = 'http://localhost:3040/update/microservices/where/id/:serviceID',
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

    .factory('AddEndPointAPI', ['$resource', function($resource) {
        var remoteBaseURL = 'http://localhost:3040add/endpoints/add',
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

    .controller('MicroserviceController', ['$scope', '$rootScope', '$location', '$route', 'GetServicesAPI', 'DeleteServiceAPI', 'UpdateServiceAPI', 'AddEndPointAPI', 'service', 'endPoints', function($scope, $rootScope, $location, $route, GetServicesAPI, DeleteServiceAPI, UpdateServiceAPI, AddEndPointAPI, service, endPoints) {
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

        $scope.newEndPointForm = {
            'id': service.id
        };

        $scope.newEndPointForm = {};

        $scope.submitNewEndPointForm = function() {
            var newEndPoint = new AddEndPointAPI.add($scope.newEndPointForm);
            newEndPoint.$save();

            endPoints.$promise.then(function(promisedEndPoints) {
                $scope.endPoints = promisedEndPoints;
            });
        }

        $scope.clearNewEndPointForm = function clearNewEndPointForm() {
            $scope.newEndPointForm = {};
        }

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
