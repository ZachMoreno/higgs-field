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

    .factory('AuthenticationAPI', ['$resource', function($resource) {
        var remoteBaseURL = 'http://localhost:3040/login',
            authenticationAPI = {
                authenticate: $resource(remoteBaseURL, {}, {
                    query: {
                        method: 'POST',
                        params: {
                            post: true
                        }
                    }
                })
            };

        return authenticationAPI;
    }])

    .factory('AddUsersAPI', ['$resource', function($resource) {
        var remoteBaseURL = 'http://localhost:3040/add/users',
            addUsersAPI = {
                add: $resource(remoteBaseURL, {}, {
                    query: {
                        method: 'POST',
                        params: {
                            post: true
                        }
                    }
                })
            };

        return addUsersAPI;
    }])

    .controller('LoginController', ['$scope', '$rootScope', '$location', 'GetServicesAPI', 'AuthenticationAPI', 'AddUsersAPI', 'toaster', function($scope, $rootScope, $location, GetServicesAPI, AuthenticationAPI, AddUsersAPI, toaster) {
        GetServicesAPI.get.query().$promise.then(function(promisedServices) {
            $rootScope.services = promisedServices;
        });

        $rootScope.isLoggedIn = false;
        $scope.createAccount = false;

        $scope.addUser = function addUser() {
            $scope.addUserForm = {};

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
                    }
                })
            } else {

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

                    $rootScope.auth = res;
                    $location.path('/home');
                } else {
                    toaster.pop({
                        type: 'error',
                        title: 'Nope',
                        body: res.feedback,
                        showCloseButton: true
                    });
                }
            });
        };
    }])
})();
