(function () {
  'use strict';

  // higs app
  angular.module('higgs', [
    // global dependencies
    'ngRoute',
    'ngResource',

    // pages
    'higgs.home',
    'higgs.add'
  ])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({ redirectTo: '/home' });
  }])

  .run(function(){

  });
})();
