(function() {
  'use strict';

  var express = require('express'),
      router  = express.Router(),
      parser  = require('body-parser'),
      port    = '3040',
      hostIP  = 'localhost',
      sqlite3 = require('sqlite3').verbose(),
      higsDB  = new sqlite3.Database('higs.db'),
      mysql   = require('mysql'),
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
      higsDB.run('CREATE TABLE "dbConnections" ' +
                 '("id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                  '"type"     VARCHAR(255), ' +
                  '"username" VARCHAR(255), ' +
                  '"password" VARCHAR(255), ' +
                  '"host"     VARCHAR(255), ' +
                  '"port"     VARCHAR(255))', function(err) {
        if(err !== null) {
          console.log(err);
        } else {
          console.log("SQL Table 'higs.dbConnections' initialized.");
        }
      });
    } else {
      console.log("SQL Table 'higs.dbConnections' already initialized.");
    }
});

  router
    .get('/', function (req, res) {
      res.send('<h1>higsAPI</h1>');
    })

    .get('/db-connections', function (req, res, next) {
      higsDB.all('SELECT * FROM dbConnections ORDER BY type', function(err, row) {
       if(err !== null) {
         res.send(err);
       } else {
         res.send(row);
       }
     });
    })

    .post('/db-connections', function(req, res, next) {
      // build DB object
      var type     = req.body.type,
          username = req.body.username,
          password = req.body.password,
          host     = req.body.host,
          port     = req.body.port,
          sql      = "INSERT INTO 'dbConnections' (type, username, password, host, port) " +
                     "VALUES('" + type + "', '" +
                                  username + "', '" +
                                  password + "', '" +
                                  host + "', '" +
                                  port + "')";

      higsDB.run(sql, function(err) {
        if(err !== null) {
          res.send(err);
        } else {
          // res.redirect('back');
        }
      });

      res.redirect('/db-connections');
    })

    .get('/db-connections/delete/:id', function(req, res, next) {
      // remove DB object by id
      higsDB.run("DELETE FROM dbConnections WHERE id='" + req.params.id + "'",
       function(err) {
        if(err !== null) {
          res.send(err);
        } else {
          // res.redirect('back');
        }
      });

      res.redirect('/db-connections');
    });



  higsAPI.use(router);
  higsAPI.listen(port, hostIP, function() {
      console.log('higsAPI is awake @ ' + hostIP + ':' + port);
  });
})();
