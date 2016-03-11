var food = function() {

  var foodApiHelper      = require(DEFS.DIR.API_HELPER_FOOD_PLACES_GET);
  var foodApiHelperObj   = new foodApiHelper();

  this.foodGenericAction = function(req,res) {

    var q_case ;

    //Basic Sanity check for Query Case 
    if(typeof req.query.q_case === 'undefined' || req.query.q_case === '') {
      res.send(JSON.stringify({ 'error' : 'q_case for /apis/food/ cant be null'})); 
      return;
    }

    q_case = req.query.q_case;

    switch(q_case) {

      case DEFS.CONST.APIS_FOOD_QUERY_CASE_BY_VISIT_COUNT:
        _foodByVisitCount(req, res);
      break;

      case DEFS.CONST.APIS_FOOD_QUERY_CASE_BY_LOCATION:
        _foodByLocation(req, res);
      break;

      default: //Ivalid case
        res.send(JSON.stringify({ 'error' : 'invalid q_case for /apis/ '
                  + 'food/ ' + req.query.q_case}));
      break;   
    }
  }

  var _foodByVisitCount = function(req, res) {

    // Call the helper object and read food places from DB
    foodApiHelperObj.getFoodPlacesByVisitCount(req, res, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        //console.log(retData);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getFoodPlacesByVisitCount'}));
      }
      return;
    });
  }

  var _foodByLocation = function(req, res) {

    var location_name;

    if(typeof req.query.location_name === 'undefined' || req.query.location_name === '') {
      res.send(JSON.stringify({ 'error' : 'loc_id for /apis/food/ cant be null'})); 
      return;
    }

    location_name = req.query.location_name;
    // Call the helper object 
    foodApiHelperObj.searchFoodPlacesByLocationName(req, res, location_name, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        //res.send(retData);
        //console.log(retData);
        res.send(JSON.stringify(retData));

      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for searchFoodPlacesByLocationName for '  
                                  + location_name}));
      }
      return;
    });
  }
}

module.exports = food;

