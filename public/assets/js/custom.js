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
    // alert("Location is hardcoded for now for this query");
		$.ajax({
			url: '/apis/blogs?q_case=2&location_name=San Francisco',
			type: 'GET',
			data: "",
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function (returndata) {
				// alert("Inside Ajax success of viewblogsbylocation - display the returndata");
			  // alert(returndata);
			  // alert(returndata.length);
			  var obj = JSON.parse(returndata);
			  // $.each(obj, function() {
		   //      alert(this);             
		   //  })
		   var blog_location = obj['_id'];
		   var blog_count = obj['totalBlogCount'];
		   var blogs = obj['blogs'];
		   $.each(blogs, function() {
		        // alert(this['travel_text']);
		        // alert(this['images']);
		    });

			  $("#blogcontent").append("<div class=\"blogLocationClass\"><h3> Blogs in "+ blog_location + "</h3></div>");
			  for (var i = 0; i < blog_count; i++) {
			  	var contentDivId = "contentDiv" + i;
			  	var imageSrcId = "imageSrc" + i;
			  	$("#blogcontent").append("<div class=\"contentDivClass\" id=" + contentDivId + ">" + blogs[i]['travel_text'] + "</div>");
			  	$("#blogcontent").append("<img class=\"imageSrcClass\" id=" + imageSrcId + " src=" + blogs[i]['images'][0] + "></img>");
			  }
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
	
});
