var toastDuration = 7000,
    scubeDuration = 1500;

$(document).ready(function() {
    resetLayoutDims();
    window.maxHeight = $(window).height();
    window.deviceId = 1;

    // Notify Android that webview login/signup is loaded
    // Android will callback with deviceid if present
    // else, callback will be invoked when GCM is completed
    // and deviceID is present in shared preferences
    if(typeof window.JsInterface !== 'undefined') {
        window.JsInterface.getDeviceId();
    }

    // Slide RIGHT to Sign In
    $('.signin-button').click(function() {
        $('.slider').animate({
            left: $(window).width() * -2
        }, "slow", function() {
            // Animation complete
            $('.signin-form-container i').fadeIn();
        });
    });

    // Navigate back to Main Screen
    $('.signin-form-container i').click(function() {
        $('.signin-form-container i').fadeOut();
        $('.slider').animate({
            left: $(window).width() * -1
        }, "slow", function() {
            // Reset form to signin form if user had clicked 'forgot password'
            convertBackToSignInForm();
        });
    });

    // Slide LEFT to Sign Up
    $('.signup-button').click(function() {
        $('.slider').animate({
            left: '0px'
        }, "slow", function() {
            // Animation complete
            $('.signup-form-container i').fadeIn();
        });
    });

    // Navigate back to Main Screen
    $('.signup-form-container i').click(function() {
        $('.signup-form-container i').fadeOut();
        $('.slider').animate({
            left: $(window).width() * -1
        }, "slow");
    });

    // Forgot Password Clicked
    $('.forgot-password').click(function() {
        convertToForgotPasswordForm();
    });

    // POST Requests
    $('#signin').click(function() {
        if($('.signin-form-container.forgot').length) {
            forgotOrResetPassword();
        } else {
            if(window.deviceId) {
                loginUser();
            } else {
                document.addEventListener("deviceIDReceived", function() {
                    console.log("Received 'deviceIDReceived' event from android. Sending POST Login request to backend");
                    loginUser();
                });
            }
        }
    });

    $('#signup').click(function() {
        if(window.deviceId) {
            signUpUser();
        } else {
            document.addEventListener("deviceIDReceived", function() {
                console.log("Received 'deviceIDReceived' event from android. Sending POST Signup request to backend");
                signUpUser();
            });
        }
    });

    // GET Requests
    $('.facebook-login').click(function() {
        facebookLogin();
    });

    // SKIP LOGIN
    $('.skip-button').click(function() {
        if(typeof window.JsInterface !== 'undefined') {
            window.JsInterface.goToHomePageAfterSkip();
        } else {
          console.log('Skip not supported in non-app environment');
        }
    });
});


$(window).resize(function() {
    // Handle Android Keyboard Resize
    var currentHeight = $(window).height();

    // Android resizes window on keyboard open (smaller height) /close (larger height)
    if(typeof window.JsInterface !== 'undefined') {
        if(currentHeight < window.maxHeight) {
            // Hide logo container
            $('.logo-container').css('display', 'none');
        } else {
            // Show logo container
            $('.logo-container').fadeIn();
        }
    }
});


function resetLayoutDims() {
    // Check for requested form : slide to appropriate form
    var formName = getQueryParam('form'),
        viewportW = $(window).width();

    $('.signin-container, .signin-form-container, .signup-form-container').css('width', viewportW);

    if(formName) {
        switch(formName) {
            // Load forgot password form
            case 'fp':
                // User clicked resetPwd link from email
                // Reached the link validation action in node
                // link validation failed, so user is redirected to forgot password/reset password form
                // for him to enter email again to resend reset password email
                console.log('requested for FP form. Loading accordingly');
                convertToForgotPasswordForm();
                $('.slider').css('left', viewportW * -2);
                toastMessage('Invalid Link provided. Please enter your email to receive instructions to reset');
                break;
            
            default:
                console.log('requested for unknown form. Loading login home');
                // Set the max width for silder elements = viewport width
                $('.slider').css('left', viewportW * -1);
                break;
        }
    } else {
        // Set the max width for silder elements = viewport width
        console.log('No specific form requested. Loading login home');
        $('.slider').css('left', viewportW * -1);
    }
}

