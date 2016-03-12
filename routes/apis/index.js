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

app.get('/addblog', function(req, res) {
  if(req.session.user){
    res.render('add-blog.ejs', {
                message : req.session.message,
                user_id : req.session.user.user_id,
                user_name:req.session.user.user_name});
    return;
  } 
  res.redirect('/');
});

app.get('/viewblogs', function(req, res) {
  if(req.session.user){
    res.render('view-blogs.ejs', {
                  message : req.session.message,
                  user_id : req.session.user.user_id,
                  user_name:req.session.user.user_name});
    return;
  }
  res.redirect('/');
});


/****************** Food End Point *********************/
app.get('/apis/food', function(req, res) {
  foodPlacesObj.foodGenericAction(req, res);
});

