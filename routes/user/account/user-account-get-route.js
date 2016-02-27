var userAccountGet = function() {

  var userAccountGetHelper     = require(DEFS.DIR.API_HELPER_USER_ACCOUNT_GET);
  var userAccountGetHelperObj  = new userAccountGetHelper();

  this.status = function(req, res) {

    // Check for user id 
    if(typeof req.query.user_id  === 'undefined' || !req.query.user_id) {
      res.send(JSON.stringify({ 'error' : 'No User Id  provided for' 
                                    +' get /user/account/status'}));
      return;
    }

    userAccountGetHelperObj.getStatus(req.query.user_id, function(returnMsg, retData) {
      //SCUBE_LOG.info(retData);
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of get user profile for "
                      + "user_id = " + req.query.user_id ); 
        res.send(retData);
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
module.exports = userAccountGet;
