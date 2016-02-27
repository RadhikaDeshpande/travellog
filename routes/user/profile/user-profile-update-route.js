var userProfileUpdate = function() {

  var userProfileUpdateHelper     = require(DEFS.DIR.API_HELPER_USER_PROFILE_UPDATE);
  var userProfileUpdateHelperObj  = new userProfileUpdateHelper();

  this.updateAction = function(req, res) {

    // Recieved POST data
    var postData = req.body;

    // Check for user id 
    if(typeof postData.user_id  === 'undefined' || !postData.user_id) {
      res.send(JSON.stringify({ 'error' : 'No User Id  provided for' 
                                    +' update /user/profile'}));
      return;
    }

    var userProfileArr = {};
    userProfileArr.user_id       = postData.user_id;
    userProfileArr.first_name    = postData.first_name;
    userProfileArr.last_name     = postData.last_name;
    userProfileArr.gender        = postData.gender;
    userProfileArr.date_of_birth = postData.date_of_birth;
    userProfileArr.location      = postData.location;
    userProfileArr.phone_num     = postData.phone_num;
    userProfileArr.image_url     = postData.phone_num;
    userProfileArr.qb_user_id    = postData.qb_user_id;

    userProfileUpdateHelperObj.update(userProfileArr, function(returnMsg, retData) {
	    //SCUBE_LOG.info(retData);
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
module.exports = userProfileUpdate;
