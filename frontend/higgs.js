(function () {
    'use strict';

    // higs app
    angular.module('higgs', [
                   // global dependencies
                   'ngRoute',
                   'ngResource',
                   'ngMaterial',

                   // pages
                   'higgs.home',
                   'higgs.add',
                   'higgs.microservice'
    ])

    .config(function() {

    })

    .run(function(){

    });
})();
