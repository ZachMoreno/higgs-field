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


    .controller('DashboardController', ['$scope', '$rootScope', 'GetServicesAPI', 'DatabaseAPI', function($scope, $rootScope, GetServicesAPI, DatabaseAPI) {

        GetServicesAPI.get.query().$promise.then(function(promisedServices) {
            $rootScope.services = promisedServices;
            angular.forEach(promisedServices, function(service) {
                service.status = "Disconnected";

                DatabaseAPI.connect.query({ id: service.id }).$promise.then(function(promisedConnection) {
                    service.status = promisedConnection.status;
                });
            });
        });
    }]);
})();
