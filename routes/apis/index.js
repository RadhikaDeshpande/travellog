//contains all the routes for spark  apis
var express           = require('express');
var app               = module.exports = express();

var getBlogs          = require(DEFS.DIR.R_API_BLOGS_GET);
var postBlogs       	= require(DEFS.DIR.R_API_BLOGS_POST);

getBlogsObj           = new getBlogs();
postBlogsObj          = new postBlogs();

/****************** Brands End Point *********************/
app.get('/apis/blogs', function(req, res) {
  getBlogsObj.blogsGenericAction(req, res);
});

app.post('/apis/blogs', function(req, res) {
  postBlogsObj.blogsGenericAction(req, res);
});
