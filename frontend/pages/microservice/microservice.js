(function() {
    'use strict';

    angular.module('higgs.microservice', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/microservice/:serviceID', {
            templateUrl: 'pages/microservice/microservice.html',
            controller: 'MicroserviceController',
            access: {
                requiresLogin: true
            },
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

    .controller('MicroserviceController', ['$scope', '$rootScope', '$location', '$route', 'GetServicesAPI', 'DeleteServiceAPI', 'UpdateServiceAPI', 'AddEndPointAPI', 'GetEndPointsAPI', 'service', 'endPoints', 'toaster', function($scope, $rootScope, $location, $route, GetServicesAPI, DeleteServiceAPI, UpdateServiceAPI, AddEndPointAPI, GetEndPointsAPI, service, endPoints, toaster) {

        $scope.deleteService = function deleteService() {
            var serviceID = $route.current.params.serviceID;
            DeleteServiceAPI.delete.query({serviceID: serviceID});
            $location.path('/dashboard');
        };

        $scope.updateService = function updateService() {
            var updateService = new UpdateServiceAPI.update($scope.service);
            updateService.$save();
            $location.path('/dashboard');
        };

        $scope.newEndPointForm = {
            microserviceID: $route.current.params.serviceID
        };

        $scope.submitNewEndPointForm = function() {
            var newEndPoint = new AddEndPointAPI.add($scope.newEndPointForm);
            newEndPoint.$save().then(function(res) {
                toaster.pop({
                    type: 'success',
                    title: 'Wooo!',
                    body: res.feedback,
                    showCloseButton: true
                });

                GetEndPointsAPI.get.query({id: $scope.newEndPointForm.microserviceID}).$promise.then(function(promisedEndPoints) {
                    $scope.endPoints = promisedEndPoints;
                });
            });

            endPoints.$promise.then(function(promisedEndPoints) {
                $scope.endPoints = promisedEndPoints;
            });
        };

        $scope.clearNewEndPointForm = function clearNewEndPointForm() {
            $scope.newEndPointForm = {
                microserviceID: $route.current.params.serviceID
            };
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
    }]);
})();
