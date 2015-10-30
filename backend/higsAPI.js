(function() {
  'use strict';

  var express = require('express'),
      router  = express.Router(),
      parser  = require('body-parser'),
      port    = '3040',
      hostIP  = 'localhost',
      mysql   = require('mysql'),
      sqlite3 = require('sqlite3').verbose(),
      higsDB  = new sqlite3.Database('higs.db'),
      higsAPI = express();

  // http://enable-cors.org/server_expressjs.html
  higsAPI.all('*', function(req, res, next) {
  	res.header('Access-Control-Allow-Origin', '*');
  	// res.header('Access-Control-Allow-Methods', 'GET');
  	res.header('Access-Control-Allow-Headers', 'content-Type,X-Requested-With');
  	next();
  });

  // middleware
  higsAPI.use(parser.json());
  higsAPI.use(parser.urlencoded({
  	extended: true
  }));

  // Database initialization
  higsDB.get("SELECT name FROM sqlite_master WHERE type='table' AND name='higs'",
    function(err, rows) {
      if(err !== null) {
        console.log(err);
      } else if(rows === undefined) {
        higsDB.run('CREATE TABLE "microServices" ' +
                   '("id"             INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '"dbConnectionID" VARCHAR(255), ' +
                    '"endPointID"     VARCHAR(255))', function(err) {
          if(err !== null) {
            console.log(err);
          } else {
            console.log("'higs.microServices' table initialized.");
          }
        });

        higsDB.run('CREATE TABLE "dbConnections" ' +
                   '("id"             INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '"microServiceID" INTEGER, ' +
                    '"type"           VARCHAR(255), ' +
                    '"dbName"         VARCHAR(255), ' +
                    '"username"       VARCHAR(255), ' +
                    '"password"       VARCHAR(255), ' +
                    '"host"           VARCHAR(255), ' +
                    '"port"           VARCHAR(255))', function(err) {
          if(err !== null) {
            console.log(err);
          } else {
            console.log("'higs.dbConnections' table initialized.");
          }
        });

        higsDB.run('CREATE TABLE "endPoints" ' +
                   '("id"             INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '"microServiceID" INTEGER, ' +
                    '"route"          VARCHAR(255), ' +
                    '"httpVerb"       VARCHAR(255), ' +
                    '"sql"            VARCHAR(255))', function(err) {
          if(err !== null) {
            console.log(err);
          } else {
            console.log("'higs.endPoints' table initialized.");
          }
        });
      } else {
        // console.log("SQL Table 'higs.endPoint' already initialized.");
      }
  });

  router
    .get('/', function (req, res) {
      res.send('<h1>higsAPI</h1>');
    })

    .get('/dbconnections', function (req, res, next) {
      var sql = 'SELECT * FROM dbConnections';

      higsDB.all(sql, function(err, resultSetData) {
       if(err !== null) {
         res.send(err);
       } else {
         res.send(resultSetData);
       }
     });
    })

    .get('/microservices', function (req, res, next) {
      var sql = 'SELECT * FROM microServices';

      higsDB.all(sql, function(err, resultSetData) {
       if(err !== null) {
         res.send(err);
       } else {
         res.send(resultSetData);
       }
     });
    })

    .post('/microservices', function(req, res, next) {
      // build DB object
      var type     = req.body.type,
          dbName   = req.body.dbName,
          username = req.body.username,
          password = req.body.password,
          host     = req.body.host,
          port     = req.body.port,
          sql      = "INSERT INTO 'dbConnections' (type, dbName, username, password, host, port) " +
                     "VALUES('" + type + "', '" +
                                  dbName + "', '" +
                                  username + "', '" +
                                  password + "', '" +
                                  host + "', '" +
                                  port + "')";

      higsDB.run(sql, function(err) {
        if(err !== null) {
          res.send(err);
        } else {
          res.redirect('/microservices');
        }
      });
    })

    .get('/microservices/delete/:id', function(req, res, next) {
      var sql = "DELETE FROM microServices WHERE id='" + req.params.id + "'";

      // remove DB object by id
      higsDB.run(sql, function(err) {
        if(err !== null) {
          res.send(err);
        } else {
          res.redirect('/microservices');
        }
      });
    });



  higsAPI.use(router);
  higsAPI.listen(port, hostIP, function() {
      console.log('higsAPI is awake @ ' + hostIP + ':' + port);
  });
})();
