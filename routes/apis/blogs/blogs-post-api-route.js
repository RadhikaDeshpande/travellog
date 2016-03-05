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
    // Get the action type
    if(typeof postData.action_type === 'undefined' || !postData.action_type) {
      res.send(JSON.stringify({ 'error' : 'No Action Type provided for' 
                                    +' post /apis/blogs'}));
    }

    if(typeof postData.content === 'undefined' || !postData.content) {
      res.send(JSON.stringify({ 'error' : 'No content  provided for' 
                                    +' post /apis/blogs'}));
    }

    if(typeof postData.location === 'undefined' || !postData.location) {
      res.send(JSON.stringify({ 'error' : 'No location Type provided for' 
                                    +' post /apis/blogs'}));
    }

    if(typeof postData.count === 'undefined') {
      res.send(JSON.stringify({ 'error' : 'No count Type provided for' 
                                    +' post /apis/blogs'}));
    }

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

    _buildimagePaths(req,function(imagesArray) {
      //res.send("HHH");
      //return;

      // Insert the blog by invoking the helper method
      blogsPostApiHelperObj.insert(req, imagesArray, function(returnMsg, retData) {
        if(returnMsg === 'success') {
          res.send(JSON.stringify("Succes"));
          return;
        } 
        else {
          res.send(JSON.stringify({ "blogs_reason" : "DB Error for blogs insert", 
                                    "blogs_status" : -1 })); 
          return;
        }
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

  var _buildimagePaths = function(req,callback) {

    // Increment by 1 as looping starts from 1
    var count = +req.body.count + 1; // To convert from string to int
    var imagesArray = [];
    for (i = 1; i<count; i++) { // 
      var imagename = 'image';
      imagename = imagename+i;
      imagesArray.push(req.files[imagename].path);
    }
    callback(imagesArray);
  }
}
module.exports = blogsPost;
