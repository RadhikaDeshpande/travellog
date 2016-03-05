var namma_auth = function() {

  // Setup Passport strategies. Return object not required.
  var nammaAuth  = require(DEFS.DIR.C_LOGIN_NAMMA_AUTH)(passport); // pass passport for configuration
  /**********************signup-login-controllers-action-functions*****************/

  this.indexAction = function(req, res) {

    if(req.session.passport.user) {
      res.redirect('/home');
      return;
    }
    res.render('login.ejs');
    return;
  }

  // ====== COMMON LOGIN ROUTES ======

  // Show login form
  this.getLoginAction = function(req, res) {

    // If the user has already logged in, proceed to home page
    // If data is present send the data in the redirect
    if(req.session.passport.user) {
      res.redirect('/home');
      return;
    }
    /*res.render('login-form.ejs', {
      message      : req.flash('loginMessage'),
      domain       : DEFS.CONST.DOMAIN_URL,  
      userDeviceId : deviceId,
      consumerAppData : consumer_app_data
    }); // load login view*/
    res.render('login-form.ejs');
    return;
  }

   this.signupAction = function(req, res) {

    if(req.session.passport.user) {
      res.redirect('/home');
      return;
    }

    res.render('signup-form.ejs');
    return;
  }

  // Scube Ready : Show home page.
  // Reched here from passport login/signup success
  this.homeAction = function(req, res) {

    // Used to store the device id for which the request is recvd
    // This feild is used later when needed
    var deviceId;

    // If the user has not logged in, proceed to login page
    // If data is present send the data in the redirect
    // Passport.user is present only when signged in
    if(!req.session.passport.user) {

      SCUBE_LOG.info("No valid sign in session, redirecting to login page");
      if(req.query.consumer_app_data) {
        SCUBE_LOG.info("No Session, in getHome action, redirecting to home with app data");
        res.redirect('/login?consumer_app_data='+req.query.consumer_app_data);
      } else {
        SCUBE_LOG.info("No Session, in getHome action, redirecting to home without app data");
        res.redirect('/login');
      }

      return;
    }

    //Parse and extract the required feilds sent from consumer app
    if(req.query.consumer_app_data) {
      var domain = dataParser.getDomain(req);
      if(domain) {
        // Set the domain to genymotion if req is from emulator
        domainHandler.setDomain(domain);
      }
      deviceId = dataParser.getDeviceId(req);
      SCUBE_LOG.debug("Routes-Signup Action: DeviceId : "+ deviceId);
    }

    var userId = (typeof req.session.passport.user.user_id !== 'undefined') ? req.session.passport.user.user_id : null,
        emailId = (typeof req.session.passport.user.email_id !== 'undefined') ? req.session.passport.user.email_id : null,
        socialType = (typeof req.session.passport.user.social_type !== 'undefined') ? req.session.passport.user.social_type : null;

    SCUBE_LOG.info("User Successfully Logged in Via Social Account. emailId = "+emailId);

    res.render('login-success.ejs', {
      'result' : 'success',
      'userId': userId,
      'emailId': emailId,
      'socialType': socialType
    });

    return;
  }

  // ====== Scube logout route ======
  this.logoutAction = function(req, res) {
    // Hack to destroy social login session

    var info = {};
    if(typeof req.query.consumer_app_data === 'undefined') {
      res.send(JSON.stringify({ 'failure' : "Consumer app data not present for logout"}));
      return;
    }
    
    if(!req.session.passport.user){
      SCUBE_LOG.info("Logout Action : No valid session exists in logout action");
      res.redirect('/login');
      return;
    }
    
    info.userId = req.session.passport.user.user_id;
    info.deviceId = dataParser.getDeviceId(req);
    info.action = DEFS.CONST.SESSION_USER_LOGOUT;
    
    deviceMgmtApiObj.userDeviceLoginLogout(req, res, info, function(retVal) {
      if(retVal === "failure") {
        SCUBE_LOG.info("Device Mgmt Action : Device registration failure");
        res.send(JSON.stringify({ 'failure' : "Device registration failure" }));
        return;
      }

      SCUBE_LOG.info("Req session object before any logout ", req.session);
      
      if(req.session.passport.user.isNammaUser !== 1) {
        // Social login user 
          req.logout();
          SCUBE_LOG.info("Calling logout ", req);
          res.redirect('/login');
          return; 
      } else { // Namma user
        // Succesfully updated the device login table
        // destroy the session
        req.session.destroy();
        //SCUBE_LOG.info("Req session object After session destroy NAMMA ", req);
        setTimeout(function() {
          req.logout();
          //SCUBE_LOG.info("Req session object After session logout ", req);
          
          // device id is fetched from android by login/signup form
          SCUBE_LOG.info("In logout action Redirecting to login");
          res.redirect('/login');
        }, 2000);
      }
    });
  }
}
module.exports =  namma_auth;
    