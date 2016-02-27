//contains all the routes for test module
var express     = require('express');
var app         = module.exports = express();

var dbTest             = require(DEFS.DIR.R_TESTS_DB);
var restServiceApi     = require(DEFS.DIR.R_TESTS_REST_SERVICE_API);
var testGcm            = require(DEFS.DIR.R_TESTS_GCM);
var dbTestMongo        = require(DEFS.DIR.R_TESTS_DB_MONGO);

dbTestObj       = new dbTest();
restServiceApi  = new restServiceApi();
testGcmObj 		  = new testGcm();
dbTestMongo 		= new dbTestMongo();

app.get('/mysql', function(req, res) {
  dbTestObj.mysqlAction(req,res);
});

app.post('/restapi', function(req, res) {
  restServiceApi.restApiTestAction(req,res);
});

//http://localhost:3000/testgcm?deviceId=1
app.get('/testgcm', function(req, res) {
  testGcmObj.sendGcmMessage(req,res);
});

app.get('/mongo', function(req, res) {
  dbTestMongo.action(req,res);
});
