(function() {
    'use strict';

    var q           = require('Q'),
        rp          = require('request-promise'),
        sqlite      = require('sqlite3').verbose(),
        trans       = require('sqlite3-transactions').TransactionDatabase,
        higgsDB     = new trans(new sqlite.Database('higgs.db')),
        mysql       = require('./mysqlAdapter.js'),
        dbConnector = {};

    dbConnector.connectSingleDB = function(dbID) {
        var d       = q.defer(),
            dbObj   = {},
            options = {
                uri: "http://localhost:3040/get/databases/where/microservices/id/" + dbID,
                json: true // Auto pars JSON in the response
            };

        rp(options).then(function (json) {
            dbObj = json[0];

            switch (dbObj.type) {
                case "mysql":

                    var connection = {
                        status: 'mysql connection not configured'
                    };

                    mysql.connect(dbObj).then(function(mysql){
                	    // mysql.on('error', function (err, result) {
                	    //     connection.status = 'connection error';
                        //     d.resolve(connection);
                	    // });

                        connection.status = 'connected';

                        d.resolve(connection);
                	}, function() {
                        connection.status = 'connection error';
                        d.resolve(connection);
                    });

                    break;

                case "oracle":

                    d.resolve({
                        status: 'disconnected'
                    });

                    break;

                case "ms-sql":

                    d.resolve({
                        status: 'disconnected'
                    });

                    break;

                case "sqlite":

                    d.resolve({
                        status: 'disconnected'
                    });

                    break;

                default:

                    d.resolve({
                        status: 'could not identify db'
                    });
            } // end switch
        });



        return d.promise;
    };

    module.exports = dbConnector;
})();
