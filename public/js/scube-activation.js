var toastDuration = 7000,
    scubeDuration = 1500;

$(document).ready(function() {
    resetLayoutDims();
    window.maxHeight = $(window).height();

    // Email Validation
    $('#resendValidationEmail').click(function() {
        resendValidationEmail();
    });

    // SKIP Resending email
    $('.skip-button').click(function() {
        if (typeof window.JsInterface !== 'undefined') {
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

function resetLayoutDims() {
    // Set the max width for silder elements = viewport width
    var viewportW = $(window).width();
    $('.signin-container, .activation-form-container').css('width', viewportW);
}

function resendValidationEmail() {
    var postData = validateActivationFormData();

    // If data validated, send resendUserValidateEmail request to server
    if (postData) {

        // 3D scube
        showScube();

        $.ajax({
            type: "POST",
            url: "/resendUserValidateEmail",
            data: 'email=' + postData.email,
            success: function(data, status, jqXHR) {
                setTimeout(function() {
                    // Remove scube wait overlay
                    hideScube();
                }, scubeDuration);

                data = JSON.parse(data);
                console.log('Received /resendUserValidateEmail message : ', data);
                if (data.result === "success") {
                    if (typeof window.JsInterface !== 'undefined') {
                        // Go back to the same fragment where the user left 
                        window.JsInterface.goToPreviousPageAfterResendingEmail();
                    } else {
                        document.write("<h1>Validation email was resent Successfully</h1>");
                    }
                } else {
                    // Login failed with message
                    toastMessage((data.message) ? data.message : 'Sending validation email failed. Try again');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('resendUserValidateEmail POST error : '.jqXHR, textStatus, errorThrown);
            }
        });
    }
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

function validateActivationFormData() {
    var activationForm = $('.activation-form-container'),
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

function toastMessage(message) {
    if (typeof message !== 'undefined') {
        $('.error-message').html(message).fadeIn();

        setTimeout(function() {
            $('.error-message').fadeOut();
        }, toastDuration);
    }
}