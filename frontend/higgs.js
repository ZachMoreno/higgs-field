(function () {
    'use strict';

    // higs app
    angular.module('higgs', [
                   // global dependencies
                   'ngRoute',
                   'ngResource',
                   'ngCookies',
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

    .run(['$rootScope', '$location', '$cookies', '$cookieStore', 'toaster', function($rootScope, $location, $cookies, $cookieStore, toaster){
        $rootScope.isLoggedIn = false;

        $rootScope.$on('$routeChangeStart', function (event, next) {
            // route interception & forced login
            if(next.originalPath != '/login' &&
               $cookieStore.get('authentication') === undefined &&
               next.access != undefined) {

                $cookieStore.remove('authentication');
                $location.path('/login');
            }

            if($cookieStore.get('authentication') != undefined) {
                $rootScope.authenticated = $cookieStore.get('authentication').authenticated;
            } else {
                $rootScope.authenticated = false;
            }
        });

        $rootScope.logout = function logout() {
            $cookieStore.remove('authentication');
            toaster.pop({
                type: 'success',
                title: 'Thanks!',
                body: 'Peace Out',
                showCloseButton: true
            });
            $location.path('/login');
        }
    }]);
})();
