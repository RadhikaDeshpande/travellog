var restServiceApi = function() {

  this.restApiTestAction = function(req, res) {
  console.log("Recvd json object");
   // Create device structure
    var postDataArr = {};

    // Recieved POST data
    var postData = req.body;

    // Deal Id Number
    if(typeof postData.dealId === 'undefined' || !postData.dealId) {
      postDataArr.dealId = '';
      console.log('Invalid Deal ID : '+postDataArr.dealId+' received from user app in post request');
    } else {
      postDataArr.dealId = postData.dealId;
    }
    
    // User Id Number
    if(typeof postData.userId === 'undefined' || !postData.userId) {
      postDataArr.userId = '';
     
    } else {
      postDataArr.userId = postData.userId;
    }

    // Mall Id Number
    if(typeof postData.mallId === 'undefined' || !postData.mallId) {
      postDataArr.mallId = '';
     
    } else {
      postDataArr.mallId = postData.mallId;
    }

    // Group Id Number
    if(typeof postData.groupId === 'undefined' || !postData.groupId) {
      postDataArr.groupId = '';
     
    } else {
      postDataArr.groupId = postData.groupId;
    }

    // Sparkk Value
    if(typeof postData.sparkkVal === 'undefined' || !postData.sparkkVal) {
      postDataArr.sparkkVal = '';
     
    } else {
      postDataArr.sparkkVal = postData.sparkkVal;
    }

    console.log('User Id : '+postDataArr.userId);
    console.log('Deal Id : '+postDataArr.dealId);
    console.log('Mall Id : '+postDataArr.mallId);
    console.log('Group Id : '+postDataArr.groupId);
    console.log('sparkkVal  : '+postDataArr.sparkkVal);
    SCUBE_LOG.debug('Invalid Deal ID : '+postDataArr.dealId);
    SCUBE_LOG.info('Invalid Deal ID : '+postDataArr.dealId);
    SCUBE_LOG.warning('Invalid Deal ID : '+postDataArr.dealId);
    SCUBE_LOG.error('Invalid Deal ID : '+postDataArr.dealId);

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay');

  }
}
module.exports = restServiceApi;
