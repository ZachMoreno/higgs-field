(function () {
  'use strict';

  angular.module('higs.home', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
  	$routeProvider.when('/home', {
  		templateUrl: 'pages/home/home.html',
  		controller: 'HomeCtrl'
  	});

    $routeProvider.otherwise({ redirectTo: '/home' });
  }])

  .controller('HomeCtrl', ['$scope', function($scope) {
    $scope.pageHeader = "higs";
  }]);
})();
