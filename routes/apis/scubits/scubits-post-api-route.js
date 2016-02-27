var scubitsPost = function() {

  var scubitsPostApiHelper     = require(DEFS.DIR.API_HELPER_SCUBITS_POST);
  var scubitsPostApiHelperObj  = new scubitsPostApiHelper();

  /* Scubits Post Action can be for :
     1. Insert new scubit
     2. Update a existing scubit
     3. Delete a scubit 

     This is determined by action_type in the post data
  */ 
  this.scubitsGenericAction = function(req, res) {

    // Recieved POST data
    var postData = req.body;
    // Get the action type
    if(typeof postData.action_type === 'undefined' || !postData.action_type) {
      res.send(JSON.stringify({ 'error' : 'No Action Type provided for' 
                                    +' post /apis/scubits'}));
    }

    var action_type = postData.action_type;

    switch(action_type) {

    case DEFS.CONST.APIS_SCUBITS_POST_ACTION_TYPE_INSERT:
        _postScubitInsert(req, res);
      break;

      case DEFS.CONST.APIS_SCUBITS_POST_ACTION_TYPE_DELETE:
        _postScubitDelete(req, res);
      break;

      case DEFS.CONST.APIS_SCUBITS_POST_ACTION_TYPE_UPDATE:
        _postScubitUpdate(req, res);
      break;

      default: //Ivalid case
        res.send(JSON.stringify({ 'error' : 'invalid action_type for '
        	                       + '/apis/scubits/ ' + postData.action_type}));
      break;   
    }
  }

  var _postScubitInsert = function(req, res) {

    // Recieved POST data
    var postData = req.body;
    var type = DEFS.CONST.APIS_SCUBITS_POST_ACTION_TYPE_INSERT;

    _getScubitArray(postData, type, function(scubitInfoArr) {

      if(!scubitInfoArr) {
        res.send(JSON.stringify({ 'error' : 'invalid data for post '
        	                       + '/apis/scubits/ '}));
        return;
      } else {
        // Insert the scubit by invoking the helper method
        scubitsPostApiHelperObj.insert(scubitInfoArr, function(returnMsg, retData) {
          SCUBE_LOG.info(retData);
          if(returnMsg === 'success') {
            SCUBE_LOG.info("Responding with success for sucbit insert");
            res.send(retData);
            return;
            } 
          else {
            res.send(JSON.stringify({ "scubit_reason" : "DB Error for scubit insert", 
                                      "scubit_status" : -1 })); 
            return;
          }
        });
      }
    });
  }

  var _postScubitDelete= function(req, res) {

    // Recieved POST data
    var postData = req.body;
    var type = DEFS.CONST.APIS_SCUBITS_POST_ACTION_TYPE_DELETE;

    _getScubitArray(postData, type, function(scubitInfoArr) {

      if(!scubitInfoArr) {
        res.send(JSON.stringify({ 'error' : 'invalid data for post '
                                 + '/apis/scubits/ '}));
        return;
      } else {
        // Delete the scubit by invoking the helper method
        scubitsPostApiHelperObj.delete(scubitInfoArr, function(returnMsg, retData) {
          SCUBE_LOG.info(retData);
          if(returnMsg === 'success') {
            SCUBE_LOG.info("Responding with success for sucbit delete"); 
            res.send(retData);
            return;
            } 
          else {
            res.send(JSON.stringify({ "scubit_reason" : "DB Error for scubit delete", 
                                      "scubit_status" : -1 }));  
            return;
          }
        });
      }
    });
  }

  var _postScubitUpdate = function(req, res) {

    // Recieved POST data
    var postData = req.body;
    var type = DEFS.CONST.APIS_SCUBITS_POST_ACTION_TYPE_UPDATE;

    _getScubitArray(postData, type, function(scubitInfoArr) {

      if(!scubitInfoArr) {
        res.send(JSON.stringify({ 'error' : 'invalid data for post '
                                 + '/apis/scubits/ '}));
        return;
      } else {
        // Update the scubit by invoking the helper method
        scubitsPostApiHelperObj.update(scubitInfoArr, function(returnMsg, retData) {
          //SCUBE_LOG.info(retData);
          if(returnMsg === 'success') {
            SCUBE_LOG.info("Responding with success for sucbit update");
            // DB does not return anything for update, hence sending success 
            // from node for now. 
            res.send(JSON.stringify({ "scubit_reason" : "success", 
                                      "scubit_status" :  1 }));
            return;
            } 
          else {
            res.send(JSON.stringify({ "scubit_reason" : "DB Error for scubit update", 
                                      "scubit_status" : -1 }));  
            return;
          }
        });
      }
    });
  }

  // This is a helper function to validate the input parameters
  var _getScubitArray = function(postData, type, callback) {

		/* 
		|==================|=================|========|=================================================|
		|  Scubit Insert   |  Scubit Update  |  Type  | Notes (Mandatory applies only to Scubit insert) |
		|==================|=================|========|=================================================|
		| shop_profile_id  | -               | int    | Madatory                                        |
		| user_id          | -               | int    | Madatory                                        |
		| gender_id        | gender_id       | int    | Madatory                                        |
		| offer_id         | offer_id        | int    | Madatory                                        |
		| price_range_id   | price_range_id  | int    | Madatory                                        |
		| payment_type_id  | payment_type_id | int    | Madatory                                        |
		| start_date_time  | start_date_time | string | Madatory YYYY-MM-DD HH-MM-SS format             |
		| end_date_time    | end_date_time   | string | Madatory YYYY-MM-DD HH-MM-SS format             |
		| brand_id         | brand_id        | int    | Madatory valid if other_brand_name is null      |
		| other_brand_name | -               | string | Madatory valid if brand_id is null              |
		| notes            | notes           | string | Can be null                                     |
		| photo_url        | photo_url       |        | Can be null                                     |
		| number_of_items  | number_of_items |        | Can be null                                     |
		| -                | scubit_id       |        | Madatory  (Applies to scubit update)            |
		*/

  /* All feilds must be defined in the post request 
   But few feilds can have null value
   For ease of data handling node is insisiting on common object for 
   insert and update case
   1. Check if feilds are undefined
   2. Check if mandatory fields are null 
  */

    // Insert and Update have common fields 
    if(type != DEFS.CONST.APIS_SCUBITS_POST_ACTION_TYPE_DELETE) {
      if(typeof postData.shop_profile_id === 'undefined' ||
      	 typeof postData.user_id === 'undefined' ||
      	 typeof postData.gender_id === 'undefined' ||
      	 typeof postData.offer_id === 'undefined' ||
      	 typeof postData.price_range_id === 'undefined' ||
      	 typeof postData.payment_type_id === 'undefined' ||
      	 typeof postData.start_date_time === 'undefined' ||
      	 typeof postData.end_date_time === 'undefined' ||
      	 typeof postData.brand_id === 'undefined' ||
      	 typeof postData.other_brand_name === 'undefined' ||
      	 typeof postData.notes === 'undefined' ||
      	 typeof postData.photo_url === 'undefined' ||
      	 typeof postData.number_of_items === 'undefined' || 
      	 typeof postData.scubit_id === 'undefined') {
      	 SCUBE_LOG.error("Undefined error");
      	 callback(null);
      	 return;
      } 
    } // end if defined check
    else { // For delete case we need only scubit_id
      if(typeof postData.scubit_id === 'undefined'){
	      SCUBE_LOG.error("Undefined error for scubit_id");
	      callback(null);
	      return;
      } 
    }

    // Null check 
    if(type == DEFS.CONST.APIS_SCUBITS_POST_ACTION_TYPE_INSERT) {
      if(!postData.shop_profile_id || !postData.user_id ||
		     !postData.gender_id || !postData.offer_id ||
		     !postData.price_range_id || !postData.payment_type_id || 
		     !postData.start_date_time || !postData.start_date_time || 
         (!postData.brand_id && !postData.other_brand_name) || 
         (postData.brand_id && postData.other_brand_name)) {
	        SCUBE_LOG.error("Null error");
		      callback(null);
	       return;
      } 
    } // end null check for insert
    else { 
      if(!postData.scubit_id) {
	      SCUBE_LOG.error("Null error for scubit_id");
	      callback(null);
	      return;
      }
    } //end null check for Update or delete 

    SCUBE_LOG.info("SCUBIT Post input validation success");

    var scubitInfoArr = {};

    if(type == DEFS.CONST.APIS_SCUBITS_POST_ACTION_TYPE_DELETE) {
      scubitInfoArr.scubit_id = postData.scubit_id;
    } else {
        scubitInfoArr.shop_profile_id = postData.shop_profile_id;
        scubitInfoArr.user_id = postData.user_id;
        scubitInfoArr.gender_id = postData.gender_id;
        scubitInfoArr.offer_id = postData.offer_id;
        scubitInfoArr.price_range_id = postData.price_range_id;
        scubitInfoArr.payment_type_id = postData.payment_type_id;
        scubitInfoArr.start_date_time = postData.start_date_time;
        scubitInfoArr.end_date_time = postData.end_date_time;
        scubitInfoArr.brand_id = postData.brand_id;
        scubitInfoArr.other_brand_name = postData.other_brand_name;
        scubitInfoArr.notes = postData.notes;
        scubitInfoArr.photo_url = postData.photo_url;
        scubitInfoArr.number_of_items = postData.number_of_items;
        scubitInfoArr.scubit_id = postData.scubit_id;
    }

    SCUBE_LOG.info(scubitInfoArr);
    callback(scubitInfoArr);
    return;
  } 
}
module.exports = scubitsPost;
