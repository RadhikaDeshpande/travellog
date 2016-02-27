/*
	1. Used for global search. 
	2. For global search we return shops,brands and malls matching the search string.
*/
var search = function() {

  var searchApiHelper       = require(DEFS.DIR.API_HELPER_SEARCH);
  var searchApiHelperObj    = new searchApiHelper();

  this.searchGenericAction = function(req,res) {
  	
  	var q_case;

  	// Check if a valid query case is provided
  	if(typeof req.query.q_case === 'undefined' || req.query.q_case === '') {
      res.send(JSON.stringify({ 'error' : 'q_case for /apis/search cant be null'})); 
      return;
    }

    q_case = req.query.q_case;

    switch(q_case) {

      case DEFS.CONST.APIS_SEARCH_QUERY_CASE_ALL :
        _getBrandsShopsMallsBySearchString(req, res);
      break;

      default: //Ivalid case
        res.send(JSON.stringify({ 'error' : 'invalid q_case for /apis/scubits/ ' + req.query.q_case}));
      break;   

    }
  }

  var _getBrandsShopsMallsBySearchString = function(req, res) {

  	// Basic Sanity check 
    // The get request shoukd have 
    // 1. Location Id - City Id
    // 2. Search string  - User entered search key 

    // Creating a search array to carry the search params to helper
    // In future we might have more inputs to the search
    // Hence keeping an array instead of passing var's
    var searchArray = {};

    // Check if location id is not null
    if(typeof req.query.loc_id === 'undefined' || req.query.loc_id === '') {
      res.send(JSON.stringify({ 'error' : 'No location id provided to' 
        	                          +' /apis/search end point '}));
      return;
    }

    if(typeof req.query.q_search === 'undefined' || req.query.q_search === '') {
        res.send(JSON.stringify({ 'error' : 'q_serach for /apis/search cant be null'})); 
        return;
    } 

    //Add the search elements
    searchArray.locId = req.query.loc_id;
    searchArray.searchString = req.query.q_search;

    //Call the helper object and read malls from DB
    searchApiHelperObj.searchBrandsShopsMalls(req, res, searchArray, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of scubits for "
                      + "locId = " + searchArray.locId 
                      + " For searchString : " + searchArray.searchString);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for searchBrandsShopsMalls for searchString '  
        + searchArray.searchString + ' location id ' + searchArray.locId }));
      }
      return;
    });
  }
}

module.exports = search;
