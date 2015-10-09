(function () {
  'use strict';

  angular.module('higs.content-types', [])

  .config(['$routeProvider', function($routeProvider) {
  	$routeProvider.when('/content-types', {
  		templateUrl: 'pages/content-types/content-types.html',
  		controller: 'ContentTypesController'
  	});
  }])

  .directive('content-types', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'elements/content-types/content-types.html',
      controller: 'ContentTypesController'
    };
  })

  // <content-types></content-types>

  .controller('ContentTypesController', ['$scope', function($scope) {
    $scope.contentTypes = [
      {'name': 'pages'},
      {'name': 'posts'}
    ];
  }]);
})();
