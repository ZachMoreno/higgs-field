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

    // initial
    $scope.contentTypes = [
      {'name': 'pages'}
    ];

    $scope.openNewContentTypeDialog = function openNewContentTypeDialog() {

    };

    $scope.saveNewContentType = function saveNewContentType(newContentTypeName) {
      $scope.newContentType = {'name': newContentTypeName};

      $scope.contentTypes.push($scope.newContentType);

      console.log($scope.contentTypes);
    };

    // saveNewContentType('photos')
  }]);
})();
