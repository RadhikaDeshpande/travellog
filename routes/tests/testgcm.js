var testGcm = function() {

  var servicesDevice        = require(DEFS.DIR.SERVICES_DEVICE);
  servicesDeviceObj         = new servicesDevice();

  this.sendGcmMessage = function(req, res) {

    var deviceId = req.query.deviceId;

    //Prepare the JSON array
    //form the gcm message to be sent to the user android app
    var functionName = "first";
     //push({name,'value'})
    var params = []; //This is an array
    var param1 = {}; // These are objects
    var param2 = {};
    var param3 = {};

    param1.name = 'firstparam';
    param1.value = 100;
    params.push(param1); //Push into array

    param2.name = 'secondParam';
    param2.value = 'HelloSparkApp';
    params.push(param2); //Push into array

    param3.name = 'thirdParam';
    param3.value = true;
    params.push(param3); //Push into array
    
    //Alternative approach  - 1
    /*var params = [
       {
         name :'firstParam',
         value : 100
       },
       {
         name : 'secondParam',
         value : 'HelloSparkApp'
       },
       {
         name : 'thirdParam',
         value : true
       }
     ]  ;*/

     // Alternative Approach - 2
     /* 
      var jsonData = {};
      var malls = [];
      
      for(i = 0; i<10; i++) { //i<rows[0].length
        var mallObj = {};
        mallObj.mallName   = 'MALLNAME_'+i;
        mallObj.mallId     = i;
        mallObj.scubeCount = i*10;
        malls.push(mallObj);
      }
      jsonData.malls = malls; */

    var jsonData = {};
    jsonData.sparkk = {};  //Sparkk is used to match android code
    jsonData.sparkk.funcName = functionName;
    jsonData.sparkk.params = params;

    jsonData = JSON.stringify(jsonData);
    SCUBE_LOG.info(jsonData);

    //Actual service call
    servicesDeviceObj.sendGcmMessage(deviceId,jsonData, function(response) {
      if(response === 'failure') {
          SCUBE_LOG.error("GCM message sending failed");
      }
    SCUBE_LOG.info("Response for GCm message sent received = "+response);
    res.send(response);
    });
  }
}
module.exports = testGcm;
