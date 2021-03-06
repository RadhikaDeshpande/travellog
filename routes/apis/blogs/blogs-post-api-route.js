var blogsPost = function() {

  var blogsPostApiHelper     = require(DEFS.DIR.API_HELPER_BLOGS_POST);
  var blogsPostApiHelperObj  = new blogsPostApiHelper();

  /* Blogs Post Action can be for :
     1. Insert a new blog
     2. Update a existing blog
     3. Delete a blog 

     This is determined by action_type in the post data
  */ 
  this.blogsGenericAction = function(req, res) {

    // Recieved POST data
    var postData = req.body;
    console.log(req.body);
    // Get the action type
    if(typeof postData.action_type === 'undefined' || !postData.action_type) {
      res.send(JSON.stringify({ 'error' : 'No Action Type provided for' 
                                    +' post /apis/blogs'}));
      return;
    }

    if(typeof postData.travel_text === 'undefined' && (!postData.travel_text) &&
          typeof postData.food_joint_name === 'undefined' && (!postData.food_joint_name) &&
          typeof postData.food_text === 'undefined' && (!postData.food_text)) {
          res.send(JSON.stringify({ 'error' : 'Please enter information to log your travel'}));
      return;
    }

    if(typeof postData.city === 'undefined' || !postData.city) {
      res.send(JSON.stringify({ 'error' : 'No city provided for' 
                                    +' post /apis/blogs'}));
      return;
    }

    /*if(typeof postData.food_image_count === 'undefined') {
      res.send(JSON.stringify({ 'error' : 'No food_image_count Type provided for' 
                                    +' post /apis/blogs'}));
      return;
    }

    if(typeof postData.travel_image_count === 'undefined') {
      res.send(JSON.stringify({ 'error' : 'No food_image_count Type provided for' 
                                    +' post /apis/blogs'}));
      return;
    }

    if(typeof postData.food_joint_name === 'undefined') {
      res.send(JSON.stringify({ 'error' : 'No food_joint_name Type provided for' 
                                    +' post /apis/blogs'}));
      return;
    }

    if(typeof postData.food_text === 'undefined') {
      res.send(JSON.stringify({ 'error' : 'No food_text Type provided for' 
                                    +' post /apis/blogs'}));
      return;
    }*/

    var action_type = postData.action_type;

    switch(action_type) {

    case DEFS.CONST.APIS_BLOGS_POST_ACTION_TYPE_INSERT:
        _postBlogInsert(req, res);
      break;

      case DEFS.CONST.APIS_BLOGS_POST_ACTION_TYPE_DELETE:
        _postBlogDelete(req, res);
      break;

      case DEFS.CONST.APIS_BLOGS_POST_ACTION_TYPE_UPDATE:
        _postBlogUpdate(req, res);
      break; 

      default: //Ivalid case
        res.send(JSON.stringify({ 'error' : 'invalid action_type for '
        	                       + '/apis/blogs/ ' + postData.action_type}));
      break;   
    }
  }

  

  var _postBlogInsert = function(req, res) {

    _buildImagePaths(req,function(travelImagesArray) {
      _buildFoodImagePaths(req,function(foodImagesArray) {
        // Insert the blog by invoking the helper method
        blogsPostApiHelperObj.insert(req, travelImagesArray, foodImagesArray,function(returnMsg, retData) {
          if(returnMsg === 'success') {
            res.send(JSON.stringify("Success"));
            return;
          } 
          else {
            res.send(JSON.stringify({ "blogs_reason" : "DB Error for blogs insert", 
                                      "blogs_status" : -1 })); 
            return;
          }
        });
      });
    });
  }

  var _postBlogDelete= function(req, res) {

    // Delete the blog by invoking the helper method
    blogsPostApiHelperObj.delete(req, function(returnMsg, retData) {
      if(returnMsg === 'success') { 
        res.send(retData);
        return;
      } 
      else {
        res.send(JSON.stringify({ "blog_reason" : "DB Error for blog delete"}));  
        return;
      }
    });
  }

  var _postBlogUpdate = function(req, res) {

    // Update the blog by invoking the helper method
    blogsPostApiHelperObj.update(req, function(returnMsg, retData) {

      if(returnMsg === 'success') {
        res.send(JSON.stringify({ "blog_reason" : "success"}));
        return;
        } 
      else {
        res.send(JSON.stringify({ "blog_reason" : "DB Error for blog update"}));  
        return;
      }
    });
  }

  var _buildImagePaths = function(req,callback) {

    // Increment by 1 as looping starts from 1
    /*var count = +req.body.travel_image_count + 1; // To convert from string to int
    var imagesArray = [];
    for (i = 1; i<count; i++) { // 
      var imagename = 'image';
      imagename = imagename+i;
      imagesArray.push(req.files[imagename].path);
    }*/
    var imagesArray = [];
    if(req.files['travel_image']) {
        imagesArray.push(req.files['travel_image'].path);
    }
    
    callback(imagesArray);
  }

  var _buildFoodImagePaths = function(req,callback) {

    // Increment by 1 as looping starts from 1
    /*var count = +req.body.food_image_count + 1; // To convert from string to int
    var foodImagesArray = [];
    for (i = 1; i<count; i++) { // 
      var imagename = 'foodImage';
      imagename = imagename+i;*/
      var foodImagesArray = [];
      if(req.files['food_image']) {
        foodImagesArray.push(req.files['food_image'].path);
      }
    //}
    callback(foodImagesArray);
  }

  this.likeAction = function(req, res) {

    // Recieved POST data
    var postData = req.body;
    console.log(req.body);
    // Get the action type
    if(typeof postData.locationString === 'undefined' || !postData.locationString) {
      res.send(JSON.stringify({ 'error' : 'No locationString provided for' 
                                    +' post /apis/posts/like'}));
      return;
    }

    if(typeof postData.blogNumber === 'undefined' || !postData.blogNumber) {
      res.send(JSON.stringify({ 'error' : 'No blogNumber provided for' 
                                    +' post /apis/posts/like'}));
      return;
    }

    if(typeof postData.action_type === 'undefined' || !postData.action_type) {
      res.send(JSON.stringify({ 'error' : 'No action type provided for' 
                                    +' post /apis/posts/like'}));
      return;
    }

    switch(postData.action_type) {

    case DEFS.CONST.APIS_POSTS_LIKES_INCREMENT_FOR_TRAVEL_PLACE:
        _incTravelPostsLikeCount(req, res);
      break;

      case DEFS.CONST.APIS_POSTS_LIKES_INCREMENT_FOR_FOOD_PLACE :
        _incFoodPostsLikeCount(req, res);
      break;

      default: //Ivalid case
        res.send(JSON.stringify({ 'error' : 'invalid action_type for '
                                 + '/apis/posts/likes ' + postData.action_type}));
      break;   
    }
  }

  var _incTravelPostsLikeCount = function(req,res) {

    // Increment the blog view count by invoking the helper method
    blogsPostApiHelperObj.incTravelPostsLikeCount(req,function(returnMsg, retData) {
      if(returnMsg === 'success') {
        res.send(JSON.stringify("Success"));
        return;
      } 
      else {
        res.send(JSON.stringify({ "blogs_reason" : "DB Error for blogs insert", 
                                  "blogs_status" : -1 })); 
        return;
      }
    });
  }

  var _incFoodPostsLikeCount = function(req,res) {

    // Increment the blog view count by invoking the helper method
    blogsPostApiHelperObj.incFoodPostsLikeCount(req,function(returnMsg, retData) {
      if(returnMsg === 'success') {
        res.send(JSON.stringify("Success"));
        return;
      } 
      else {
        res.send(JSON.stringify({ "blogs_reason" : "DB Error for blogs insert", 
                                  "blogs_status" : -1 })); 
        return;
      }
    });
  }
}
module.exports = blogsPost;
