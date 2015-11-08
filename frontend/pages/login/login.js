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

    .controller('LoginController', ['$scope', '$rootScope',
                            function($scope, $rootScope) {
        $scope.loginForm = {
            'username': 'admin',
            'password': 'admin'
        };
    }])
})();
