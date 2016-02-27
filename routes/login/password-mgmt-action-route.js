
var password_mgmt = function() {
  var passwordMgmtController      = require(DEFS.DIR.C_LOGIN_PWD_MANAGEMENT);
  var passwordMgmtControllerObj   = new passwordMgmtController();

  this.getForgotPwdAction = function(req, res) {
    // Set the domain to genymotion if req is from emulator
    domainHandler.setDomain(req);
    res.render('forgot-password.ejs', { message: req.flash('forgotPwdMessage') });
  }

  this.postForgotPwdAction = function(req, res) {
    console.log(req.body.email);
    passwordMgmtControllerObj.sendResetPwdMail(req, res, req.body.email);
  }

  this.getResetPwdAction = function(req, res) {
    // Set the domain to genymotion if req is from emulator
    domainHandler.setDomain(req);
    passwordMgmtControllerObj.validateResetPwdLink(req, res);
  }

  this.postResetPwdAction = function(req, res) {
    passwordMgmtControllerObj.resetPwdAction(req, res);
  }

  this.getChangePwdAction = function(req, res) {

    // Set the domain to genymotion if req is from emulator
    domainHandler.setDomain(req);

    if(!req.session.passport.user) {
      console.log("No valid sign in session, redirecting to login page");
      req.flash('loginMessage', 'Please Login to change password');
      res.redirect('/login');
      return;
    } else {  //Allowing change of pwd since he is logged in
      //req.flash('changePwdMessage', 'Fill in the below to change the password');
      passportUserId = req.session.passport.user.user_id;
      passportUserEmail =  req.session.passport.user.email_id;
      res.render('change-pwd.ejs', { message: req.flash('changePwdMessage'), userId: passportUserId, userEmail: passportUserEmail });
    }
  }

  this.postChangePwdAction = function(req, res) { 
    passwordMgmtControllerObj.changePwdAction(req, res);(req, res);
  }

}
module.exports =  password_mgmt;
