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

  // ====== travel log logout route ======
  this.logoutAction = function(req, res) {

    if(!req.session.user){
      console.log("Logout Action : No valid session exists in logout action");
      res.render('login.ejs', {
                message : ""});
      return;
    }

    // destroy the session
    req.session.user = "";
    req.session.destroy();
    setTimeout(function() {
      req.logout();
      console.log("Destroying the session")
      res.redirect('/');
      return;
    }, 2000);
  }
}
module.exports =  namma_auth;
    