function convertToForgotPasswordForm() {
    var signinForm = $('.signin-form-container');
    signinForm.addClass('forgot');
    signinForm.find('.password, .forgot-password').fadeOut();
    signinForm.find('button').html('Request Password');
}

function convertBackToSignInForm() {
    var signinForm = $('.signin-form-container');
    signinForm.removeClass('forgot');
    signinForm.find('.password, .forgot-password').fadeIn();
    signinForm.find('button').html('Sign In');
}

// Listen for Android notification when GCM and Scube Device registration complete
function updateDeviceId(deviceId) {
    window.deviceId = deviceId;
    sendEvent('deviceIDReceived');
}

// LOGIN
function loginUser() {
    var postData = validateLoginUserData();

    // If data validated, send login request to server
    if (postData) {

        // 3D scube
        showScube();

        $.ajax({
            type: "POST",
            url: "/login",
            data: 'email=' + postData.email + '&password=' + postData.password + '&deviceId=' + postData.deviceId,
            success: function(data, status, jqXHR) {
                setTimeout(function() {
                    // Remove scube wait overlay
                    hideScube();
                }, scubeDuration);

                data = JSON.parse(data);
                console.log('Received /login message : ', data);
                if (data.result === "success" && typeof data.user !== 'undefined') {
                    if (typeof window.JsInterface !== 'undefined') {
                        window.JsInterface.goToHomePageAfterAuth(data.user.user_id, data.user.email_id, "3", "namma");
                    } else {
                        // User logged in using non-app environment
                        document.write("<h1>User with userId : " + data.user.user_id +  "emailId : " + data.user.email_id + " Login Success</h1>");
                    }
                } else {
                    // Login failed with message
                    toastMessage((data.message) ? data.message : 'Login Error : No message was received from passport');
                };
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Login POST error : '. jqXHR, textStatus, errorThrown);
            }
        });
    }
}

function validateLoginUserData() {
    var signInForm = $('.signin-form-container'),
        email = signInForm.find('.email').val(),
        password = signInForm.find('.password').val(),
        message = '';

    if (!validator.isEmail(email)) {
        message = 'Email id is not valid';
        toastMessage(message);
    }

    if (!validator.isLength(password, 6, 25)) {
        message = 'Password length is invalid';
        toastMessage(message);
    }

    // Listen for deviceId from MainActivity before sending POST request


    return (!message) ? {
        'email': email,
        'password': password,
        'deviceId': (window.deviceId) ? window.deviceId : 0
    } : false;
}

// SIGNUP
function signUpUser() {
    var postData = validateSignupUserData();

    if (postData) {

        // 3D scube
        showScube();

        $.ajax({
            type: "POST",
            url: "/signup",
            data: 'email=' + postData.email + '&password=' + postData.password + '&firstName=' + postData.firstName + '&gender='  + postData.gender + '&location=' + postData.location + '&deviceId=' + postData.deviceId,
            success: function(data, status, jqXHR) {
                setTimeout(function() {
                    // Remove scube wait overlay
                    hideScube();
                }, scubeDuration);

                data = JSON.parse(data);
                console.log('Received /signup message : ', data);
                if (data.result === "success" && typeof data.user !== 'undefined') {
                    if (typeof window.JsInterface !== 'undefined') {
                        // TODO : Phase 1 San Jose is the only location
                        // Hardcoding 3 for now. Android dynamically handles a different locationId
                        // when we add a location selector in signup webview / when user updates profile
                        // Node needs to send new locationId to client device
                        window.JsInterface.goToHomePageAfterAuth(data.user.user_id, data.user.email_id, "3", "namma");
                    } else {
                        // User logged in using non-app environment
                        document.write("<h1>User with userId : " + data.user.user_id +  "emailId : " + data.user.email_id + " Signup Success</h1>");
                    }
                } else {
                    // Signup failed with message
                    toastMessage((data.message) ? data.message : 'Signup Error : No message was received from passport');
                };
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Signup POST error : '. jqXHR, textStatus, errorThrown);
            }
        });
    }
}

