
var password_mgmt = function() {
  var passwordMgmtController      = require(DEFS.DIR.C_LOGIN_PWD_MANAGEMENT);
  var passwordMgmtControllerObj   = new passwordMgmtController();

  this.getForgotPwdAction = function(req, res) {
    res.render('forgot-password.ejs', { message: req.flash('forgotPwdMessage') });
  }

  this.postForgotPwdAction = function(req, res) {
    passwordMgmtControllerObj.sendResetPwdMail(req, res, req.body.email);
  }

  this.getResetPwdAction = function(req, res) {
    passwordMgmtControllerObj.validateResetPwdLink(req, res);
  }

  this.postResetPwdAction = function(req, res) {
    passwordMgmtControllerObj.resetPwdAction(req, res);
  }
}
module.exports =  password_mgmt;
