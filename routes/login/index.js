//contains all the routes for login module
var express             = require('express');
var app                 = module.exports = express();
var math = require('mathjs');

//Based on the requests route it to appropriate controller action

var namma_auth          = require(DEFS.DIR.R_LOGIN_NAMMA_AUTH_ACTION);
var namma_auth_post     = require(DEFS.DIR.C_LOGIN_NAMMA_AUTH);
var email_validation    = require(DEFS.DIR.R_LOGIN_EMAIL_VALIDATION_ACTION);
var password_mgmt       = require(DEFS.DIR.R_LOGIN_PASSWORD_MGMT_ACTION);

//Create new instances for each handlers
namma_auth_obj          = new namma_auth();
namma_auth_post_obj     = new namma_auth_post();
email_validation_obj    = new email_validation();
password_mgmt_obj       = new password_mgmt();

app.get('/', function(req, res) {
  namma_auth_obj.indexAction(req, res);
});

/****************** namma /signup' **********************/
app.get('/signup', function(req, res) {
  namma_auth_obj.signupAction(req, res);
});

app.post('/signup', function(req, res) {
  namma_auth_post_obj.nammaSignupPostAction(req, res);
});


/************************* login ************************/
app.get('/login', function(req, res) {
  namma_auth_obj.getLoginAction(req, res);
});

app.post('/login', function(req, res) {
  namma_auth_post_obj.nammaLoginPostAction(req, res);
});

/********************** profile *************************/
app.get('/profile', function(req, res) {
 if(req.session.user){
  res.render('profile.ejs', {
                message : req.session.message,
                user_id : req.session.user.user_id,
                user_name:req.session.user.user_name});
  return;
 } 

  res.redirect('/');
});

/************************* logut ************************/
app.get('/logout', function(req, res) {
  namma_auth_obj.logoutAction(req, res);
});

/****************** user email validation ***************/
// Is triggered when user clicks on the email validation
app.get('/validateUserEmail', function(req, res) {
  email_validation_obj.validateUserEmailAction(req, res);
});

// Is triggered when the link provided by user is invalid or expried 
app.get('/resendUserValidateEmail', function(req, res) {
  email_validation_obj.getResendUserValidateEmailAction(req,res);
});

// Is triggered when resend validation email form is submitted
app.post('/resendUserValidateEmail', function(req, res) {
  email_validation_obj.postResendUserValidateEmailAction(req,res);
});

/****************** password management ******************/
app.get('/forgotPwd', function(req,res) {
  password_mgmt_obj.getForgotPwdAction(req, res);
});

app.post('/forgotPwd', function(req,res) {
  password_mgmt_obj.postForgotPwdAction(req, res);
});

// Validate forgotpwd link
app.get('/resetPwd',function(req,res){
  password_mgmt_obj.getResetPwdAction(req, res);
});

// Reset the pwd
app.post('/resetPwd',function(req,res){
  password_mgmt_obj.postResetPwdAction(req, res);
});

