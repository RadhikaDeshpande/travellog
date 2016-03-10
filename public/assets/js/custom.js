var transparentDemo = true;
var fixedTop = false;

$(window).scroll(function(e) {
    oVal = ($(window).scrollTop() / 170);
    $(".blur").css("opacity", oVal);
    
});

$(document).ready(function(){

	$('#uploadForm').submit(function(event){
		//disable the default form submission
		event.preventDefault();

		//grab all form data  
		var formData = new FormData($(this)[0]);
		//alert("Sending form data: " + formData);
		$.ajax({
			url: '/apis/blogs',
			type: 'POST',
			data: formData,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function (returndata) {
			  alert(returndata);
			}
		});

		return false;
	});

/*
	// Variable to store your files
	var files;

	// Add events
	$('input[type=file]').on('change', prepareUpload);

	// Grab the files and set them to our variable
	function prepareUpload(event) {
	  files = event.target.files;
	}

	// When submit button is clicked
	$("#submitButton").on('click' , uploadFiles );

	// Catch the form submit and upload the files
	function uploadFiles(event) {
	  	alert("Submit button clicked!!!");


	  	event.stopPropagation(); // Stop stuff happening
	    event.preventDefault(); // Totally stop stuff happening

	    // START A LOADING SPINNER HERE

	    // Create a formdata object and add the files
	    var data = new FormData();
	    $.each(files, function(key, value) {
	        data.append(key, value);
	    });

	    $.ajax({
	        url: '/test',
	        type: 'POST',
	        data: data,
	        cache: false,
	        dataType: 'json',
	        processData: false, // Don't process the files
	        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
	        success: function(data, textStatus, jqXHR)
	        {
	            if(typeof data.error === 'undefined')
	            {
	                // Success so call function to process the form
	                submitForm(event, data);
	            }
	            else
	            {
	                // Handle errors here
	                console.log('ERRORS: ' + data.error);
	            }
	        },
	        error: function(jqXHR, textStatus, errorThrown)
	        {
	            // Handle errors here
	            console.log('ERRORS: ' + textStatus);
	            // STOP LOADING SPINNER
	        }
	    });
	}

	function submitForm(event, data) {
	    // Create a jQuery object from the form
	    $form = $(event.target);

	    // Serialize the form data
	    var formData = $form.serialize();

	    // You should sterilise the file names
	    $.each(data.files, function(key, value)
	    {
	        formData = formData + '&filenames[]=' + value;
	    });

	    $.ajax({
	        url: 'submit.php',
	        type: 'POST',
	        data: formData,
	        cache: false,
	        dataType: 'json',
	        success: function(data, textStatus, jqXHR)
	        {
	            if(typeof data.error === 'undefined')
	            {
	                // Success so call function to process the form
	                console.log('SUCCESS: ' + data.success);
	            }
	            else
	            {
	                // Handle errors here
	                console.log('ERRORS: ' + data.error);
	            }
	        },
	        error: function(jqXHR, textStatus, errorThrown)
	        {
	            // Handle errors here
	            console.log('ERRORS: ' + textStatus);
	        },
	        complete: function()
	        {
	            // STOP LOADING SPINNER
	        }
	    });
	}
*/
});
