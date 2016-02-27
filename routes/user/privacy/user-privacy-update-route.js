var userPrivacyUpdate = function() {

  var userPrivacyUpdateHelper     = require(DEFS.DIR.API_HELPER_USER_PRIVACY_UPDATE);
  var userPrivacyUpdateHelperObj  = new userPrivacyUpdateHelper();

  this.updateAction = function(req, res) {

    // Recieved POST data
    var postData = req.body;

    // Check for user id 
    if(typeof postData.user_id  === 'undefined' || !postData.user_id) {
      res.send(JSON.stringify({ 'error' : 'No User Id  provided for' 
                                    +' update /user/privacy'}));
      return;
    }

    var userPrivacyArr = {};
    userPrivacyArr.user_id         = postData.user_id;
    userPrivacyArr.email_pref_id   = postData.email_pref_id;

    userPrivacyUpdateHelperObj.update(userPrivacyArr, function(returnMsg, retData) {
	    //SCUBE_LOG.info(retData);
	    if(returnMsg === 'success') {
	      SCUBE_LOG.info("Responding with success for user privacy update");
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
module.exports = userPrivacyUpdate;
