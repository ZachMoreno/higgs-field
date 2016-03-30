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


    .controller('LoginController', ['$scope', '$rootScope', '$location', '$cookies', '$cookieStore', 'AuthenticationAPI', 'AddUsersAPI', 'toaster', function($scope, $rootScope, $location, $cookies, $cookieStore, AuthenticationAPI, AddUsersAPI, toaster) {

        $scope.createAccount = false;
        $scope.loginForm = {};
        $scope.addUserForm = {};

        $scope.addUser = function addUser() {
            if($scope.addUserForm.password === $scope.addUserForm.confirm) {
                var user = new AddUsersAPI.add($scope.addUserForm);

                user.$save().then(function(res) {
                    if(res.added === true) {
                        toaster.pop({
                            type: 'success',
                            title: 'Thanks!',
                            body: res.feedback,
                            showCloseButton: true
                        });

                        $scope.createAccount = false;
                        $scope.loginForm.username = $scope.addUserForm.username;
                        $scope.loginForm.password = $scope.addUserForm.password;

                        $scope.authenticate();
                    }
                });
            } else {
                toaster.pop({
                    type: 'error',
                    title: 'Nope!',
                    body: 'Passwords do not match',
                    showCloseButton: true
                });
            }
        };

        $scope.authenticate = function authenticate() {
            var auth = new AuthenticationAPI.authenticate($scope.loginForm);
            auth.$save().then(function(res) {

                if(res.authenticated === true) {
                    toaster.pop({
                        type: 'success',
                        title: 'Thanks!',
                        body: res.feedback,
                        showCloseButton: true
                    });

                    $cookieStore.put('authentication', res);
                    $location.path('/dashboard');
                } else {
                    toaster.pop({
                        type: 'error',
                        title: 'Nope',
                        body: res.feedback,
                        showCloseButton: true
                    });

                    $rootScope.authenticated = false;
                }
            });
        };
    }])
})();
