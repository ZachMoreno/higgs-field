(function () {
  'use strict';

  // higs app
  angular.module('higs', [
    // global dependencies
    'ngRoute',

    // pages
    'higs.home',

    // elements
    'higs.content-types'
  ])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({ redirectTo: '/home' });
  }])

  .run(function(){

  });
})();
