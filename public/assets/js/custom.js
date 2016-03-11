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


	$('#myblogs').click(function() {
		//http://localhost:3000/apis/blogs/?q_case=4&user_name=<%= user_id %> 
    var email = $('#email_id').val();
		$.ajax({
			url: '/apis/blogs?q_case=4&user_name='+email,
			type: 'GET',
			data: "",
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function (returndata) {
				alert("Inside Ajax success of get my blogs - display the returndata");
			  //alert(returndata);
			}
		});

		return false;
	});

	$('#viewblogsbylocation').click(function() {
		//http://localhost:3000/apis/blogs/?q_case=2&location_name= 
    alert("Location is hardcoded for now for this query");
		$.ajax({
			url: '/apis/blogs?q_case=2&location_name=San Francisco',
			type: 'GET',
			data: "",
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function (returndata) {
				alert("Inside Ajax success of viewblogsbylocation - display the returndata");
			  //alert(returndata);
			}
		});

		return false;
	});

	$('#viewblogsbytoptraveldestination').click(function() {
		//http://localhost:3000/apis/blogs/?q_case=2&location_name= 
    
		$.ajax({
			url: '/apis/blogs?q_case=3',
			type: 'GET',
			data: "",
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function (returndata) {
				alert("Inside Ajax success of viewblogsbylocation - display the returndata");
			  //alert(returndata);
			}
		});

		return false;
	});

	$('#viewmostviewedblogs').click(function() {
		//http://localhost:3000/apis/blogs/?q_case=2&location_name= 
    
		$.ajax({
			url: '/apis/blogs?q_case=1',
			type: 'GET',
			data: "",
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function (returndata) {
				alert("Inside Ajax success of viewmostviewedblogs - display the returndata");
			  //alert(returndata);
			}
		});

		return false;
	});

	$('#foodblogsbypopularity').click(function() {
		//http://localhost:3000/apis/blogs/?q_case=2&location_name= 
    
		$.ajax({
			url: '/apis/food?q_case=1',
			type: 'GET',
			data: "",
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function (returndata) {
				alert("Inside Ajax success of foodblogsbylocation - display the returndata");
			  //alert(returndata);
			}
		});

		return false;
	});
	
	$('#foodblogsbylocation').click(function() {
		//http://localhost:3000/apis/blogs/?q_case=2&location_name= 
    alert("Location is hardcoded for now for this query");
		$.ajax({
			url: '/apis/food?q_case=2&location_name=San Jose',
			type: 'GET',
			data: "",
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function (returndata) {
				alert("Inside Ajax success of foodblogsbylocation - display the returndata");
			  //alert(returndata);
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
