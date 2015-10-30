(function () {
  'use strict';

  angular.module('higgs.home', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
  	$routeProvider.when('/home', {
  		templateUrl: 'pages/home/home.html',
      controller: 'HomeController'
  	});
  }])

  .factory('GetServicesAPI', ['$resource', function($resource) {
    var remoteBaseURL  = 'http://localhost:3040/microservices',

        getServicesAPI   = {
          get: $resource(remoteBaseURL, {}, {
                                              query: {
                                                  method: 'GET',
                                                  isArray: true,
                                                  cache: true
                                              }
                                            })
        };

    return getServicesAPI;
  }])

  .controller('HomeController', ['$scope', '$rootScope', 'GetServicesAPI', function($scope, $rootScope, GetServicesAPI) {
    GetServicesAPI.get.query().$promise.then(function(promisedServices) {
      $rootScope.services = promisedServices;
    })
  }]);
})();
