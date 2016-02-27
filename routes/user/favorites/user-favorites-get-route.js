var userfavoritesGet = function() {

  var userfavoritesGetHelper     = require(DEFS.DIR.API_HELPER_USER_FAVORITES_GET);
  var userfavoritesGetHelperObj  = new userfavoritesGetHelper();

  this.categoriesGetAction = function(req, res) {

    var q_case;
    // Check if a valid query case is provided
    if(typeof req.query.q_case === 'undefined' || req.query.q_case === '') {
      res.send(JSON.stringify({ 'error' : 'q_case for /user/privacy cant be null'})); 
      return;
    }

    q_case = req.query.q_case;

    switch(q_case) {

      case DEFS.CONST.APIS_USER_FAVORITES_CATEGORY_GET_BY_USER_ID:
        _getCategoriesByUserId(req, res);
      break;

      case DEFS.CONST.APIS_USER_FAVORITES_CATEGORY_GET_ALL:
        _getALLCategories(req, res);
      break;

      default: //Ivalid case
        res.send(JSON.stringify({ 'error' : 'invalid q_case for /users/privacy ' + req.query.q_case}));
      break;   
    }
  }

  var _getCategoriesByUserId = function(req, res) {

    // Check for user id 
    if(typeof req.query.user_id  === 'undefined' || !req.query.user_id) {
      res.send(JSON.stringify({ 'error' : 'No User Id  provided for' 
                                    +' update /user/favorites'}));
      return;
    }

    var userFavoritesArr = {};
    userFavoritesArr.user_id = req.query.user_id;

    userfavoritesGetHelperObj.getCategoryFavoritesByUserId(userFavoritesArr, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of get user favorites for "
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

  var _getALLCategories = function(req, res) {

    userfavoritesGetHelperObj.getAllCategories(function(returnMsg, retData) {
      if(returnMsg === 'success') { 
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

  this.brands = function(req, res) {

     // Check for user id 
    if(typeof req.query.user_id  === 'undefined' || !req.query.user_id) {
      res.send(JSON.stringify({ 'error' : 'No Action Type  provided for' 
                                    +' update /user/favorites'}));
      return;
    }

    userfavoritesGetHelperObj.getBrandsFavorites(req.query.user_id, function(returnMsg, retData) {
      //SCUBE_LOG.info(retData);
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of get user brands favorites for "
                      + "qb_user_id = " + req.query.user_id ); 
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
module.exports = userfavoritesGet;
