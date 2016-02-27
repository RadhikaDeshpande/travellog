// ========== Device Mgmt Action Functions==========
var deviceMgmt = function(){

  var deviceMgmtApi          = require(DEFS.DIR.API_HELPER_LOGIN_DEVICE_MANAGEMENT);
  var deviceMgmtApiObj       = new deviceMgmtApi();
  
  this.postDeviceRegisterAction = function(req, res) {
	  // USER App device registration POST request. Received upon every app install.
	  // Registration data received
	  // IMEI number
	  // Device Type
	  // Device Variant
	  // Device OS
	  // GCM Registration ID
    console.log("Received device registration post from user app "+req.body);

    // Create device structure
    var deviceInfo = {};

    // Recieved POST data
    var inputData = req.body;

    // IMEI Number
    if(typeof inputData.IMEI === 'undefined' || !inputData.IMEI) {
      deviceInfo.IMEI = '';
      console.log('Invalid IMEI : '+inputData.IMEI+' received from user app');
    } else {
      deviceInfo.IMEI = inputData.IMEI;
    }

    // Device Type
    if(typeof inputData.deviceType === 'undefined' || !inputData.deviceType) {
      deviceInfo.deviceType = '';
      console.log('Invalid deviceType : '+inputData.deviceType+' received from user app');
    } else {
      deviceInfo.deviceType = inputData.deviceType;
    }

    // Device Variant
    if(typeof inputData.deviceVariant === 'undefined' || !inputData.deviceVariant) {
      deviceInfo.deviceVariant = '';
      console.log('Invalid deviceVariant : '+inputData.deviceVariant+' received from user app');
    } else {
      deviceInfo.deviceVariant = inputData.deviceVariant;
    }

    // Device OS
    if(typeof inputData.deviceOs === 'undefined' || !inputData.deviceOs) {
      deviceInfo.deviceOs = '';
      console.log('Invalid deviceOs : '+inputData.deviceOs+' received from user app');
    } else {
      deviceInfo.deviceOs = inputData.deviceOs;
    }

    // GCM ID
    if(typeof inputData.gcmRegId === 'undefined' || !inputData.gcmRegId) {
      deviceInfo.gcmRegId = '';
      console.log('Invalid gcmRegId : '+inputData.gcmRegId+' received from user app');
    } else {
      deviceInfo.gcmRegId = inputData.gcmRegId;
    }

    // Logging
    console.log("IMEI is        : " + deviceInfo.IMEI);
    console.log("deviceType is  : " + deviceInfo.deviceType);
    console.log("deviceVariant is : " + deviceInfo.deviceVariant);
    console.log("deviceOs is    : " + deviceInfo.deviceOs);
    console.log("gcmRegId is    : " + deviceInfo.gcmRegId);

    // We continue registering the device (instead of aborting) even if there are any invalid device details because,
    // This registration request is sent by user app "ONLY" once upon install and we do 
    // NOT AFFORD to lose this post request, hence we save what ever the data we have 
    // received in the DB. Invalid data is defaulted to empty string.

    // Helper call to store the device info in DB and return back the device_id from DB
    deviceMgmtApiObj.register(req, res, deviceInfo, function(retVal) {
      if(retVal === "failure") {
        console.log("Device Mgmt Action : Device registration failure");
        res.send(JSON.stringify({ 'failure' : "Device registration failure" }));
        return;
      }
        
      console.log("Device Mgmt Action : Device registration successful : id = "+retVal);
      res.send(JSON.stringify({ 'device_id' : retVal }));
    });
  }

  this.getDeviceAction = function(req, res) {
    // Get Device details using device Id
    // deviceID is passed as a query parameter to the get request
    // /apis/device/get?id=<sparkk-user-device-identifier>

    if(typeof req.query.id === 'undefined' || req.query.id === '') {
      res.send(JSON.stringify({ 'error' : 'No device id provided to fetch details' }));
    } else {
      deviceMgmtApiObj.getDetails(req, res, req.query.id, function(retVal) {
        if(retVal === 'failure') {
          console.log('Device details API error');
          res.send(JSON.stringify({ 'error' : 'Get Device details DB call failed' }));
          return;
        }

        // Received device details
        console.log('Received device details for id : '+req.query.id);
        var deviceInfo = {};
        deviceInfo.id = retVal.device_id;
        deviceInfo.type = retVal.type;
        deviceInfo.imei = retVal.imei;
        deviceInfo.variant = retVal.variant;
        deviceInfo.os = retVal.os;
        deviceInfo.gcmRegId = retVal.gcm_reg_id; 
        res.send(JSON.stringify(deviceInfo));
        return;
      });
    }
  }

  // Fetch all the device defines from DB. This data will be used for sending the device registration
  // request to DB with Variant, Type and OS mapped to the right ID.
  this.getDeviceDefinesAction = function(req, res) {

    console.log("Action : Received device defines API request");
    deviceMgmtApiObj.getDeviceDefines(req, res, function(retVal) {
      if(retVal === 'failure') {
        console.log('Action : Device defines API error');
        res.send(JSON.stringify({'error' : 'Action : Get Device defines DB call failed'}));
        return;
      }

      // Received device defines
      console.log('Action : Received device details from DB');
      var deviceDefines = {};
      deviceDefines.deviceVariant = retVal.deviceVariant;
      deviceDefines.deviceOs = retVal.deviceOs;
      deviceDefines.deviceType = retVal.deviceType;
      res.send(JSON.stringify(deviceDefines));
      return;
    });
  }

   // Used for social login users to update the device id associated 
   // with user id.  This is not available at the time of social user
   // signup. Hence app calls a explicit API once the signup is succes.
   // This API is called for both social login and signup. For both these actions
   // we need to update the user logged status.  Hence calling that API first.
   // Note:  Android will call this API many times, the TEMP IMEI, dev id, user id
   // is valid only for the 1st case (signup), subsequent calls should be a no op.
  this.postUserDeviceId = function(req, res) {
     
    // Create device structure
    var deviceIdInfo = {};
 
    // Recieved POST data
    var inputData = req.body;
 
    // Device Id
    if(typeof inputData.device_id === 'undefined' || !inputData.device_id) {
      res.send(JSON.stringify({ 'error' : 'No device_id  provided for' 
                                     +' post /apis/device/user'}));
      return;
    }
 
    // User Id
    if(typeof inputData.user_id === 'undefined' || !inputData.user_id) {
      res.send(JSON.stringify({ 'error' : 'No user_id  provided for' 
                                     +' post /apis/device/user'}));
      return;
    }
  
    // Based on the IMEI number, db will look into device table and
    // get the dummy device id associated with it is used find a row with
    // dummy device id and user combination, now this row is updated
    // with the device_id being passed below. 
    deviceIdInfo.IMEI = DEFS.CONST.SOCIAL_SIGNUP_USER_TEMP_IMEI_NUMBER;
    deviceIdInfo.deviceId = inputData.device_id;
    deviceIdInfo.userId = inputData.user_id;
    deviceIdInfo.action = DEFS.CONST.SESSION_USER_LOGIN;

    // Update the user logged status
    deviceMgmtApiObj.userDeviceLoginLogout(req, res, deviceIdInfo, function(retVal) {
      if(retVal === "failure") {
        console.log("Device Mgmt Action : Device, User Id LOGIN LOGOUT" 
           + "Fatal failure for user : " + userId + " device : " + deviceId);
      }
      // Helper call to store the device id in DB 
      deviceMgmtApiObj.UpdateUserDeviceId(req, res, deviceIdInfo, function(retVal) {
        if(retVal === "failure") {
               console.log("Device Mgmt Action : Device, User Id update failure");
           res.send(JSON.stringify({ 'failure' : "Device Id update failure" }));
          return;
        }
        res.send(JSON.stringify({ 'success' : "Device Id Update successful" }));
      });
    });
  }

  // Used for social login/signup users to update the logged in status for users.
  // For namma users DB does this implicity at the time of login and signup. 
  // 
  this.postDeviceLogin = function(req, res) {
     
    // Create device structure
    var deviceIdInfo = {};
 
    // Recieved POST data
    var inputData = req.body;
 
    // Device Id
    if(typeof inputData.device_id === 'undefined' || !inputData.device_id) {
      res.send(JSON.stringify({ 'error' : 'No device_id  provided for' 
                                     +' post /apis/device/login'}));
      return;
    }
 
    // User Id
    if(typeof inputData.user_id === 'undefined' || !inputData.user_id) {
      res.send(JSON.stringify({ 'error' : 'No user_id  provided for' 
                                     +' post /apis/device/login'}));
      return;
    }
    
    deviceIdInfo.deviceId = inputData.device_id;
    deviceIdInfo.userId = inputData.user_id;
    deviceIdInfo.action = DEFS.CONST.SESSION_USER_LOGIN;

    // Helper call to store the device id in DB 
    deviceMgmtApiObj.userDeviceLoginLogout(req, res, deviceIdInfo, function(retVal) {
      if(retVal === "failure") {
             console.log("Device Mgmt Action : Device, User Id update failure");
         res.send(JSON.stringify({ 'failure' : "Usre Id Logged in status update failure" }));
        return;
      }
      res.send(JSON.stringify({ 'success' : "User Login Status Update Successful" }));
    });
  }
}
module.exports =  deviceMgmt;
