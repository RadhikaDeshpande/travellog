var namma_auth = function() {

  /**********************signup-login-controllers-action-functions*****************/

  this.indexAction = function(req, res) {

    if(req.session.user) {
      res.redirect('/profile');
      return;
    }
    res.render('login.ejs', {
                message : ""});
    return;
  }

  // ====== COMMON LOGIN ROUTES ======

  // Show login form
  this.getLoginAction = function(req, res) {

    // If the user has already logged in, proceed to home page
    // If data is present send the data in the redirect
    if(req.session.user) {
      res.redirect('/profile');
      return;
    }

    res.render('login-form.ejs', {
                message : ""});

    return;
  }

   this.signupAction = function(req, res) {

    if(req.session.user) {
      res.redirect('/profile');
      return;
    }

    res.render('signup-form.ejs', {
                message : ""});
    return;
  }

  // ====== Scube logout route ======
  this.logoutAction = function(req, res) {
    // Hack to destroy social login session

    var info = {};
    
    if(!req.session.passport.user){
      SCUBE_LOG.info("Logout Action : No valid session exists in logout action");
      res.redirect('/login');
      return;
    }

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
}
module.exports =  namma_auth;
    