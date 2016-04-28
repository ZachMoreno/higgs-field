(function() {
    'use strict';

    var express     = require('express'),
        router      = express.Router(),
        parser      = require('body-parser'),
        port        = '3040',
        hostIP      = 'localhost',
        winston     = require('winston'),
        sqlite      = require('sqlite3').verbose(),
        trans       = require('sqlite3-transactions').TransactionDatabase,
        higgsDB     = new trans(new sqlite.Database('higgs.db')),
        higgsAPI    = express(),
        dbConnector = require('./dbConnector.js');

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

    // logging
    var logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),

            new (winston.transports.File)({
                name: 'info-file',
                filename: __dirname + '/public/logs/info.log',
                level: 'info'
            }),

            new (winston.transports.File)({
                name: 'error-file',
                filename: __dirname + '/public/logs/error.log',
                level: 'error'
            })
        ]
    });

    // Database initialization
    higgsDB.get("SELECT name " +
                "FROM sqlite_master " +
                "WHERE type = 'table' " +
                "AND name = 'users' " +
                "AND name = 'microservices' " +
                "OR name = 'dbConnections' " +
                "OR name = 'endPoints'",
        function(err, rows) {
            if(err !== null) {
                logger.info(err);
            } else if(rows === undefined) {
                higgsDB.run('CREATE TABLE "users" ' +
                            '("id"      INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                            '"username" VARCHAR(255), ' +
                            '"password" VARCHAR(255))',
                            function(err) {
                                if(err !== null) {
                                    logger.error(err);
                                } else {
                                    logger.info("higgs.users table initialized.");
                                }
                            });

                higgsDB.run('CREATE TABLE "microservices" ' +
                            '("id"              INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                            '"userID"           INTEGER, ' +
                            '"color"            VARCHAR(255), ' +
                            '"microserviceName" VARCHAR(255))',
                            function(err) {
                                if(err !== null) {
                                    logger.error(err);
                                } else {
                                    logger.info("higgs.microservices table initialized.");
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
                                    logger.error(err);
                                } else {
                                    logger.info("higgs.dbConnections table initialized.");
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
                                    logger.error(err);
                                } else {
                                    logger.info("higgs.endPoints table initialized.");
                                }
                            });
            } else {
                logger.info("Higgs DB is Online");
            }
        });


    router
        .get('/', function (req, res) {
            res.sendFile(__dirname + '/public/' + 'index.html');
        })


        .post('/login', function(req, res, next) {
            var sql = 'SELECT * ' +
                      'FROM users ' +
                      'WHERE username = "' + req.body.username + '" ' +
                      'AND password = "' + req.body.password + '"';

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    logger.error('/login', err);
                } else {
                    logger.info('/login');

                    if(resultSetData[0] &&
                       resultSetData[0].username === req.body.username &&
                       resultSetData[0].password === req.body.password) {
                        res.send({
                            'id': resultSetData[0].id,
                            'username': resultSetData[0].username,
                            'authenticated': true,
                            'feedback': 'You\'re In',
                            'microservices': []
                        });
                    } else {
                        res.send({
                            'authenticated': false,
                            'feedback' : 'Username and or Password are incorrect'
                        });
                    }
                }
            });
        })


        .post('/add/users', function(req, res, next) {
            var username   = req.body.username,
                password   = req.body.password;

            higgsDB.beginTransaction(function(err, trans) {
                trans.run("INSERT INTO 'users' (username," +
                                                "password) " +
                          "VALUES('" + username + "', '" +
                                       password + "')");

                trans.commit(function(err) {
                    if(err) {
                        logger.error('/add/users/', err);
                    } else {
                        logger.info('/add/users/');
                        res.send({
                            'added': true,
                            'feedback': 'New User Created'
                        });
                    }
                });
            });
        })


        .get('/get/microservices/where/users/id/:userID', function (req, res, next) {
            var sql = 'SELECT microservices.id, ' +
                           'microservices.userID, ' +
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
                           'ON microservices.id = dbConnections.microserviceID ' +
                      'WHERE microservices.userID = ' + req.params.userID;

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    logger.error('/get/microservices/where/users/id/' + req.params.userID, err);
                } else {
                    logger.info('/get/microservices/where/users/id/' + req.params.userID);
                    res.send(resultSetData);
                }
            });
        })


        .get('/get/microservices/where/id/:id/and/users/id/:userID', function(req, res, next) {
            var sql =   'SELECT microservices.id, ' +
                            'microservices.userID, ' +
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
                        'WHERE microservices.id = ' + req.params.id + ' ' +
                        'AND microservices.userID = ' + req.params.userID;

            // select DB object by id
            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    logger.error('/get/microservices/where/id/' + req.params.id + '/and/users/id/' + req.params.userID, err);
                } else {
                    logger.info('/get/microservices/where/id/' + req.params.id + '/and/users/id/' + req.params.userID);
                    res.send(resultSetData);
                }
            });
        })


        .post('/add/microservices', function(req, res, next) {
            var microserviceName = req.body.microserviceName,
                userID           = req.body.userID,
                color            = req.body.color,
                type             = req.body.type,
                dbName           = req.body.dbName,
                username         = req.body.username,
                password         = req.body.password,
                host             = req.body.host,
                port             = req.body.port;

            higgsDB.beginTransaction(function(err, trans) {
                trans.run("INSERT INTO 'microservices' (userID, " +
                                                       "color, " +
                                                       "microserviceName) " +
                          "VALUES('" + userID           + "', '" +
                                       color            + "', '" +
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
                        logger.error('/add/microservices/', err);
                    } else {
                        logger.info('/add/microservices/');
                    }
                });
            });
        })


        .get('/delete/microservices/where/id/:id', function(req, res, next) {
            higgsDB.beginTransaction(function(err, trans) {
                trans.run('DELETE FROM microservices ' +
                          'WHERE microservices.id = ' + req.params.id);

                trans.run('DELETE FROM dbConnections ' +
                          'WHERE dbConnections.microserviceID = ' + req.params.id);

                trans.run('DELETE FROM endPoints ' +
                          'WHERE endPoints.microserviceID = ' + req.params.id);

                trans.commit(function(err) {
                    if(err) {
                        logger.error('/delete/microservices/where/id/' + req.params.id, err);
                    } else {
                        logger.info('/delete/microservices/where/id/' + req.params.id);
                    }
                });
            });
        })


        .post('/update/microservices/where/id/:id', function(req, res, next) {
            var microserviceName       = req.body.microserviceName,
                id                     = req.params.id,
                color                  = req.body.color,
                type                   = req.body.type,
                dbName                 = req.body.dbName,
                username               = req.body.username,
                password               = req.body.password,
                host                   = req.body.host,
                port                   = req.body.port;

            higgsDB.beginTransaction(function(err, trans) {
                trans.run('UPDATE microservices ' +
                          'SET color            = "' + color            + '", ' +
                              'microserviceName = "' + microserviceName + '" ' +
                          'WHERE id = ' + id);

                trans.run('UPDATE dbConnections ' +
                          'SET type     = "' + type     + '", ' +
                              'dbName   = "' + dbName   + '", ' +
                              'username = "' + username + '", ' +
                              'password = "' + password + '", ' +
                              'host     = "' + host     + '", ' +
                              'port     = "' + port     + '" ' +
                          'WHERE microserviceID = ' + id);

                trans.commit(function(err) {
                    if(err) {
                        logger.error(microserviceName + " microservice (id : " + id + ") failed to update", err);
                    } else {
                        logger.info('/update/microservices/where/id/' + id);
                    }
                });
            })
        })


        .get('/get/databases', function (req, res, next) {
            var sql = 'SELECT * FROM dbConnections';

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    logger.error('/get/databases/', err);
                } else {
                    logger.info('returned all databases');
                    res.send(resultSetData);
                }
            });
        })


        .get('/get/databases/where/microservices/id/:id', function (req, res, next) {
            var sql = 'SELECT * FROM dbConnections ' +
                      'WHERE microserviceID = ' + req.params.id;

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    logger.error('/get/databases/id/' + req.params.id, err);
                } else {
                    logger.info('returned database id: ' + req.params.id);
                    res.send(resultSetData);
                }
            });
        })


        .get('/connect/databases/where/id/:id', function(req, res, next) {
            var dbID = req.params.id;

            // attempt db connection only after we have the db data returned
            dbConnector.connectSingleDB(dbID).then(function(promisedDBConnection){
                res.send(promisedDBConnection);
            }, function(err) {
                res.send(err);
            }).done();
        })


        .get('/get/endpoints', function (req, res, next) {
            var sql = 'SELECT * FROM endPoints';

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    logger.error('/get/endpoints/', err);
                } else {
                    logger.info('returned all endpoints');
                    res.send(resultSetData);
                }
            });
        })


        .get('/get/endpoints/where/id/:id', function (req, res, next) {
            var sql = 'SELECT * FROM endPoints ' +
                      'WHERE id = ' + req.params.id;

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    logger.error('/get/endpoints/id', err);
                } else {
                    logger.info('returned endpoint id: ' + req.params.id);
                    res.send(resultSetData);
                }
            });
        })


        .get('/get/endpoints/where/microservices/id/:id/', function(req,res,next) {
            var sql = 'SELECT * FROM endPoints ' +
                      'WHERE microserviceID = ' + req.params.id;

            higgsDB.all(sql, function(err, resultSetData) {
                if(err !== null) {
                    logger.error('/get/endpoints/where/microservices/id/' + req.params.id, err);
                } else {
                    logger.info('/get/endpoints/where/microservices/id/' + req.params.id);
                    res.send(resultSetData);
                }
            });
        })


        .post('/add/endpoints', function(req, res, next) {
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
                        logger.error('/add/endpoints/', err);
                    } else {
                        logger.info('added endpoint');
                        res.send({
                            feedback: route + ' Endpoint Added Successfuly'
                        });
                    }
                });
            });
        });



    higgsAPI.use(router);
    higgsAPI.listen(port, hostIP, function() {
        logger.info('higgs API is awake @ http://' + hostIP + ':' + port);
    });
})();
