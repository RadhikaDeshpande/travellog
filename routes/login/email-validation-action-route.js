var email_validation = function() {

  var emailValidationController          = require(DEFS.DIR.C_LOGIN_EMAIL_VALIDATION);
  var validateUserEmailControllerObj     = new emailValidationController();

  this.validateUserEmailAction = function(req, res) {
    validateUserEmailControllerObj.validateUserEmailValidationLink(req, res);
  }

  this.getResendUserValidateEmailAction = function(req, res) {
    res.render('login-resend-email-validation.ejs', { message: req.flash('revalidateEmailMessage') });
  }

  this.postResendUserValidateEmailAction = function(req, res) {
    validateUserEmailControllerObj.sendEmailForValidation(req, res, req.body.email, "resendValidation", "");
  }
}

module.exports =  email_validation;
