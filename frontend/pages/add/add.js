(function() {
    'use strict';

    angular.module('higgs.add', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/add', {
            templateUrl: 'pages/add/add.html',
            controller: 'AddController'
        });
    }])

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

    .controller('AddController', ['$scope', '$rootScope', '$location', 'GetServicesAPI', 'AddServicesAPI', function($scope, $rootScope, $locations, GetServicesAPI, AddServicesAPI) {
        $scope.newServiceForm = {};

        $scope.submitNewServiceForm = function submitNewServiceForm() {
            var newService = new AddServicesAPI.add($scope.newServiceForm);
            newService.$save();
            $location.path('/home');
        };

        $scope.clearNewServiceForm = function clearNewServiceForm() {
            $scope.newServiceForm = {};
        };

        // sidebar
        GetServicesAPI.get.query().$promise.then(function(promisedServices) {
            $rootScope.services = promisedServices;
        });
    }]);
})();
