(function () {
  'use strict';

  angular.module('higs.home', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
  	$routeProvider.when('/home', {
  		templateUrl: 'pages/home/home.html',
      controller: 'HomeController'
  	});
  }])

  .factory('ServicesAPI', ['$resource', function($resource) {
    var remoteBaseURL  = 'http://localhost:3040/db-connections',

        servicesAPI   = {
          getAllServices: $resource(remoteBaseURL, {}, {
                                                          query: {
                                                              method: 'GET',
                                                              isArray: true,
                                                              cache: true
                                                          }
                                                        })
        };

    return servicesAPI;
  }])

  .controller('HomeController', ['$scope', '$rootScope', 'ServicesAPI', function($scope, $rootScope, ServicesAPI) {
    ServicesAPI.getAllServices.query().$promise.then(function(promisedServices) {
      $rootScope.services = promisedServices;

      console.log($scope.services);
    })
  }]);
})();
