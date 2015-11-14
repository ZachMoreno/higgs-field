(function () {
    'use strict';

    // higs app
    angular.module('higgs', [
                   // global dependencies
                   'ngRoute',
                   'ngResource',
                   'ngMaterial',
                   'toaster',

                   // pages
                   'higgs.login',
                   'higgs.dashboard',
                   'higgs.add',
                   'higgs.microservice'
    ])

    .config(function() {

    })

    .run(['$rootScope', '$location', function($rootScope, $location){
        $rootScope.isLoggedIn = false;

        $rootScope.$on('$routeChangeStart', function (event, next) {
            // route interception & forced login
            if(next.originalPath !== '/login' &&
               !$rootScope.isLoggedIn &&
               next.access !== undefined) {
                $location.path('/login');
            }
        });

        $rootScope.logout = function logout() {
            $rootScope.isLoggedIn = false;
            $location.path('/login');
        }
    }]);
})();
