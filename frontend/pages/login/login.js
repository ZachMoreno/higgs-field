(function() {
    'use strict';

    angular.module('higgs.login', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'pages/login/login.html',
            controller: 'LoginController'
        });

        $routeProvider.otherwise({ redirectTo: '/login' });
    }])

    .controller('LoginController', ['$scope', '$rootScope', 'GetServicesAPI',
                            function($scope, $rootScope, GetServicesAPI) {
        GetServicesAPI.get.query().$promise.then(function(promisedServices) {
            $rootScope.services = promisedServices;
        });

        $rootScope.isLoggedIn = false;
        $scope.createAccount = false;

        $scope.createAccount = function createAccount() {

        };

        $scope.login = function login() {

        };
    }])
})();
