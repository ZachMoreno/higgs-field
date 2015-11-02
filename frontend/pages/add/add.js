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
        var remoteBaseURL = 'http://localhost:3040/microservices',
            addServicesAPI = {
                add: $resource(remoteBaseURL, {}, {
                    query: {
                        method: 'POST',
                        params: { post: true }
                    }
                })
            };

        return addServicesAPI;
    }])

    .controller('AddController', ['$scope', '$rootScope', 'GetServicesAPI', 'AddServicesAPI',
                            function($scope, $rootScope, GetServicesAPI, AddServicesAPI) {
        $scope.newServiceForm = {};

        $scope.submitNewServiceForm = function submitNewServiceForm() {
            var newService = new AddServicesAPI.add($scope.newServiceForm);
            newService.$save();
        };

        $scope.clearNewServiceForm = function clearNewServiceForm() {
            $scope.newServiceForm = {};
        };

        GetServicesAPI.get.query().$promise.then(function(promisedServices) {
            $rootScope.services = promisedServices;
        });
    }]);
})();
