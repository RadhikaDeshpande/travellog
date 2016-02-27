var malls = function() {

  var mallsApiHelper       = require(DEFS.DIR.API_HELPER_MALLS);
  var mallsApiHelperObj    = new mallsApiHelper();

  this.mallsGenericAction = function(req,res) {

    var q_case;

    // Check if a valid query case is provided
    if(typeof req.query.q_case === 'undefined' || req.query.q_case === '') {
      res.send(JSON.stringify({ 'error' : 'q_case for /apis/malls/ cant be null'})); 
      return;
    }

    q_case = req.query.q_case; 

    switch(q_case) {

      case DEFS.CONST.APIS_MALLS_QUERY_CASE_LOAD:
        _mallsLoad(req, res);
      break;

      case DEFS.CONST.APIS_MALLS_QUERY_CASE_SEARCH:
        _mallsSearch(req, res);
      break;

      case DEFS.CONST.APIS_MALLS_QUERY_CASE_GET_ALL_BY_LOC_ID:
        _getAllMallsByLocId(req, res);
      break;

      default: //Ivalid case
        res.send(JSON.stringify({ 'error' : 'invalid q_case for /apis/ '
                  + ' malls/ ' + req.query.q_case}));
      break;   
    }
  }


  // This API loads the malls based on location
  // as per scubit count 
  var _mallsLoad = function(req, res) {

    var loc_id;

    if(typeof req.query.loc_id === 'undefined' || req.query.loc_id === '') {
      res.send(JSON.stringify({ 'error' : 'loc_id for /apis/malls/ load cant be null'})); 
      return;
    }

    loc_id = req.query.loc_id;
    SCUBE_LOG.info("Location Id is : " + loc_id);

    //Call the helper object and read malls from DB
    mallsApiHelperObj.getMallsByLocationId(req, res, loc_id, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of malls for loc_id " + loc_id);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getMallsByLocationId'}));
      }
      return;
    });
  }

  var _mallsSearch = function(req, res) {

    var loc_id, q_search;

    if(typeof req.query.q_search === 'undefined' || req.query.q_search === '') {
        res.send(JSON.stringify({ 'error' : 'q_serach for /apis/shops cant be null'})); 
    }

    if(typeof req.query.loc_id === 'undefined' || req.query.loc_id === '') {
      res.send(JSON.stringify({ 'error' : 'loc_id for /apis/shops/ load cant be null'})); 
      return;
    } 

    q_search = req.query.q_search;
    loc_id = req.query.loc_id;

    var searchArray = {};
    //Add the search elements
    searchArray.locId = loc_id;
    searchArray.mallName = q_search;

    SCUBE_LOG.info("Search shop: Location Id : " + loc_id + 
                    'Search String : ' + q_search);

    //Call the helper object and read shops from DB
    mallsApiHelperObj.searchMallsByName(req, res, searchArray, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of shops for "
                        + "loc_id = " + loc_id + "q_search = " + q_search);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getShopsByName for '  
                                  + q_search}));
      }
     return;
    });
  }
  
  var _getAllMallsByLocId = function(req, res) {

    var loc_id;

    if(typeof req.query.loc_id === 'undefined' || req.query.loc_id === '') {
          res.send(JSON.stringify({ 'error' : 'mallId for /apis/malls cant be null'})); 
    } 
    
    loc_id = req.query.loc_id;
    SCUBE_LOG.info("Mall id is  : " + loc_id);

    //Call the helper object and read shops from DB
    mallsApiHelperObj.getAllMallsByLocId(req, res, loc_id, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of shops for "
                        + "loc_id = " + loc_id);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getAllMallsByLocId for loc id '   
                                  + loc_id}));
      }
      return;
    });
  }
}
module.exports = malls;
