(function() {
    'use strict';

    var sqlite  = require('sqlite3').verbose(),
        trans   = require('sqlite3-transactions').TransactionDatabase,
        higgsDB = new trans(new sqlite.Database('higgs.db'));

    exports.getSingleDB = function getSingleDB(dbID) {
        var sql = 'SELECT * ' +
                  'FROM dbConnections ' +
                  'WHERE id = ' + dbID;

        higgsDB.all(sql, function(err, resultSetData) {
            if(err !== null) {
                console.log(err);
            } else {
                return resultSetData[0];
            }
        });
    };

    exports.connectSingleDB = function connectSingleDB(DB) {
        switch (DB.type) {
            case "mysql":
                return 'mysql db';
                break;

            case "oracle":
                return 'oracle db';
                break;

            case "ms-sql":
                return 'ms-sql db';
                break;

            case "sqlite":
                return 'sqlite db';
                break;

            default:
                console.log("Sorry, we are out of " + DB.type + ".");
        } // end switch
    };

    return module.exports;
})();
