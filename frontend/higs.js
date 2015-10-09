(function () {
  'use strict';

  // higs app
  angular.module('higs', [
    // global dependencies
    'ngRoute',

    // pages
    'higs.home'
  ])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({ redirectTo: '/home' });
  }])

  .run(function(){

  });
})();
