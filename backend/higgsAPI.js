(function() {
    'use strict';

    var express  = require('express'),
        router   = express.Router(),
        parser   = require('body-parser'),
        port     = '3040',
        hostIP   = 'localhost',
        mysql    = require('mysql'),
        sqlite   = require('sqlite3').verbose(),
        trans    = require('sqlite3-transactions').TransactionDatabase,
        higgsDB  = new trans(new sqlite.Database('higgs.db')),
        higgsAPI = express();

    // http://enable-cors.org/server_expressjs.html
    higgsAPI.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', 'content-Type,X-Requested-With');
        next();
    });

    // middleware
    higgsAPI.use(parser.json());
    higgsAPI.use(parser.urlencoded({
    	extended: true
    }));
    higgsAPI.use(express.static(__dirname + '/public'));

    // Database initialization
    higgsDB.get("SELECT name " +
                "FROM sqlite_master " +
                "WHERE type = 'table' " +
                "AND name = 'microservices' " +
                "OR name = 'dbConnections' " +
                "OR name = 'endPoints'",
        function(err, rows) {
            if(err !== null) {
                console.log(err);
            } else if(rows === undefined) {
                higgsDB.run('CREATE TABLE "microservices" ' +
                            '("id"              INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                            '"color"            VARCHAR(255), ' +
                            '"microserviceName" VARCHAR(255))',
                            function(err) {
                                if(err !== null) {
                                    console.log(err);
                                } else {
                                    console.log("higgs.microservices table initialized.");
                                }
                            });

                higgsDB.run('CREATE TABLE "dbConnections" ' +
                           '("id"             INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                            '"microserviceID" INTEGER, ' +
                            '"type"           VARCHAR(255), ' +
                            '"dbName"         VARCHAR(255), ' +
                            '"username"       VARCHAR(255), ' +
                            '"password"       VARCHAR(255), ' +
                            '"host"           VARCHAR(255), ' +
                            '"port"           INTEGER)',
                            function(err) {
                                if(err !== null) {
                                    console.log(err);
                                } else {
                                    console.log("higgs.dbConnections table initialized.");
                                }
                            });

                higgsDB.run('CREATE TABLE "endPoints" ' +
                           '("id"             INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                            '"microserviceID" VARCHAR(255), ' +
                            '"route"          VARCHAR(255), ' +
                            '"httpVerb"       VARCHAR(255), ' +
                            '"sql"            VARCHAR(255))',
                            function(err) {
                                if(err !== null) {
                                    console.log(err);
                                } else {
                                    console.log("higgs.endPoints table initialized.");
                                }
                            });
            } else {
                console.log("Higgs DB is configured & available");
            }
        });

    router
        .get('/', function (req, res) {
            res.sendFile(__dirname + '/public/' + 'index.html');
        })

        .get('/dbconnections', function (req, res, next) {
            var sql = 'SELECT * FROM dbConnections';

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    res.send(err);
                    console.log(err);
                } else {
                    res.send(resultSetData);
                }
            });
        })

        .get('/dbconnections/get/:dbConnectionID', function (req, res, next) {
            var sql = 'SELECT * FROM dbConnections ' +
                      'WHERE id = ' + req.params.dbConnectionID;

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    res.send(err);
                    console.log(err);
                } else {
                    res.send(resultSetData);
                }
            });
        })

        .get('/endpoints', function (req, res, next) {
            var sql = 'SELECT * FROM endPoints';

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    res.send(err);
                    console.log(err);
                } else {
                    res.send(resultSetData);
                }
            });
        })

        .post('/endpoints/add', function(req, res, next) {
            var microserviceID   = req.body.microserviceID,
                route            = req.body.route,
                httpVerb         = req.body.httpVerb,
                sql              = req.body.sql;

            higgsDB.beginTransaction(function(err, trans) {
                trans.run("INSERT INTO 'endPoints' (microserviceID," +
                                                    "route," +
                                                    "httpVerb," +
                                                    "sql) " +
                          "VALUES('" + microserviceID + "', '" +
                                       route          + "', '" +
                                       httpVerb       + "', '" +
                                       sql            + "')");

                trans.commit(function(err) {
                    if(err) {
                        // auto trans.rollback() runs on error
                        console.log("endpoint failed to insert.", err);
                    } else {
                        console.log("endoints was inserted successful.");
                        res.redirect('/endoints');
                    }
                });
            });
        })

        .get('/endpoints/get/:endPointID', function (req, res, next) {
            var sql = 'SELECT * FROM endPoints ' +
                      'WHERE id = ' + req.params.endPointID;

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    res.send(err);
                    console.log(err);
                } else {
                    res.send(resultSetData);
                }
            });
        })

        .get('/microservices', function (req, res, next) {
            var sql =   'SELECT microservices.id, ' +
                            'microservices.microserviceName, ' +
                            'microservices.color, ' +
                            'dbConnections.type, ' +
                            'dbConnections.dbName, ' +
                            'dbConnections.username, ' +
                            'dbConnections.password, ' +
                            'dbConnections.host, ' +
                            'dbConnections.port ' +
                        'FROM microservices ' +
                        'LEFT JOIN dbConnections ' +
                            'ON microservices.id = dbConnections.microserviceID',
                resultSet,
                subResultSet;

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    res.send(err);
                    console.log(err);
                } else {
                    res.send(resultSetData);
                }
            });
        })

        .post('/microservices/add', function(req, res, next) {
            var microserviceName = req.body.microserviceName,
                color            = req.body.color,
                type             = req.body.type,
                dbName           = req.body.dbName,
                username         = req.body.username,
                password         = req.body.password,
                host             = req.body.host,
                port             = req.body.port;

            higgsDB.beginTransaction(function(err, trans) {
                trans.run("INSERT INTO 'microservices' (color, " +
                                                       "microserviceName) " +
                          "VALUES('" + color            + "', '" +
                                       microserviceName + "')");

                trans.run("INSERT INTO 'dbConnections' (microserviceID, " +
                                                        "type, " +
                                                        "dbName, " +
                                                        "username, " +
                                                        "password, " +
                                                        "host, " +
                                                        "port) " +
                          "VALUES(last_insert_rowid(), '" +
                                  type                    + "', '" +
                                  dbName                  + "', '" +
                                  username                + "', '" +
                                  password                + "', '" +
                                  host                    + "', '" +
                                  port                    + "')");

                trans.commit(function(err) {
                    if(err) {
                        // auto trans.rollback() runs on error
                        console.log("microservice failed to insert.", err);
                    } else {
                        console.log("microservice was inserted successful.");
                        res.redirect('/microservices');
                    }
                });
            });
        })

        .get('/microservices/get/:serviceID', function(req, res, next) {
            var sql =   'SELECT microservices.id, ' +
                            'microservices.microserviceName, ' +
                            'microservices.color, ' +
                            'dbConnections.type, ' +
                            'dbConnections.dbName, ' +
                            'dbConnections.username, ' +
                            'dbConnections.password, ' +
                            'dbConnections.host, ' +
                            'dbConnections.port ' +
                        'FROM microservices ' +
                        'LEFT JOIN dbConnections ' +
                            'ON dbConnections.microserviceID = microservices.id ' +
                        'LEFT JOIN endPoints ' +
                            'ON endPoints.microserviceID = microservices.id ' +
                        'WHERE microservices.id = ' + req.params.serviceID;

            // select DB object by id
            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    res.send(err);
                    console.log(err);
                } else {
                    res.send(resultSetData);
                }
            });
        })

        .get('/microservices/get/:serviceID/endpoints', function(req,res,next) {
            var sql = 'SELECT * FROM endPoints ' +
                      'WHERE microserviceID = ' + req.params.serviceID;

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    res.send(err);
                    console.log(err);
                } else {
                    res.send(resultSetData);
                }
            });
        })

        .get('/microservices/delete/:serviceID', function(req, res, next) {
            higgsDB.beginTransaction(function(err, trans) {
                trans.run('DELETE FROM microservices ' +
                          'WHERE microservices.id = ' + req.params.serviceID);

                trans.run('DELETE FROM dbConnections ' +
                          'WHERE dbConnections.microserviceID = ' + req.params.serviceID);

                trans.run('DELETE FROM endPoints ' +
                          'WHERE endPoints.microserviceID = ' + req.params.serviceID);

                trans.commit(function(err) {
                    if(err) {
                        // auto trans.rollback() runs on error
                        console.log("failed to delete microservice id:" + req.params.serviceID, err);
                    } else {
                        console.log("successfully deleted microservice id:" + req.params.serviceID);
                        res.redirect('/microservices');
                    }
                });
            });
        });


    higgsAPI.use(router);
    higgsAPI.listen(port, hostIP, function() {
        console.log('higgs API is awake @ http://' + hostIP + ':' + port);
    });
})();
