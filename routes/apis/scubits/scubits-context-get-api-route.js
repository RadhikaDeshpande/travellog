var scubitsContext = function() {

  var scubitsContextGetApiHelper = require(DEFS.DIR.API_HELPER_SCUBITS_CONTEXT_GET);
  var scubitsContextGetApiHelperObj  = new scubitsContextGetApiHelper();

  this.contextAction = function(req,res) {

    var q_case;

    // Check if a valid query case is provided
    if(typeof req.query.q_case === 'undefined' || req.query.q_case === '') {
      res.send(JSON.stringify({ 'error' : 'q_case for /apis/scubits cant be null'})); 
      return;
    }

    q_case = req.query.q_case;

    switch(q_case) {

      case DEFS.CONST.APIS_SCUBITS_CONTEXT_Q_CASE_OFFERS:
        _getAllOffers(req, res);
      break;

      case DEFS.CONST.APIS_SCUBITS_CONTEXT_Q_CASE_PRICE_RANGES:
        _getAllPriceRanges(req, res);
      break;

      case DEFS.CONST.APIS_SCUBITS_CONTEXT_Q_CASE_PAYMENT_TYPES:
        _getAllPaymentTypes(req, res);
      break;

      case DEFS.CONST.APIS_SCUBITS_CONTEXT_Q_CASE_GET_ALL:
        _getAllScubitContext(req, res);
      break;

      default: //Ivalid case
        res.send(JSON.stringify({ 'error' : 'invalid q_case for /apis/ '
                  + 'scubits/context ' + req.query.q_case}));
      break;   

      }
  }

  var _getAllOffers = function(req, res) {

    //Call the helper object 
    scubitsContextGetApiHelperObj.getAllOffers(function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of all scubit offers ");
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getAllOffers '}));
      }
      return;
    });

  }

  var _getAllPriceRanges = function(req, res) {

    //Call the helper object 
    scubitsContextGetApiHelperObj.getAllPriceRanges(function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of all scubit Price ranges ");
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getAllPriceRanges '}));
      }
      return;
    });
    
  }
  
  var _getAllPaymentTypes = function(req, res) {

    //Call the helper object 
    scubitsContextGetApiHelperObj.getAllPaymentTypes(function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of all scubit payment types ");
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getAllPaymentTypes '}));
      }
      return;
    });
  }

  var _getAllScubitContext = function(req, res) {

    //Call the helper object 
    scubitsContextGetApiHelperObj.getAllScubitContext(req, res, function(returnMsg, retData) {
      if(returnMsg === 'success') {
        SCUBE_LOG.info("Responding with json data of get all scubit context");
        res.send(retData);
      } else {
        res.send(JSON.stringify({ 'error' : 'DB Error for getAllScubitContext '}));
      }
      return;
    });
  }
}
module.exports = scubitsContext;
