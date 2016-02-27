var scubits = function() {

  var scubitsGetApiHelper     = require(DEFS.DIR.API_HELPER_SCUBITS_GET);
  var scubitsGetApiHelperObj  = new scubitsGetApiHelper();

  this.scubitsGenericAction = function(req,res) {

    var q_case;

  	// Check if a valid query case is provided
  	if(typeof req.query.q_case === 'undefined' || req.query.q_case === '') {
      res.send(JSON.stringify({ 'error' : 'q_case for /apis/scubits cant be null'})); 
      return;
    }

    q_case = req.query.q_case;

    switch(q_case) {

      case DEFS.CONST.APIS_SCUBITS_GET_Q_CASE_BY_SHOP_PROFILE:
        _getScubitsByShopProfile(req, res);
      break;

      case DEFS.CONST.APIS_SCUBITS_GET_Q_CASE_BY_USER:
        _getScubitsByUser(req, res);
      break;

      case DEFS.CONST.APIS_SCUBE_DEALS_GET_Q_CASE_BY_SHOP_PROFILE:
        _getScubeDealsByShopProfile(req, res);
      break;

      default: //Ivalid case
        res.send(JSON.stringify({ 'error' : 'invalid q_case for /apis/scubits/ ' + req.query.q_case}));
      break;   

      }
  }

  var _getScubitsByShopProfile = function(req, res) {

    var shopProfileId;
    var scubeNowUserId;

    // Check for valid user input fields 

    if(typeof req.query.shop_profile_id === 'undefined' || req.query.shop_profile_id === '') {
        res.send(JSON.stringify({ 'error' : 'No Shop profile id provided to' 
                                    +' /apis/profile end point '}));
        return;
    }

    // FIXME
    // I have raised a bug to DB, once that is resolved we may not need user id,
    // we should just return all scubits for that shop profile id.

    if(typeof req.query.user_id === 'undefined' || req.query.user_id === '') {
        res.send(JSON.stringify({ 'error' : 'No User Id provided for' 
                                    +' /apis/scubits end point '}));
        return;
    }

    shopProfileId = req.query.shop_profile_id;
    scubeNowUserId = req.query.user_id;

    //Call the helper object and read malls from DB
    scubitsGetApiHelperObj.getScubitsByShopProfile(shopProfileId, scubeNowUserId, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of scubits for "
                      + "shop_profile_id = " + shopProfileId 
                      + " For user : " + scubeNowUserId);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getScubitsByShopProfile for shop_profile_id '  
        + shopProfileId}));
      }
      return;
    });
  }

  // Get all scubits for a scube now user 
  // These scubits can be 
  // 1. Scubits originated by this user
  // 2. Scubits which are active for this user

  var _getScubitsByUser = function(req, res) {

    var scubeNowUserId;

    // FIXME
    // Does this also return the ones user in talks for ??? Update the comments/wiki
    // once this is confirmed. 

    // Check for valid user input fields
    if(typeof req.query.user_id === 'undefined' || req.query.user_id === '') {
        res.send(JSON.stringify({ 'error' : 'No User Id provided for' 
                                    +' /apis/scubits end point '}));
        return;
    }

    scubeNowUserId = req.query.user_id;

    //Call the helper object and read malls from DB
    scubitsGetApiHelperObj.getScubitsByUser(scubeNowUserId , function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of scubits for "
                      + " For user : " + scubeNowUserId);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getScubitsByUser for scubeNowUserId '  
        + scubeNowUserId}));
      }
      return;
    });
  }

  var _getScubeDealsByShopProfile = function(req, res) {

    var shopProfileId;
    // Check for valid user input fields 
    if(typeof req.query.shop_profile_id === 'undefined' || req.query.shop_profile_id === '') {
        res.send(JSON.stringify({ 'error' : 'No Shop profile id provided to' 
                                    +' /apis/profile end point '}));
        return;
    }

    shopProfileId = req.query.shop_profile_id;
    //Call the helper object and read malls from DB
    scubitsGetApiHelperObj.getScubeDealsByShopProfile(shopProfileId, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of scubits for "
                      + "shop_profile_id = " + shopProfileId);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getScubeDealsByShopProfile for shop_profile_id '  
        + shopProfileId}));
      }
      return;
    });
  }
}
module.exports = scubits;
