//contains all the routes for spark  apis
var express           = require('express');
var app               = module.exports = express();
var getUserProfile    = require(DEFS.DIR.R_USER_PROFILE_GET);
var updateUserProfile = require(DEFS.DIR.R_USER_PROFILE_UPDATE);
var getUserPrivacy    = require(DEFS.DIR.R_USER_PRIVACY_GET);
var updateUserPrivacy = require(DEFS.DIR.R_USER_PRIVACY_UPDATE);
var getUserFavorites  = require(DEFS.DIR.R_USER_FAVORITES_GET);
var updateUserFavorites = require(DEFS.DIR.R_USER_FAVORITES_UPDATE);
var getUserAccount      = require(DEFS.DIR.R_USER_ACCOUNT_GET);
                
//Create new instances for each handlers
getUserProfileObj     = new getUserProfile();
updateUserProfileObj  = new updateUserProfile();
getUserPrivacyObj     = new getUserPrivacy();
updateUserPrivacyObj  = new updateUserPrivacy();
getUserFavoritesObj   = new getUserFavorites();
updateUserFavoritesObj = new updateUserFavorites();
getUserAccountObj      = new getUserAccount();

/****************** Users End Point *********************/

//---- Profile ---- 
app.get('/user/profile', function(req, res) {
  getUserProfileObj.getAction(req, res);
});

app.post('/user/profile', function(req, res) {
  updateUserProfileObj.updateAction(req, res);
});

//---- Privacy ---- 
app.get('/user/privacy', function(req, res) {
  getUserPrivacyObj.getAction(req, res);
});

app.post('/user/privacy', function(req, res) {
  updateUserPrivacyObj.updateAction(req, res);
});

//---- Favorites ---- 
app.get('/user/favorites/brands', function(req, res) {
  getUserFavoritesObj.brands(req, res);
});

app.get('/user/favorites/categories', function(req, res) {
  getUserFavoritesObj.categoriesGetAction(req, res);
});

app.post('/user/favorites/brands', function(req, res) {
  updateUserFavoritesObj.brands(req, res);
});

app.post('/user/favorites/categories', function(req, res) {
  updateUserFavoritesObj.categories(req, res);
});

// ---- Account ---- 
app.get('/user/account/status', function(req, res) {
  getUserAccountObj.status(req, res);
});
