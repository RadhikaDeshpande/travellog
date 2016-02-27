var shops = function() {

  var shopsApiHelper       = require(DEFS.DIR.API_HELPER_SHOPS);
  var shopsApiHelperObj    = new shopsApiHelper();

  this.shopsGenericAction = function(req,res) {

    var q_case;
    
    // Check if a valid query case is provided
    if(typeof req.query.q_case === 'undefined' || req.query.q_case === '') {
      res.send(JSON.stringify({ 'error' : 'q_case for /apis/shops/ cant be null'})); 
      return;
    }

    q_case = req.query.q_case; 

    switch(q_case) {

      case DEFS.CONST.APIS_SHOPS_QUERY_CASE_LOAD:
        _shopsLoad(req, res);
      break;

      case DEFS.CONST.APIS_SHOPS_QUERY_CASE_SEARCH:
        _shopsSearch(req, res);
      break;

      case DEFS.CONST.APIS_SHOPS_QUERY_CASE_BY_MALL_ID:
        _getShopsByMallId(req, res);
      break;

      case DEFS.CONST.APIS_SHOPS_QUERY_CASE_BY_BRAND_ID:
        _getShopsByBrandId(req, res);
      break;

      case DEFS.CONST.APIS_SHOPS_QUERY_CASE_BY_SHOP_NAME:
        _getShopsByShopName(req, res);
      break;

      case DEFS.CONST.APIS_SHOPS_QUERY_CASE_GET_ALL_SHOPS_BY_MALL:
        _getAllShopsInThisMall(req, res);
      break;

      default: //Ivalid case
        res.send(JSON.stringify({ 'error' : 'invalid q_case for /apis/ '
                  + ' shops/ ' + req.query.q_case}));
      break;   
    }
  }


  var _shopsLoad = function(req, res) {

    var loc_id;

    if(typeof req.query.loc_id === 'undefined' || req.query.loc_id === '') {
      res.send(JSON.stringify({ 'error' : 'loc_id for /apis/shops/ load cant be null'})); 
      return;
    }

    loc_id = req.query.loc_id;
    SCUBE_LOG.info("Location Id is : " + loc_id);

    //Call the helper object and read shops from DB
    shopsApiHelperObj.getShopsByLocationId(req, res, loc_id, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of shops for loc_id " + loc_id);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getShopsByLocationId'}));
      }
      return;
    });
  }

  var _shopsSearch = function(req, res) {

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
    searchArray.shopName = q_search;

    SCUBE_LOG.info("Search shop: Location Id : " + loc_id + 
                    'Search String : ' + q_search);

    //Call the helper object and read shops from DB
    shopsApiHelperObj.searchShopsByName(req, res, searchArray, function(returnMsg, retData) {
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

  var _getShopsByMallId = function(req, res) {

    var mallId;

    if(typeof req.query.mall_id === 'undefined' || req.query.mall_id === '') {
          res.send(JSON.stringify({ 'error' : 'mallId for /apis/shops cant be null'})); 
    } 
    
    mallId = req.query.mall_id;
    SCUBE_LOG.info("Mall id is  : " + mallId);

    //Call the helper object and read shops from DB
    shopsApiHelperObj.getShopsByMallId(req, res, mallId, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of shops for "
                        + "mall_id = " + mallId);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getShopsByMallid for mall id '   
                                  + mallId}));
      }
      return;
    });
  }

  var _getShopsByBrandId = function(req, res) {

    var brandId, locId;
    var searchArray = {};

    if(typeof req.query.brand_id === 'undefined' || req.query.brand_id === '') {
          res.send(JSON.stringify({ 'error' : 'brand_id for /apis/shops cant be null'}));
          return; 
    }

    if(typeof req.query.loc_id === 'undefined' || req.query.loc_id === '') {
      res.send(JSON.stringify({ 'error' : 'loc_id for /apis/shops/ load cant be null'})); 
      return;
    } 

    locId = req.query.loc_id;
    brandId = req.query.brand_id;
    SCUBE_LOG.info("Brand id : " + brandId +
                    ' locId : ' + locId );

    searchArray.locId = locId;
    searchArray.brandId = brandId;

    //Call the helper object and read shops from DB
    shopsApiHelperObj.getShopsByBrandId(req, res, searchArray, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of shops for "
                        + "brandId = " + brandId);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getShopsByBrandId for brand id '   
                                  + brandId}));
      }
      return;
    });
  } 

  var _getShopsByShopName = function(req, res) {

    var loc_id, shop_id;
    var searchArray = {};

    if(typeof req.query.loc_id === 'undefined' || req.query.loc_id === '') {
      res.send(JSON.stringify({ 'error' : 'loc_id for /apis/shops/ load cant be null'})); 
      return;
    }

    if(typeof req.query.shop_id === 'undefined' || req.query.shop_id === '') {
      res.send(JSON.stringify({ 'error' : 'shop_id for /apis/shops cant be null'}));
      return; 
    } 
    
    shopId = req.query.shop_id;
    loc_id = req.query.loc_id;
    SCUBE_LOG.info("Shops By Name: Shop id is  : " + shopId + 
                   'loc_id : ' +loc_id );
    //Add the search elements
    searchArray.shopId = shopId;
    searchArray.locId = loc_id;

    //Call the helper object and read shops from DB
    shopsApiHelperObj.getShopsByShopName(req, res, searchArray, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of shops for "
                        + "shop_id = " + shopId);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getShopsByShopName '
                                  + shopId + ' for loc id ' + loc_id }));
      }
      return;
    });
  }

  /* The difference between _getShopsByMallId and this api is :
     1. _getShopsByMallId - Returns based on scubit count
     2. _getAllShopsInThisMall -  Just gives the names/details of all
                                  the shops in the mall. 
  */
  var _getAllShopsInThisMall = function(req, res) {

    if(typeof req.query.mall_id === 'undefined' || req.query.mall_id === '') {
          res.send(JSON.stringify({ 'error' : 'mallId for /apis/shops cant be null'})); 
    } 
    
    mallId = req.query.mall_id;
    SCUBE_LOG.info("Mall id is  : " + mallId);

    //Call the helper object and read shops from DB
    shopsApiHelperObj.getAllShopsByMallId(req, res, mallId, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of shops for "
                        + "mall_id = " + mallId);
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getAllShopsByMallId for mall id '   
                                  + mallId}));
      }
      return;
    });
  }  
}

module.exports = shops;
