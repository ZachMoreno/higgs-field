(function () {
  'use strict';

  angular.module('higs.home', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
  	$routeProvider.when('/home', {
  		templateUrl: 'pages/home/home.html'
  	});
  }])

  .controller('HomeController', ['$scope', function($scope) {
    this.pageHeader = "higs field";
  }])

  .controller('ContentTypesController', ['$scope', function($scope) {
    $scope.contentTypes = [
      {'name': 'pages'},
      {'name': 'posts'}
    ];
  }]);
})();
