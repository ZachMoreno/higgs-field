(function() {
    'use strict';

    angular.module('higgs.add', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/add', {
            templateUrl: 'pages/add/add.html',
            controller: 'AddController',
            access: {
                requiresLogin: true
            }
        });
    }])

    .controller('AddController', ['$scope', '$rootScope', '$location', '$cookies', '$cookieStore', 'GetServicesAPI', 'AddServicesAPI', function($scope, $rootScope, $location, $cookies, $cookieStore, GetServicesAPI, AddServicesAPI) {
        $scope.newServiceForm = {};
        $scope.newServiceForm.userID = $cookieStore.get('authentication').id;

        $scope.submitNewServiceForm = function submitNewServiceForm() {
            var newService = new AddServicesAPI.add($scope.newServiceForm);
            newService.$save();
            $location.path('/dashboard');
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
