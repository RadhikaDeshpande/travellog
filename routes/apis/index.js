//contains all the routes for spark  apis
var express           = require('express');
var app               = module.exports = express();

var getBlogs          = require(DEFS.DIR.R_API_BLOGS_GET);
var postBlogs       	= require(DEFS.DIR.R_API_BLOGS_POST);
var foodPlaces       	= require(DEFS.DIR.R_API_FOOD_PLACES_GET);

getBlogsObj           = new getBlogs();
postBlogsObj          = new postBlogs();
foodPlacesObj 				= new foodPlaces();

/****************** Blogs End Point *********************/
app.get('/apis/blogs', function(req, res) {
  getBlogsObj.blogsGenericAction(req, res);
});

app.post('/apis/blogs', function(req, res) {
  postBlogsObj.blogsGenericAction(req, res);
});

/****************** Food End Point *********************/
app.get('/apis/food', function(req, res) {
  foodPlacesObj.foodGenericAction(req, res);
});

