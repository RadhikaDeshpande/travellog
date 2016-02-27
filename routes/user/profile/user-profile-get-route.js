var userProfileGet = function() {

  var userProfileGetHelper     = require(DEFS.DIR.API_HELPER_USER_PROFILE_GET);
  var userProfileGetHelperObj  = new userProfileGetHelper();

  this.getAction = function(req, res) {

    var q_case;
    // Check if a valid query case is provided
    if(typeof req.query.q_case === 'undefined' || req.query.q_case === '') {
      res.send(JSON.stringify({ 'error' : 'q_case for /user/profile cant be null'})); 
      return;
    }

    q_case = req.query.q_case;

    switch(q_case) {

      case DEFS.CONST.APIS_USER_PROFILE_GET_QUERY_CASE_BY_USER_ID:
        _getByUserId(req, res);
      break;

      case DEFS.CONST.APIS_USER_PROFILE_GET_QUERY_CASE_BY_QB_ID:
        _getByQbUserId(req, res);
      break;

      default: //Ivalid case
        res.send(JSON.stringify({ 'error' : 'invalid q_case for /users/profile ' + req.query.q_case}));
      break;   

      }
  }

  var _getByUserId = function(req, res) {

    // Check for user id 
    if(typeof req.query.user_id  === 'undefined' || !req.query.user_id) {
      res.send(JSON.stringify({ 'error' : 'No User Id  provided for' 
                                    +' update /user/profile'}));
      return;
    }

    userProfileGetHelperObj.getByUserId(req.query.user_id, function(returnMsg, retData) {
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

  var _getByQbUserId = function(req, res) {

    // Check for user id 
    if(typeof req.query.qb_user_id  === 'undefined' || !req.query.qb_user_id) {
      res.send(JSON.stringify({ 'error' : 'No User Id  provided for' 
                                    +' update /user/profile'}));
      return;
    }

    userProfileGetHelperObj.getByQbUserId(req.query.qb_user_id, function(returnMsg, retData) {
      //SCUBE_LOG.info(retData);
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of get user profile for "
                      + "qb_user_id = " + req.query.qb_user_id ); 
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
module.exports = userProfileGet;
