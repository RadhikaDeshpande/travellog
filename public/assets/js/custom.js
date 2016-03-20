var transparentDemo = true;
var fixedTop = false;

$(window).scroll(function(e) {
    oVal = ($(window).scrollTop() / 170);
    $(".blur").css("opacity", oVal);
    
});

$(document).ready(function(){
	
	$('#nearMe').click(function(event){
		if (typeof globalLatitude !== 'undefined' && typeof globalLongitude !== 'undefined') {
			var range = $("#rangeSelect").val();
			var lati = globalLatitude;
			var longi = globalLongitude;
			alert("found lat and long");
		    if(typeof globalCountry !== 'undefined') {
		    	var country = globalCountry;
		    	alert("found country");
		    	jQuery.getJSON(
					"http://localhost:3000/apis/blogs?q_case=6&user_lat=" + lati + "&user_long=" + longi + "&user_country_name=" + country + "&user_radius_preference=" + range,
					function (data) {
						displayPostsAroundMe(data);
					}
				);
		    } else {
		    	jQuery.getJSON(
					"https://maps.googleapis.com/maps/api/geocode/json?latlng="+ lati + "," + longi + "&result_type=country&key=AIzaSyAK30NZQ8Xrcfm5imGDNtHtcx4fx1TkNHw",
					function (data) {
						var country = data['results'][0]['formatted_address'];
						// alert("User location: " + data['results'][0]['formatted_address']);
						jQuery.getJSON(
							"http://localhost:3000/apis/blogs?q_case=6&user_lat=" + lati + "&user_long=" + longi + "&user_country_name=" + country + "&user_radius_preference=" + range,
							function (data) {
								displayPostsAroundMe(data);
							}
						);
					}
				);
		    }
		} else {
			if (navigator.geolocation) {
			  var timeoutVal = 10 * 1000 * 1000;
			  navigator.geolocation.getCurrentPosition(
			    displayPosition, 
			    displayError,
			    { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
			  );
			}
			else {
			  alert("User location ");
			}
		}
		
	});
	
	function displayPostsAroundMe(data) {
		alert(JSON.stringify(data, 0, 4));
	}

	function displayPosition(position) {
		var lati = position.coords.latitude;
		var longi = position.coords.longitude;
		globalLatitude = lati;
		globalLongitude = longi;
		var range = $("#rangeSelect").val();
		jQuery.getJSON(
			"https://maps.googleapis.com/maps/api/geocode/json?latlng="+ lati + "," + longi + "&result_type=country&key=AIzaSyAK30NZQ8Xrcfm5imGDNtHtcx4fx1TkNHw",
			function (data) {
				var country = data['results'][0]['formatted_address'];
				globalCountry = country;
				// alert("User location: " + data['results'][0]['formatted_address']);
				jQuery.getJSON(
					"http://localhost:3000/apis/blogs?q_case=6&user_lat=" + lati + "&user_long=" + longi + "&user_country_name=" + country + "&user_radius_preference=" + range,
					function (data) {
						alert(JSON.stringify(data, 0, 4));
					}
				);
			}
		);
	}

	function displayError(error) {
	  var errors = { 
	    1: 'Permission denied',
	    2: 'Position unavailable',
	    3: 'Request timeout'
	  };
	  alert("Error: " + errors[error.code]);
	}

	$('#uploadForm').submit(function(event){
		//disable the default form submission
		event.preventDefault();
		var locArray = ($('#f_elem_city').val()).split(",");
		$('#city').val(locArray[0].trim());
		$('#state').val(locArray[1].trim());
		$('#country').val(locArray[2].trim());
		$('#locationString').val($('#f_elem_city').val());
		
		//grab all form data  
		var formData = new FormData($(this)[0]);
		jQuery.getJSON(
			"http://gd.geobytes.com/GetCityDetails?callback=?&fqcn=" + $('#f_elem_city').val(),
			function (returndata) {
				formData.append('cityDetails', JSON.stringify(returndata));
				$.ajax({
					url: '/apis/blogs',
					type: 'POST',
					data: formData,
					async: false,
					cache: false,
					contentType: false,
					processData: false,
					success: function (returndata) {
						returndata = JSON.parse(returndata);
						if(returndata === "Success") {
							alert("Uploaded successfully.");
						} else {
							alert("Oops, something went wrong. Please try again.");
						}
					}
				});
				return false;
			}
		);
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

	function getcitydetails(fqcn) {
		if (typeof fqcn == "undefined") 
			fqcn = jQuery("#f_elem_city").val();
		cityfqcn = fqcn;
		if (cityfqcn) {
		    jQuery.getJSON(
	            "http://gd.geobytes.com/GetCityDetails?callback=?&fqcn="+cityfqcn,
	            function (data) {
		            jQuery("#geobytesinternet").val(data.geobytesinternet);
		            jQuery("#geobytescountry").val(data.geobytescountry);
		            jQuery("#geobytesregionlocationcode").val(data.geobytesregionlocationcode);
		            jQuery("#geobytesregion").val(data.geobytesregion);
		            jQuery("#geobyteslocationcode").val(data.geobyteslocationcode);
		            jQuery("#geobytescity").val(data.geobytescity);
		            jQuery("#geobytescityid").val(data.geobytescityid);
		            jQuery("#geobytesfqcn").val(data.geobytesfqcn);
		            jQuery("#geobyteslatitude").val(data.geobyteslatitude);
		            jQuery("#geobyteslongitude").val(data.geobyteslongitude);
		            jQuery("#geobytescapital").val(data.geobytescapital);
		            jQuery("#geobytestimezone").val(data.geobytestimezone);
		            jQuery("#geobytesnationalitysingular").val(data.geobytesnationalitysingular);
		            jQuery("#geobytespopulation").val(data.geobytespopulation);
		            jQuery("#geobytesnationalityplural").val(data.geobytesnationalityplural);
		            jQuery("#geobytesmapreference").val(data.geobytesmapreference);
		            jQuery("#geobytescurrency").val(data.geobytescurrency);
		            jQuery("#geobytescurrencycode").val(data.geobytescurrencycode);
	            }
		    );
		}
	}

	jQuery("#f_elem_city").autocomplete({
		source: function (request, response) {
		 jQuery.getJSON(
			"http://gd.geobytes.com/AutoCompleteCity?callback=?&q="+request.term,
			function (data) {
			 response(data);
			}
		 );
		},
		minLength: 3,
		select: function (event, ui) {
			var selectedObj = ui.item;
			jQuery("#f_elem_city").val(selectedObj.value);
			getcitydetails(selectedObj.value);
		 	return false;
		},
		open: function () {
		 jQuery(this).removeClass("ui-corner-all").addClass("ui-corner-top");
		},
		close: function () {
		 jQuery(this).removeClass("ui-corner-top").addClass("ui-corner-all");
		}
	});

	jQuery("#f_elem_city").autocomplete("option", "delay", 100);

});
