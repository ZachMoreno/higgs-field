(function() {
    'use strict';

    var q           = require('Q'),
        sqlite      = require('sqlite3').verbose(),
        trans       = require('sqlite3-transactions').TransactionDatabase,
        higgsDB     = new trans(new sqlite.Database('higgs.db')),
        mysql       = require('./mysqlAdapter.js'),
        dbConnector = {};

    dbConnector.getSingleDB = function(dbID) {
        var d   = q.defer(),
            sql = 'SELECT * ' +
                  'FROM dbConnections ' +
                  'WHERE id = ' + dbID;

        higgsDB.all(sql, function(err, resultSetData) {
            if(err !== null) {
                console.log(err);
                d.reject();
            } else {
                d.resolve(resultSetData[0]);
            }
        });

        return d.promise;
    };

    dbConnector.connectSingleDB = function(dbObj) {
        var d = q.defer();

        switch (dbObj.type) {
            case "mysql":

                var connection = {
                    status: 'mysql connection not configured'
                };

                // mysql.connect(dbObj).then(function(mysql){
            	//     mysql.on('error', function (err, result) {
            	//         connection.status = 'connection error';
            	//     });
                //     connection.status = 'connected';
            	// });

                d.resolve(connection);

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

        return d.promise;
    };

    module.exports = dbConnector;
})();
