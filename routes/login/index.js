//contains all the routes for login module
var express             = require('express');
var app                 = module.exports = express();

//Based on the requests route it to appropriate controller action

var namma_auth          = require(DEFS.DIR.R_LOGIN_NAMMA_AUTH_ACTION);
var email_validation    = require(DEFS.DIR.R_LOGIN_EMAIL_VALIDATION_ACTION);
var password_mgmt       = require(DEFS.DIR.R_LOGIN_PASSWORD_MGMT_ACTION);

//Create new instances for each handlers
namma_auth_obj          = new namma_auth();
email_validation_obj    = new email_validation();
password_mgmt_obj       = new password_mgmt();

app.get('/', function(req, res) {
  namma_auth_obj.indexAction(req, res);
});

/****************** namma /signup' **********************/
app.get('/signup', function(req, res) {
  namma_auth_obj.signupAction(req, res);
});


app.post('/signup', function(req, res, next) {
  passport.authenticate('local-signup', function(err, userObj, info) {
    
    // If an exception occurred, err will be set
    if (err) {
      console.log('Fatal exception passport namma signup error');
      return next(err, res);
    }

    // If authentication failed, userObj,  will be set to false
    if (!userObj) {
      console.log('Passport Namma Signup did not return valid userObj.', info);
      return res.send(JSON.stringify({result: 'failure', message: ((info.message) ? info.message : null)}));
    }

    req.logIn(userObj, function(err) {
      if (err) {
        return next(err, res);
      }
      
      // Signup success
      return res.send(JSON.stringify({result: 'success', user: userObj, message: ((info.message) ? info.message : null)}));
    });
  })(req, res, next);
});



/************************* login ************************/
app.get('/login', function(req, res) {
  namma_auth_obj.getLoginAction(req, res);
});


// V2 implementation : get access to req and res objects to control login flow
app.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, userObj, info) {
    console.log('Namma login passport callback received');

    // If an exception occurred, err will be set
    if (err) {
      console.log('Fatal exception passport namma login error');
      return next(err, res);
    }

    // If authentication failed, userObj,  will be set to false
    if (!userObj) {
      console.log('Passport Namma Login did not return valid userObj.', info);
      return res.send(JSON.stringify({result: 'failure', message: ((info.message) ? info.message : null)}));
    }

    req.logIn(userObj, function(err) {
      if (err) {
        return next(err, res);
      }

      // Login success
      return res.send(JSON.stringify({result: 'success', user: userObj, message: ((info.message) ? info.message : null)}));
    });
  })(req, res, next);
});

app.use('/login', function(next) {
  console.log('Reached here', err);
});

/********************** profile *************************/
app.get('/home', function(req, res) {
  namma_auth_obj.homeAction(req, res);
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


