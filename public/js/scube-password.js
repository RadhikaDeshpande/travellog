var toastDuration = 7000,
    scubeDuration = 1500;

$(document).ready(function() {
    resetLayoutDims();
    window.maxHeight = $(window).height();

    // Reset password : User entered this form by clicking a valid forgot-password link from email
    $('#resetPassword').click(function() {
        resetPassword();
    });
});


$(window).resize(function() {
    // Handle Android Keyboard Resize
    var currentHeight = $(window).height();

    // Android resizes window on keyboard open (smaller height) /close (larger height)
    if (typeof window.JsInterface !== 'undefined') {
        if (currentHeight < window.maxHeight) {
            // Hide logo container
            $('.logo-container').css('display', 'none');
        } else {
            // Show logo container
            $('.logo-container').fadeIn();
        }
    }
});

function redirectToLoginHome() {
    location.href = '/login';
}

function resetLayoutDims() {
    // Set the max width for silder elements = viewport width
    var viewportW = $(window).width();
    $('.signin-container, .activation-form-container').css('width', viewportW);
}

function resetPassword() {
    var postData = validateResetPasswordFormData();

    // If data validated, send resendUserValidateEmail request to server
    if (postData) {

        // 3D scube
        showScube();

        $.ajax({
            type: "POST",
            url: "/resetPwd",
            data: 'userId=' + postData.userId + '&newPassword=' + postData.password,
            success: function(data, status, jqXHR) {
                setTimeout(function() {
                    // Remove scube wait overlay
                    hideScube();
                }, scubeDuration);

                data = JSON.parse(data);
                console.log('Received /resetPwd message : ', data);
                if (data.result === "success") {
                    // Take user to login home for him to login using the updated credentials
                    toastMessage((data.message) ? data.message : 'Password reset successful. Please login');
                } else {
                    // Login failed with message
                    toastMessage((data.message) ? data.message : 'Password reset failed');
                }

                // Success / Failure, always redirect user to Login home.
                setTimeout(function() {
                    redirectToLoginHome();
                }, 2000);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('resendUserValidateEmail POST error : '.jqXHR, textStatus, errorThrown);
            }
        });
    }
}

function validateResetPasswordFormData() {
    var passwordForm = $('.password-form-container'),
        userId = passwordForm.find('.userId').val(),
        password = passwordForm.find('.password').val(),
        message = null;

    if (!userId) {
        message = 'Invalid User Id';
        toastMessage(message);
    }

    if (!validator.isLength(password, 6, 25)) {
        message = 'Password length is invalid';
        toastMessage(message);
    }

    return (!message) ? {
        'userId': userId,
        'password': password
    } : false;
}

function showScube() {
    var $scube = $('.cube-overlay, .Cube');

    if ($scube) {
        $scube.fadeIn();
    }
}

function hideScube() {
    var $scube = $('.cube-overlay, .Cube');

    if ($scube) {
        $scube.fadeOut();
    }
}

function toastMessage(message) {
    if (typeof message !== 'undefined') {
        $('.error-message').html(message).fadeIn();

        setTimeout(function() {
            $('.error-message').fadeOut();
        }, toastDuration);
    }
}