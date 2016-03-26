var blogs = function() {

  var blogsApiHelper      = require(DEFS.DIR.API_HELPER_BLOGS_GET);
  var blogsApiHelperObj   = new blogsApiHelper();

  this.blogsGenericAction = function(req,res) {

    var q_case ;

    //Basic Sanity check for Query Case 
    if(typeof req.query.q_case === 'undefined' || req.query.q_case === '') {
      res.send(JSON.stringify({ 'error' : 'q_case for /apis/blogs/ cant be null'})); 
      return;
    }
    q_case = req.query.q_case;

    switch(q_case) {

      case DEFS.CONST.APIS_BLOGS_QUERY_CASE_BY_VIEW_COUNT:
        _blogsByViewCount(req, res);
      break;

      case DEFS.CONST.APIS_BLOGS_QUERY_CASE_BY_LOCATION:
        _blogsByLocation(req, res);
      break;

      case DEFS.CONST.APIS_BLOGS_QUERY_CASE_BY_TOP_LOCATION:
        _blogsByTopLocation(req, res);
      break;

      case DEFS.CONST.APIS_BLOGS_QUERY_CASE_BY_USER_NAME:
        _blogsByUserName(req, res);
      break;

      case DEFS.CONST.APIS_BLOGS_QUERY_CASE_DISPLAY_GET_FORM:
        res.render('view-blogs.ejs', {
                message : req.session.message,
                user_id : req.session.user.user_id,
                user_name:req.session.user.user_name});
        return;
      break;

      case DEFS.CONST.APIS_BLOGS_QUERY_CASE_BY_PROXIMITY:
        _blogsByUserProximity(req, res);
      break;

      default: //Ivalid case
        res.send(JSON.stringify({ 'error' : 'invalid q_case for /apis/ '
                  + 'blogs/ ' + req.query.q_case}));
      break;   
    }
  }

  var _blogsByViewCount = function(req, res) {

    // Call the helper object and read blogs from DB
    blogsApiHelperObj.getBlogsByViewCount(req, res, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        //console.log(retData);
        console.log(retData);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getBlogsByViewCount'}));
      }
      return;
    });
  }

  var _blogsByLocation = function(req, res) {

    var location_name;

    if(typeof req.query.location_name === 'undefined' || req.query.location_name === '') {
      res.send(JSON.stringify({ 'error' : 'loc_id for /apis/blogs/ cant be null'})); 
      return;
    }

    location_name = req.query.location_name;
    // Call the helper object 
    blogsApiHelperObj.searchBlogsByLocationName(req, res, location_name, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for searchBlogsByLocationName for '  
                                  + location_name}));
      }
      return;
    });
  }

  var _blogsByTopLocation = function(req, res) {
    
    // Call the helper object and read blogs from DB
    blogsApiHelperObj.getBlogsByTopLocation(req, res,function(returnMsg, retData) {
      if(returnMsg === 'success') {
        console.log(retData);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getBlogsByTimeStamp'}));
      }
      return;
    });
  }

  var _blogsByUserName = function(req, res) {

    var user_name;

    if(typeof req.query.user_name === 'undefined' || req.query.user_name === '') {
      res.send(JSON.stringify({ 'error' : 'user_name for /apis/blogs/ cant be null'})); 
      return;
    }
    user_name = req.query.user_name;
    // Call the helper object and read blogs from DB
    blogsApiHelperObj.getBlogsByUsername(req, res, user_name, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        console.log(retData);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getBlogsByUsername'}));
      }
      return;
    });
  }

  var _blogsByUserProximity = function(req, res) {

    if(typeof req.query.user_lat === 'undefined' || req.query.user_lat === '') {
      res.send(JSON.stringify({ 'error' : 'latitude for proximity API cant be null'})); 
      return;
    }

    if(typeof req.query.user_long === 'undefined' || req.query.user_long === '') {
      res.send(JSON.stringify({ 'error' : 'longitude for proximity API cant be null'})); 
      return;
    }

    if(typeof req.query.user_country_name === 'undefined' || req.query.user_country_name === '') {
      res.send(JSON.stringify({ 'error' : 'country for proximity API cant be null'})); 
      return;
    }

    if(typeof req.query.user_radius_preference === 'undefined' || req.query.user_radius_preference === '') {
      res.send(JSON.stringify({ 'error' : 'user_radius_preference for proximity API cant be null'})); 
      return;
    }

    // Call the helper object and read blogs closest to user proximity
    blogsApiHelperObj.getPostsByUserProximity(req, res, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        console.log(retData);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getBlogsByUsername'}));
      }
      return;
    });
  }
}

module.exports = blogs;

