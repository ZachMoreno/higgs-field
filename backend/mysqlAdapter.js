(function() {
    'use strict';

    var mysql        = require('mysql'),
        q            = require('Q'),
        mysqlAdapter = {};

    mysqlAdapter.connect = function connect(dbObj) {
    	var d              = q.defer(),
            assembledDBObj = {
        		host     : dbObj.host,
        		database : dbObj.dbName,
        		user     : dbObj.username,
        		password : dbObj.password
        	},
            connection     = mysql.createConnection(assembledDBObj);

            console.log(assembledDBObj);

    	connection.connect(function(err) {
    		if(err) {
    			console.log('Not connected: ', err.toString(), ' RETRYING...');
            	d.reject();
    		} else {
    			console.log('Connected to MySQL');
                d.resolve(mysqlDB.connection);
    		}
    	});

    	return d.promise;
    };

    mysqlAdapter.disconnect = function disconnect() {
    	mysqlDB.connection.end();
    	console.log('Disconnected from MySQL');
    };

    mysqlAdapter.attemptReconnect = function attemptReconnect(){
	    mysqlDB.connect().then(function(con){
			console.log("successfully reconnected. getting new reference...");
	        var mysql = con;

	        mysql.on('error', function (err, result) {
	            mysqlDB.reconnect();
	        });
	    }, function (error) {
			console.log("attempting to reconnect");
	        setTimeout(mysqlDB.reconnect, 2000);
	    });
	};

    module.exports = mysqlAdapter;
})();