function validateSignupUserData() {
    var signUpForm = $('.signup-form-container'),
        email = signUpForm.find('.email').val(),
        nickname = signUpForm.find('.nickname').val(),
        password = signUpForm.find('.password').val(),
        gender = $(".gender-container input[type='radio']:checked").val(),
        message = '',
        locationId = '3';

    if (!validator.isEmail(email)) {
        message = 'Email id is not valid';
        toastMessage(message);
    }

    if (!validator.isLength(nickname, 2, 25)) {
        message = 'Nickname should atleast be 6 chars long';
        toastMessage(message);
    }

    if (!validator.isLength(password, 6, 25)) {
        message = 'Password length is too short. Minimum 6 chars.';
        toastMessage(message);
    }

    if(typeof gender === 'undefined') {
        message = 'Please select a gender';
        toastMessage(message);
    }

    // Listen for deviceId from MainActivity before sending POST request


    return (!message) ? {
        'email': email,
        'firstName': nickname,
        'password': password,
        'gender': gender,
        'location': locationId, // TODO : Let Scube Spread across the world from just San Jose
        'deviceId': (window.deviceId) ? window.deviceId : 0
    } : false;
}

function showScube() {
    var $scube = $('.cube-overlay, .Cube');

    if($scube) {
        $scube.fadeIn();
    }
}

function hideScube() {
    var $scube = $('.cube-overlay, .Cube');

    if($scube) {
        $scube.fadeOut();
    }   
}

// FACEBOOK LOGIN
function facebookLogin() {
    console.log('Sending Facebook login request');
    $.ajax({
        url: '/auth/facebook',
        type: 'GET',
        async: false,
        cache: false,
        contentType: "application/json",
        dataType: 'jsonp',
        crossDomain: true,
        success: function(json) {
            var data = JSON.parse(json);
            console.log('Received /auth/facebook success message : ', data);
            if (data.result === "success" && typeof data.userId !== 'undefined') {
                if (typeof window.JsInterface !== 'undefined') {
                    window.JsInterface.goToHomePageAfterAuth(data.userId, data.emailId, "3", "namma");
                } else {
                    // User logged in using non-app environment
                    document.write("<h1>User with userId : " + data.userId +  "emailId : " + data.emailId + " Facebook Login Success</h1>");
                }
            } else {
                // Login failed with message
                toastMessage(data);
            };
        }
    });
}

// FORGOT PASSWORD
function forgotOrResetPassword() {
    var postData = validateForgotPasswordFormData();

    // If data validated, send resendUserValidateEmail request to server
    if (postData) {
        $.ajax({
            type: "POST",
            url: "/forgotPwd",
            data: 'email=' + postData.email,
            success: function(data, status, jqXHR) {
                data = JSON.parse(data);
                console.log('Received /resendUserValidateEmail message : ', data);
                if (data.result === "success") {
                    toastMessage((data.message) ? data.message : 'Validation email with instructions sent successfully');
                    // slide back to show login home upon email sending is successful
                    $('.signin-form-container i').click();
                } else {
                  // Login failed with message
                  toastMessage((data.message) ? data.message : 'Sending validation email failed. Try again');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('resendUserValidateEmail POST error : '. jqXHR, textStatus, errorThrown);
            }
        });
    }
}

function validateForgotPasswordFormData() {
  var activationForm = $('.signin-form-container'),
        email = activationForm.find('.email').val(),
        message = null;

  if (!validator.isEmail(email)) {
      message = 'Email id is not valid';
      toastMessage(message);
  }

  return (!message) ? {
      'email': email
  } : false;
}

// Helpers
function getQueryParam(name) {
    var queryString = document.location.search;

    if (queryString !== "") {
        var queryParams = queryString.substr(1).split('&');
        for (var i = 0, len = queryParams.length; i < len; i++) {
            if (queryParams[i].indexOf(name) !== -1) {
                return queryParams[i].split('=')[1];
            }
        }
    }

    return null;
}

function toastMessage(message) {
    if(typeof message !== 'undefined') {
        $('.error-message').html(message).fadeIn();

        setTimeout(function() {
            $('.error-message').fadeOut();  
        }, toastDuration);
    }
}

function sendEvent(eventName) {
    var scubeEvent;
    if (typeof window.Event === 'function') { // modern browser
        scubeEvent = new Event(eventName);
    } else if (typeof window.Event === 'object') { // IE catch
        scubeEvent = document.createEvent('Event');
        scubeEvent.initEvent(eventName, true, true);
    }

    document.dispatchEvent(scubeEvent);
};
