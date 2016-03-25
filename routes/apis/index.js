//contains all the routes for spark  apis
var express           = require('express');
var app               = module.exports = express();

var getBlogs          = require(DEFS.DIR.R_API_BLOGS_GET);
var postBlogs       	= require(DEFS.DIR.R_API_BLOGS_POST);
var foodPlaces       	= require(DEFS.DIR.R_API_FOOD_PLACES_GET);

getBlogsObj           = new getBlogs();
postBlogsObj          = new postBlogs();
foodPlacesObj 				= new foodPlaces();

/****************** Posts End Point *********************/
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

app.get('/viewfood', function(req, res) {
  if(req.session.user){
    res.render('view-food.ejs', {
    message : req.session.message,
    user_id : req.session.user.user_id,
    user_name:req.session.user.user_name});
    return;
  }
  res.redirect('/');
});

app.get('/viewtravel', function(req, res) {
  if(req.session.user){
    res.render('view-travel.ejs', {
    message : req.session.message,
    user_id : req.session.user.user_id,
    user_name:req.session.user.user_name});
    return;
  }
  res.redirect('/');
});

app.get('/viewposts', function(req, res) {
  if(req.session.user){
    res.render('view-posts.ejs', {
    message : req.session.message,
    user_id : req.session.user.user_id,
    user_name:req.session.user.user_name});
    return;
  }
  res.redirect('/');
});

app.get('/nearme', function(req, res) {
  if(req.session.user){
    res.render('near-me.ejs', {
    message : req.session.message,
    user_id : req.session.user.user_id,
    user_name:req.session.user.user_name});
    return;
  }
  res.redirect('/');
});

// This API is used to increment the view count/ likes for a 
// particular blog. 
app.post('/apis/posts/like', function(req, res) {
  postBlogsObj.likeAction(req, res);
});

/****************** Food End Point *********************/
app.get('/apis/food', function(req, res) {
  foodPlacesObj.foodGenericAction(req, res);
});

