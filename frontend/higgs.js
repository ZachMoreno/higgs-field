(function () {
    'use strict';

    // higs app
    angular.module('higgs', [
                   // global dependencies
                   'ngRoute',
                   'ngResource',

                   // pages
                   'higgs.home',
                   'higgs.add',
                   'higgs.microservice'
    ])

    .run(function(){

    });
})();
