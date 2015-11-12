(function () {
    'use strict';

    // higs app
    angular.module('higgs', [
                   // global dependencies
                   'ngRoute',
                   'ngResource',
                   'ngMaterial',
                   'toaster',

                   // pages
                   'higgs.login',
                   'higgs.home',
                   'higgs.add',
                   'higgs.microservice'
    ])

    .config(function() {

    })

    .run(function(){

    });
})();
