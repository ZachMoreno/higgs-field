(function () {
    'use strict';

    angular.module('higgs.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'pages/home/home.html',
            controller: 'HomeController'
        });

        $routeProvider.otherwise({ redirectTo: '/home' });
    }])

    .factory('GetServicesAPI', ['$resource', function($resource) {
        var remoteBaseURL  = 'http://localhost:3040/microservices',
            getServicesAPI   = {
                get: $resource(remoteBaseURL, {}, {
                    query: {
                        method: 'GET',
                        isArray: true
                    }
                })
            };

        return getServicesAPI;
    }])

    .controller('HomeController', ['$scope', '$rootScope', 'GetServicesAPI',
                            function($scope, $rootScope, GetServicesAPI) {
        GetServicesAPI.get.query().$promise.then(function(promisedServices) {
            $rootScope.services = promisedServices;
        });

        $rootScope.isLoggedIn = true;

        $scope.createAccount = function createAccount() {
            $rootScope.login = !$rootScope.login;
            return true;
        }

        $scope.login = function login() {
            $rootScope.createAccount = !$rootScope.createAccount;
            return true;
        }

        $scope.createAccount = false;
    }]);
})();
