var userPrivacyGet = function() {

  var userPrivacyGetHelper     = require(DEFS.DIR.API_HELPER_USER_PRIVACY_GET);
  var userPrivacyGetHelperObj  = new userPrivacyGetHelper();

  this.getAction = function(req, res) {

    var q_case;
    // Check if a valid query case is provided
    if(typeof req.query.q_case === 'undefined' || req.query.q_case === '') {
      res.send(JSON.stringify({ 'error' : 'q_case for /user/privacy cant be null'})); 
      return;
    }

    q_case = req.query.q_case;

    switch(q_case) {

      case DEFS.CONST.APIS_USER_PRIVACY_GET_QUERY_CASE_BY_USER_ID:
        _getByUserId(req, res);
      break;

      default: //Ivalid case
        res.send(JSON.stringify({ 'error' : 'invalid q_case for /users/privacy ' + req.query.q_case}));
      break;   

      }
  }

  var _getByUserId = function(req, res) {

    // Check for user id 
    if(typeof req.query.user_id  === 'undefined' || !req.query.user_id) {
      res.send(JSON.stringify({ 'error' : 'No User Id  provided for' 
                                    +' update /user/privacy'}));
      return;
    }

    var userPrivacyArr = {};
    userPrivacyArr.user_id         = req.query.user_id;
    userPrivacyArr.email_pref_id   = req.query.email_pref_id;

    userPrivacyGetHelperObj.getByUserId(userPrivacyArr, function(returnMsg, retData) {
      //SCUBE_LOG.info(retData);
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of get user privacy for "
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
module.exports = userPrivacyGet;
