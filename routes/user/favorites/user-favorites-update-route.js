var userFavoritesUpdate = function() {

  var userFavoritesUpdateHelper     = require(DEFS.DIR.API_HELPER_USER_FAVORITES_UPDATE);
  var userFavoritesUpdateHelperObj  = new userFavoritesUpdateHelper();
 
  // Brands not supported for first release 
  this.brands = function(req, res) {

    // Recieved POST data
    var postData = req.body;

    // Check for user id 
    if(typeof postData.user_id  === 'undefined' || !postData.user_id) {
      res.send(JSON.stringify({ 'error' : 'No User Id  provided for' 
                                    +' update /user/favorites'}));
      return;
    }

    // Check for Action Type 
    if(typeof postData.action_type  === 'undefined' || !postData.action_type) {
      res.send(JSON.stringify({ 'error' : 'No Action Type Id  provided for' 
                                    +' update /user/favorites'}));
      return;
    }

    var userBrandsFavArr = {};
    userBrandsFavArr.user_id       = postData.user_id;
    userBrandsFavArr.action_type   = postData.action_type;
    userBrandsFavArr.brand_list    = postData.brand_list; // Category or brand list 

    userFavoritesUpdateHelperObj.brands(userBrandsFavArr, function(returnMsg, retData) {
	    if(returnMsg === 'success') {
	      SCUBE_LOG.info("Responding with success for user profile update");
	      // DB does not return anything for update, hence sending success 
	      // from node for now. 
	      res.send(JSON.stringify({ "user_reason" : "success", 
                                  "user_status" :  1 }));
	      return;
	    } 
	    else {
	      res.send(JSON.stringify({ "user_reason" : "failure", 
                                  "user_status" : -1 }));  
	      return;
	    }
    });
  }

  this.categories = function(req, res) {

    // Recieved POST data
    var postData = req.body;

    // Check for user id 
    if(typeof postData.user_id  === 'undefined' || !postData.user_id) {
      res.send(JSON.stringify({ 'error' : 'No User Id  provided for' 
                                    +' update /user/favorites'}));
      return;
    }

    userFavoritesUpdateHelperObj.categories(postData, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with success for user profile update");
        // DB does not return anything for update, hence sending success 
        // from node for now. 
        res.send(JSON.stringify({ "user_reason" : "success", 
                                  "user_status" :  1 }));
        return;
      } 
      else {
        res.send(JSON.stringify({ "user_reason" : "failure", 
                                  "user_status" : -1 }));  
        return;
      }
    });
  } 
}
module.exports = userFavoritesUpdate;
