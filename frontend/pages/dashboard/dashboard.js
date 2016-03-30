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


    .controller('DashboardController', ['$scope', '$rootScope', 'GetServicesAPI',
                            function($scope, $rootScope, GetServicesAPI) {

        GetServicesAPI.get.query().$promise.then(function(promisedServices) {
            $rootScope.services = promisedServices;
        });
    }]);
})();
