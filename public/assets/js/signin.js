$(document).ready(function() {

    // POST Requests
    $('#signin').click(function() {
      loginUser();
    });

    $('#signup').click(function() {
    	signUpUser();
    });
    
});

// LOGIN
function loginUser() {
    var postData = validateLoginUserData();
    // If data validated, send login request to server
    if (postData) {
        $( "#loginform" ).submit();
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
        message = 'Password length should be minimum 6';
        alert(message);
    }

    return (!message) ? {
        'email': email,
        'password': password,
        'deviceId': (window.deviceId) ? window.deviceId : 0
    } : false;
}

// SIGNUP
function signUpUser() {
    var postData = validateSignupUserData();
		if(postData) {
            $( "#signupform" ).submit();
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
    return (!message) ? {
        'email': email,
        'firstName': name,
        'password': password
    } : false;
}