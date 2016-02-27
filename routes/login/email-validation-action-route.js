var email_validation = function() {

  var emailValidationController          = require(DEFS.DIR.C_LOGIN_EMAIL_VALIDATION);
  var validateUserEmailControllerObj     = new emailValidationController();

  this.validateUserEmailAction = function(req, res) {
    // Set the domain to genymotion if req is from emulator
    domainHandler.setDomain(req);
    validateUserEmailControllerObj.validateUserEmailValidationLink(req, res);
  }

  this.getResendUserValidateEmailAction = function(req, res) {
    // Set the domain to genymotion if req is from emulator
    domainHandler.setDomain(req);
    res.render('resend-email.ejs', { message: req.flash('revalidateEmailMessage') });
  }

  this.postResendUserValidateEmailAction = function(req, res) {
    validateUserEmailControllerObj.sendEmailForValidation(req, res, req.body.email, "resendValidation", "");
  }
}

module.exports =  email_validation;
