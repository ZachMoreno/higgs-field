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
        // res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'content-Type,X-Requested-With');
        next();
    });

    // middleware
    higgsAPI.use(parser.json());
    higgsAPI.use(parser.urlencoded({
    	extended: true
    }));

    // Database initialization
    higgsDB.get("SELECT name FROM sqlite_master WHERE type='table' AND name='higgs'",
        function(err, rows) {
        if(err !== null) {
            console.log(err);
        } else if(rows === undefined) {
            higgsDB.run('CREATE TABLE "microservices" ' +
                        '("id"              INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                        '"microserviceName" VARCHAR(255), ' +
                        '"dbConnectionID"   INTEGER)',
                        function(err) {
                            if(err !== null) {
                                console.log(err);
                            } else {
                                console.log("'higgs.microservices' table initialized.");
                            }
                        });

            higgsDB.run('CREATE TABLE "dbConnections" ' +
                       '("id"         INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                        '"endPointID" INTEGER, ' +
                        '"type"       VARCHAR(255), ' +
                        '"dbName"     VARCHAR(255), ' +
                        '"username"   VARCHAR(255), ' +
                        '"password"   VARCHAR(255), ' +
                        '"host"       VARCHAR(255), ' +
                        '"port"       INTEGER)',
                        function(err) {
                            if(err !== null) {
                                console.log(err);
                            } else {
                                console.log("'higgs.dbConnections' table initialized.");
                            }
                        });

            higgsDB.run('CREATE TABLE "endPoints" ' +
                       '("id"       INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                        '"route"    VARCHAR(255), ' +
                        '"httpVerb" VARCHAR(255), ' +
                        '"sql"      VARCHAR(255))',
                        function(err) {
                            if(err !== null) {
                                console.log(err);
                            } else {
                                console.log("'higgs.endPoints' table initialized.");
                            }
                        });
        } else {
            // console.log("SQL Table 'higs.endPoint' already initialized.");
        }
    });

    router
        .get('/', function (req, res) {
            res.send('<h1>higgsAPI</h1>');
        })

        .get('/dbconnections', function (req, res, next) {
            var sql = 'SELECT * FROM dbConnections';

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    res.send(err);
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
                } else {
                    res.send(resultSetData);
                }
            });
        })

        .post('/microservices', function(req, res, next) {
                // endpoint
            var route     = req.body.route,
                httpVerb  = req.body.httpVerb,
                sql       = req.body.sql,

                // db connection
                type     = req.body.type,
                dbName   = req.body.dbName,
                username = req.body.username,
                password = req.body.password,
                host     = req.body.host,
                port     = req.body.port,

                // microservice
                microserviceName = req.body.microserviceName;

            higgsDB.beginTransaction(function(err, trans) {
                trans.run("INSERT INTO 'endPoints' (route," +
                                                    "httpVerb," +
                                                    "sql) " +
                          "VALUES('" + route    + "', '" +
                                       httpVerb + "', '" +
                                       sql      + "')");

                trans.run("INSERT INTO 'dbConnections' (type," +
                                                        "endPointID," +
                                                        "dbName," +
                                                        "username," +
                                                        "password," +
                                                        "host," +
                                                        "port) " +
                          "VALUES('" + type +
                                  "', last_insert_rowid(), '" +
                                  dbName     + "', '" +
                                  username   + "', '" +
                                  password   + "', '" +
                                  host       + "', '" +
                                  port       + "')");

                trans.run("INSERT INTO 'microservices' (microserviceName," +
                                                       "dbConnectionID) " +
                          "VALUES('" + microserviceName +
                                  "', last_insert_rowid())");

                trans.commit(function(err) {
                    if(err) {
                        // auto trans.rollback() runs on error
                        console.log("commit() failed.", err);
                    } else {
                        console.log("commit() was successful.");
                        res.redirect('/microservices');
                    }
                });
            });
        })

        .get('/microservices', function (req, res, next) {
            var sql =   'SELECT microservices.id, ' +
                            'microservices.microserviceName, ' +
                            'dbConnections.type, ' +
                            'dbConnections.dbName, ' +
                            'dbConnections.username, ' +
                            'dbConnections.password, ' +
                            'dbConnections.host, ' +
                            'dbConnections.port, ' +
                            'endPoints.route, ' +
                            'endPoints.httpVerb, ' +
                            'endPoints.sql ' +
                        'FROM microservices ' +
                        'JOIN dbConnections ' +
                            'ON microservices.dbConnectionID = dbConnections.id ' +
                        'JOIN endPoints ' +
                            'ON dbConnections.endPointID = endPoints.id';

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    res.send(err);
                } else {
                    res.send(resultSetData);
                }
            });
        })

        .get('/microservices/get/:serviceID', function(req, res, next) {
            var sql =   'SELECT microservices.id, ' +
                            'microservices.microserviceName, ' +
                            'dbConnections.type, ' +
                            'dbConnections.dbName, ' +
                            'dbConnections.username, ' +
                            'dbConnections.password, ' +
                            'dbConnections.host, ' +
                            'dbConnections.port, ' +
                            'endPoints.route, ' +
                            'endPoints.httpVerb, ' +
                            'endPoints.sql ' +
                        'FROM microservices ' +
                        'JOIN dbConnections ' +
                            'ON microservices.dbConnectionID = dbConnections.id ' +
                        'JOIN endPoints ' +
                            'ON dbConnections.endPointID = endPoints.id ' +
                        'WHERE microservices.id = ' + req.params.serviceID;

            // select DB object by id
            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    res.send(err);
                } else {
                    res.send(resultSetData);
                }
            });
        })

        .get('/microservices/delete/:serviceID', function(req, res, next) {
            var sql = "DELETE FROM microServices WHERE id='" + req.params.serviceID + "'";

            // remove DB object by id
            higgsDB.run(sql, function(err) {
                if(err !== null) {
                    res.send(err);
                } else {
                    res.redirect('/microservices');
                }
            });
        });


    higgsAPI.use(router);
    higgsAPI.listen(port, hostIP, function() {
        console.log('higgsAPI is awake @ ' + hostIP + ':' + port);
    });
})();
