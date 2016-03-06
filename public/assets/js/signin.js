$(document).ready(function() {

    // POST Requests
    $('#signin').click(function() {
    	// alert("clicked signin");
      loginUser();
    });

    $('#signup').click(function() {
    	// alert("clicked signup");
    	signUpUser();
    });

});

// LOGIN
function loginUser() {
    var postData = validateLoginUserData();

    // If data validated, send login request to server
    if (postData) {
			$.ajax({
	        type: "POST",
	        url: "/login",
	        data: 'email=' + postData.email + '&password=' + postData.password,
	        success: function(data, status, jqXHR) {
	            
	            data = JSON.parse(data);
	            console.log('Received /login message : ', data);
	            if (data.result === "success" && typeof data.user !== 'undefined') {
                  document.write("<h1>User with userId : " + data.user.user_id +  "emailId : " + data.user.email_id + " Login Success</h1>");
              } else {
	                // Login failed with message
	                alert((data.message) ? data.message : 'Login Error : No message was received from passport');
	            };
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
	            console.log('Login POST error : '. jqXHR, textStatus, errorThrown);
	        }
      });
    }
}

function validateLoginUserData() {
	var message;
    var signInForm = $('.loginform'),
        email = signInForm.find('#email').val(),
        password = signInForm.find('#password').val(),
        message = '';

    if (!validator.isEmail(email)) {
        message = 'Email id is not valid';
        alert(message);
    }

    if (!validator.isLength(password, 6, 25)) {
        message = 'Password length is invalid';
        alert(message);
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
		alert(postData);
    if (postData) {

        $.ajax({
            type: "POST",
            url: "/signup",
            data: 'email=' + postData.email + '&password=' + postData.password + '&firstName=' + postData.firstName,
            success: function(data, status, jqXHR) {
                
                data = JSON.parse(data);
                console.log('Received /signup message : ', data);
                if (data.result === "success" && typeof data.user !== 'undefined') {
                  document.write("<h1>User with userId : " + data.user.user_id +  "emailId : " + data.user.email_id + " Signup Success</h1>");
                } else {
                    // Signup failed with message
                    alert((data.message) ? data.message : 'Signup Error : No message was received from passport');
                };
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Signup POST error : '. jqXHR, textStatus, errorThrown);
            }
        });
    }
}

function validateSignupUserData() {
		var message;
    var signUpForm = $('.loginform'),
        email = signUpForm.find('#email').val(),
        nickname = signUpForm.find('#name').val(),
        password = signUpForm.find('#password').val();
        // alert("email:" + email + " nickname: " + nickname + " password: " + password);
    if (!validator.isEmail(email)) {
        message = 'Email id is not valid';
        alert(message);
    }

    if (!validator.isLength(nickname, 2, 25)) {
        message = 'Nickname should atleast be 6 chars long';
        alert(message);
    }

    if (!validator.isLength(password, 6, 25)) {
        message = 'Password length is too short. Minimum 6 chars.';
        alert(message);
    }
    // alert("All done: " + message);
    return (!message) ? {
        'email': email,
        'firstName': name,
        'password': password
    } : false;
}