var brands = function() {

  var brandsApiHelper      = require(DEFS.DIR.API_HELPER_BRANDS);
  var brandsApiHelperObj   = new brandsApiHelper();

  this.brandsGenericAction = function(req,res) {

    var q_case ;

    //Basic Sanity check for Query Case 
    if(typeof req.query.q_case === 'undefined' || req.query.q_case === '') {
      res.send(JSON.stringify({ 'error' : 'q_case for /apis/brands/ cant be null'})); 
      return;
    }

    q_case = req.query.q_case;

    switch(q_case) {

      case DEFS.CONST.APIS_BRANDS_QUERY_CASE_LOAD:
        _brandsLoad(req, res);
      break;

      case DEFS.CONST.APIS_BRANDS_QUERY_CASE_SEARCH:
        _brandsSearch(req, res);
      break;

      case DEFS.CONST.APIS_BRANDS_QUERY_CASE_BY_SHOP_PROFILE_ID:
        _brandsByShopProfileId(req, res);
      break;

      case DEFS.CONST.APIS_BRANDS_QUERY_CASE_GET_ALL_BRANDS:
        _brandsGetALL(req, res);
      break;

      default: //Ivalid case
        res.send(JSON.stringify({ 'error' : 'invalid q_case for /apis/ '
                  + 'brands/ ' + req.query.q_case}));
      break;   
    }
  }

  var _brandsLoad = function(req, res) {

    var loc_id;

    if(typeof req.query.loc_id === 'undefined' || req.query.loc_id === '') {
      res.send(JSON.stringify({ 'error' : 'loc_id for /apis/brands/ cant be null'})); 
      return;
    }

    loc_id = req.query.loc_id;

    // Call the helper object and read brands from DB
    brandsApiHelperObj.getBrandsByLocationId(req, res, loc_id, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of brands for loc_id " + loc_id);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getBrandsByLocationId'}));
      }
      return;
    });
  }

  var _brandsSearch = function(req, res) {

    var loc_id, q_search;
    var searchArray = {};

    if(typeof req.query.loc_id === 'undefined' || req.query.loc_id === '') {
      res.send(JSON.stringify({ 'error' : 'loc_id for /apis/brands/ cant be null'})); 
      return;
    }

    if(typeof req.query.q_search === 'undefined' || req.query.q_search === '') {
          res.send(JSON.stringify({ 'error' : 'q_search for /apis/brands cant be null'})); 
    } 

    q_search = req.query.q_search;
    loc_id = req.query.loc_id;
    SCUBE_LOG.info("Location id is " + loc_id 
                      + " search string is " + q_search);
    //Add the search elements
    searchArray.locId = loc_id;
    searchArray.brandName = q_search;

    // Call the helper object 
    brandsApiHelperObj.searchBrandsByName(req, res, searchArray, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of shops for "
                        + "loc_id = " + loc_id + "q_search = " + q_search);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getBrandsByName for '  
                                  + q_search}));
      }
      return;
    });
  }

  var _brandsByShopProfileId = function(req, res) {

    var shop_profile_id;

    if(typeof req.query.shop_profile_id === 'undefined' || req.query.shop_profile_id === '') {
      res.send(JSON.stringify({ 'error' : 'shop_profile_id for /apis/brands/ cant be null'})); 
      return;
    }
    shopProfileId = req.query.shop_profile_id;

    // Call the helper object and read brands from DB
    brandsApiHelperObj.getBrandsByShopProfileId(req, res, shopProfileId, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of brands for shopProfileId " + shopProfileId);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getBrandsByShopProfileId'}));
      }
      return;
    });
  }

  var _brandsGetALL = function(req, res) {

    // Call the helper object and read brands from DB
    brandsApiHelperObj.getAllBrands(req, res, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of all brands ");
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getAllBrands'}));
      }
      return;
    });
  }
}

module.exports = brands;

