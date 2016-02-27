//contains all the routes for spark  apis
var express           = require('express');
var app               = module.exports = express();
var locations         = require(DEFS.DIR.R_API_LOCATIONS);
var deviceMgmt        = require(DEFS.DIR.R_API_DEVICE_MGMT);

var malls             = require(DEFS.DIR.R_API_MALLS);
var shops             = require(DEFS.DIR.R_API_SHOPS);
var brands            = require(DEFS.DIR.R_API_BRANDS);
var getScubits        = require(DEFS.DIR.R_API_SCUBITS_GET);
var getScubitsContext = require(DEFS.DIR.R_API_SCUBITS_CONTEXT_GET);
var postScubits       = require(DEFS.DIR.R_API_SCUBITS_POST);
var search            = require(DEFS.DIR.R_API_SEARCH);
var images            = require(DEFS.DIR.R_API_IMAGES);
                
//Create new instances for each handlers
locationsObj          = new locations();
deviceMgmtObj         = new deviceMgmt();

mallsObj              = new malls();
shopsObj              = new shops();
brandsObj             = new brands();
getScubitsObj         = new getScubits();
getScubitsContextObj  = new getScubitsContext();
postScubitsObj        = new postScubits();
searchObj             = new search();
imagesObj             = new images();

/********************** locations *************************/
//Get all locations
app.get('/apis/locations', function(req, res) {
  locationsObj.getLocationsAction(req,res);
});

// Get location Id by location name
app.get('/apis/location/id', function(req, res) {
  locationsObj.getLocationsByIdAction(req,res);
});

/****************** device management *********************/
app.post('/apis/device/register', function(req, res) {
  deviceMgmtObj.postDeviceRegisterAction(req,res);
});

app.get('/apis/device/get', function(req, res) {
  deviceMgmtObj.getDeviceAction(req,res);
});

app.get('/apis/device/defines', function(req, res) {
  deviceMgmtObj.getDeviceDefinesAction(req,res);
});

// Used for social login users to update the device id associated 
// with user id. 
app.post('/apis/device/user', function(req, res) {
  deviceMgmtObj.postUserDeviceId(req,res);
});

// Used for social login users to update their logged in 
// status.  For namma users, DB does this implicitly
// at the time of sign and sign out
app.post('/apis/device/login', function(req, res) {
  deviceMgmtObj.postDeviceLogin(req,res);
});


/****************** Malls End Point *********************/
app.get('/apis/malls', function(req, res) {
  mallsObj.mallsGenericAction(req, res);
});

/****************** Shops End Point *********************/
app.get('/apis/shops', function(req, res) {
  shopsObj.shopsGenericAction(req, res);
});

/****************** Brands End Point *********************/
app.get('/apis/brands', function(req, res) {
  brandsObj.brandsGenericAction(req, res);
});

/****************** Scubits End Point *********************/
app.get('/apis/scubits', function(req, res) {
  getScubitsObj.scubitsGenericAction(req, res);
});

app.post('/apis/scubits', function(req, res) {
  postScubitsObj.scubitsGenericAction(req, res);
});

/****************** Scubits Context End Point *********************/
app.get('/apis/scubits/context', function(req, res) {
  getScubitsContextObj.contextAction(req, res);
});

/****************** Search End Point *********************/
app.get('/apis/search', function(req, res) {
  searchObj.searchGenericAction(req, res);
});

/****************** Images End Point *********************/
app.get('/apis/images', function(req, res) {
  imagesObj.imagesGenericAction(req, res);
});

