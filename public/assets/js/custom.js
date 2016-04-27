var transparentDemo = true;
var fixedTop = false;

$(window).scroll(function(e) {
    oVal = ($(window).scrollTop() / 170);
    $(".blur").css("opacity", oVal);
    
});

function likeButtonClick(likeButtonId) {
	var likeClicked = $(likeButtonId).find(".likeClicked").text();
	if (likeClicked === "0") {
		var viewCount = parseInt($(likeButtonId).find(".viewcount").text());
		var newViewCount = viewCount + 1;
		$(likeButtonId).find(".viewcount").html(newViewCount + " ");
		$(likeButtonId).find(".likeClicked").html("1");
	}
}

$(document).ready(function(){
	
	$('#nearMe').click(function(event){
		if (typeof globalLatitude !== 'undefined' && typeof globalLongitude !== 'undefined') {
			var range = $("#rangeSelect").val();
			var lati = globalLatitude;
			var longi = globalLongitude;
		    if(typeof globalCountry !== 'undefined') {
		    	var country = globalCountry;
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
	
	function displayPostsAroundMe(obj) {

		var aggregatePostsCount = obj['aggregatePostsCount'];
		if(aggregatePostsCount === 0) {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> No Posts found within the range. Please expand your search radius. </h3></div>");
			return;
		}

		var postArray = obj['postArray'];
		var postArrayLength = postArray.length;
		if(aggregatePostsCount == 1) {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> Found " + aggregatePostsCount + " post near you</h3></div>");
		} else {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> Found " + aggregatePostsCount + " posts near you</h3></div>");
		}
		var divIterator = 0;
		for (var i = 0; i < postArrayLength; i++) {
			var singlePost_cityId 			= postArray[i]['_id'];
			var singlePost_posts 			= postArray[i]['blogs'];
			var singlePost_country 			= postArray[i]['country'];
			var singlePost_distFromUser 	= postArray[i]['distFromUser'];
			var singlePost_lat 				= postArray[i]['lat'];
			var singlePost_long 			= postArray[i]['long'];
			var singlePost_locMetaData 		= postArray[i]['locMetaData'];
			var singlePost_totalBlogCount 	= postArray[i]['totalBlogCount'];
			for (var j = 0; j < singlePost_totalBlogCount; j++) {
				var contentDivId = "contentDiv" + divIterator;
				var imageSrcId = "imageSrc" + divIterator;
				var geocodeDivId = "geocodeDiv" + divIterator;
				var mapDivId = "mapDiv" + divIterator;
				var likeButtonId = "likeButton" + divIterator;
				$("#blogcontent").append("<div class=\"contentDivClass\" id=" + contentDivId + ">" + singlePost_posts[j]['travel_text'] + "</div>");
				$("#blogcontent").append("<div class=\"imageAndGeo\">\
					<img class=\"imageSrcClass\" id=" + imageSrcId + " src=" + singlePost_posts[j]['images'][0] + "></img>\
					<div class=\"geocodeClass\" id=" + geocodeDivId + "></div>\
				</div>");

				$("#"+geocodeDivId).append("<div class=\"likeButton\" id="+likeButtonId+" onclick=\"likeButtonClick("+ likeButtonId + ");\"><span class=\"btn btn-info\"><span class=\"likeClicked\" style=\"display:none;\">0</span><span class='viewcount'>"+ singlePost_posts[j]['viewCount'] + " </span><span class=\"glyphicon glyphicon-thumbs-up\"></span> Likes</span></div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Location : " + singlePost_locMetaData['geobytesfqcn'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Latitude : " + singlePost_locMetaData['geobyteslatitude'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Longitude: " + singlePost_locMetaData['geobyteslongitude'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Country Capital: " + singlePost_locMetaData['geobytescapital'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Country Population: " + singlePost_locMetaData['geobytespopulation'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Currency: " + singlePost_locMetaData['geobytescurrency'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Currency Code: " + singlePost_locMetaData['geobytescurrencycode'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Time Zone: " + singlePost_locMetaData['geobytestimezone'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Distance from your location: " + parseInt(singlePost_distFromUser) + " miles</div>");
				$("#"+geocodeDivId).append("<div class=\"mapClass\"><iframe class=\"mapIframeClass\" scrolling=\"yes\" src=\"https://www.google.com/maps/embed/v1/place?q=" + singlePost_lat + "," + singlePost_long + "&zoom=17&key=AIzaSyAAFLBcMG8LbY2CQdPpufS4yxYSAUYoVrE\"></iframe><div>");

				divIterator++;
			}
			
		}
		// getcitydetails(location_metadata);
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
						displayPostsAroundMe(data);
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
				displayMyBlogs(returndata);
			  //alert(returndata);
			}
		});

		return false;
	});

	$('#logout').click(function() {
		$.ajax({
			url: '/logout',
			type: 'GET',
			data: "",
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function (returndata) {
				window.location.replace("http://localhost:3000");
			}
	});

		return false;
	});

	$('#viewblogsbylocation').click(function() {
		//http://localhost:3000/apis/blogs/?q_case=2&location_name= 
    // alert("Location is hardcoded for now for this query");
    var location = $('#f_elem_city').val();
		$.ajax({
			url: '/apis/blogs?q_case=2&location_name=' + location,
			type: 'GET',
			data: "",
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function (returndata) {
				displayPostsByLocation(returndata);
			}
		});

		return false;
	});

	$('#viewblogsbytoptraveldestination').click(function() {    
		$.ajax({
			url: '/apis/blogs?q_case=3',
			type: 'GET',
			data: "",
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function (returndata) {
				displayTopTravelDestinations(returndata);
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
				//alert("Inside Ajax success of viewmostviewedblogs - display the returndata");
			  displayTrendingTravelPosts(returndata);
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
			  displayFoodByPopulariry(returndata);
			}
		});

		return false;
	});
	
	$('#foodblogsbylocation').click(function() {
		var location = $('#f_elem_city').val();
		$.ajax({
			url: '/apis/food?q_case=2&location_name=' +location ,
			type: 'GET',
			data: "",
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function (returndata) {
				displayFoodByLocation(returndata);
			}
		});

		return false;
	});

	function displayTopTravelDestinations(obj) {
		var postArray = obj['postArray'];
		var aggregatePostsCount = postArray[0].totalBlogCount;
		if(aggregatePostsCount === 0) {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> No Posts found please try other search methods</h3></div>");
			return;
		}

		var postArray = obj['postArray'];
		var postArrayLength = postArray.length;

		if(aggregatePostsCount == 1) {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> " + postArray[0]['_id'] + " is the top travel destination and has  " + aggregatePostsCount + " post</h3></div>");
		} else {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> " + postArray[0]['_id'] + " is the top travel destination and has  " + aggregatePostsCount + " posts</h3></div>");
		}
		
		var divIterator = 0;
		for (var i = 0; i < postArrayLength; i++) {
			var singlePost_cityId 			= postArray[i]['_id'];
			var singlePost_posts 			= postArray[i]['blogs'];
			var singlePost_country 			= postArray[i]['country'];
			var singlePost_lat 				= postArray[i]['lat'];
			var singlePost_long 			= postArray[i]['long'];
			var singlePost_locMetaData 		= postArray[i]['locMetaData'];
			var singlePost_totalBlogCount 	= postArray[i]['totalBlogCount'];
			for (var j = 0; j < singlePost_totalBlogCount; j++) {
				var contentDivId = "contentDiv" + divIterator;
				var imageSrcId = "imageSrc" + divIterator;
				var geocodeDivId = "geocodeDiv" + divIterator;
				var mapDivId = "mapDiv" + divIterator;
				$("#blogcontent").append("<div class=\"contentDivClass\" id=" + contentDivId + ">" + singlePost_posts[j]['travel_text'] + "</div>");
				$("#blogcontent").append("<div class=\"imageAndGeo\">\
					<img class=\"imageSrcClass\" id=" + imageSrcId + " src=" + singlePost_posts[j]['images'][0] + "></img>\
					<div class=\"geocodeClass\" id=" + geocodeDivId + "></div>\
				</div>");

				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Location : " + singlePost_locMetaData['geobytesfqcn'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Latitude : " + singlePost_locMetaData['geobyteslatitude'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Longitude: " + singlePost_locMetaData['geobyteslongitude'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Country Capital: " + singlePost_locMetaData['geobytescapital'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Country Population: " + singlePost_locMetaData['geobytespopulation'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Currency: " + singlePost_locMetaData['geobytescurrency'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Currency Code: " + singlePost_locMetaData['geobytescurrencycode'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Time Zone: " + singlePost_locMetaData['geobytestimezone'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"mapClass\"><iframe class=\"mapIframeClass\" scrolling=\"yes\" src=\"https://www.google.com/maps/embed/v1/place?q=" + singlePost_lat + "," + singlePost_long + "&zoom=17&key=AIzaSyAAFLBcMG8LbY2CQdPpufS4yxYSAUYoVrE\"></iframe><div>");

				divIterator++;
			}		
		}
	}

	function displayTrendingTravelPosts(obj) {

		var aggregatePostsCount = obj['aggregatePostsCount'];
		if(aggregatePostsCount === 0) {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> Oops! No Posts found . Please use other search criteria. </h3></div>");
			return;
		}

		var postArray = obj['postArray'];
		var postArrayLength = postArray.length;

		if(aggregatePostsCount == 1) {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> There are  " + aggregatePostsCount + " post that are trending right now</h3></div>");
		} else {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> There are  " + aggregatePostsCount + " posts that are trending right now</h3></div>");
		}
		
		var divIterator = 0;
		for (var i = 0; i < postArrayLength; i++) {
				var contentDivId = "contentDiv" + divIterator;
				var imageSrcId = "imageSrc" + divIterator;
				var geocodeDivId = "geocodeDiv" + divIterator;

				$("#blogcontent").append("<div class=\"contentDivClass\" id=" + contentDivId + ">" + obj['postArray'][i]['travel_text'] + "</div>");
				$("#blogcontent").append("<div class=\"imageAndGeo\">\
					<img class=\"imageSrcClass\" id=" + imageSrcId + " src=" + obj['postArray'][i]['images'][0] + "></img></div>");

				var singlePost_likes    	= obj['postArray'][i]['viewCount'];

				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Likes : " + singlePost_likes + "</div>");
				divIterator++;
			}	
	}

	function displayFoodByPopulariry(obj) {

		var aggregatePostsCount = obj['aggregatePostsCount'];
		if(aggregatePostsCount === 0) {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> Oops there are no posts. Please use different search </h3></div>");
			return;
		}

		var postArray = obj['postArray'];
		var postArrayLength = postArray.length;
		if(aggregatePostsCount == 1) {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> Found " + aggregatePostsCount + " food related post</h3></div>");
		} else {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> Found " + aggregatePostsCount + " food related posts</h3></div>");
		}

		var divIterator = 0;
		for (var i = 0; i < postArrayLength; i++) {
			var singlePost_foodJointName 	= postArray[i]['_id'];  //Ikes
			var singlePost_posts 			= postArray[i]['foodPosts'];
			var singlePost_likes    	= postArray[i]['likes'];
			var singlePost_visitCount    	= postArray[i]['visitCount'];
			for (var j = 0; j < singlePost_visitCount; j++) {
				var contentDivId = "contentDiv" + divIterator;
				var imageSrcId = "imageSrc" + divIterator;
				var geocodeDivId = "geocodeDiv" + divIterator;
				var mapDivId = "mapDiv" + divIterator;
				$("#blogcontent").append("<div class=\"contentDivClass\" id=" + contentDivId + ">" + singlePost_posts[j]['food_text'] + "</div>");
				$("#blogcontent").append("<div class=\"imageAndGeo\">\
					<img class=\"imageSrcClass\" id=" + imageSrcId + " src=" + singlePost_posts[j]['foodImages'][0] + "></img>\
					<div class=\"geocodeClass\" id=" + geocodeDivId + "></div>\
				</div>");

				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Food Joint Name : " + singlePost_foodJointName + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Likes : " + singlePost_likes + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Visit count: " + singlePost_visitCount + "</div>");
				divIterator++;
			}	
		}		
	}

	function displayPostsByLocation(obj) {

		var aggregatePostsCount = obj['aggregatePostsCount'];
		if(aggregatePostsCount === 0) {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> No Posts found.  Please choose a different location</h3></div>");
			return;
		}

		var postArray = obj['postArray'];
		var postArrayLength = postArray.length;

		if(aggregatePostsCount == 1) {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> Found " + aggregatePostsCount + " post for "+ postArray[0]['_id']+"</h3></div>");
		} else {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> Found " + aggregatePostsCount + " posts for "+ postArray[0]['_id']+"</h3></div>");
		}
		
		var divIterator = 0;
		for (var i = 0; i < postArrayLength; i++) {
			var singlePost_cityId 			= postArray[i]['_id'];
			var singlePost_posts 			= postArray[i]['blogs'];
			var singlePost_country 			= postArray[i]['country'];
			var singlePost_distFromUser 	= postArray[i]['distFromUser'];
			var singlePost_lat 				= postArray[i]['lat'];
			var singlePost_long 			= postArray[i]['long'];
			var singlePost_locMetaData 		= postArray[i]['locMetaData'];
			var singlePost_totalBlogCount 	= postArray[i]['totalBlogCount'];
			for (var j = 0; j < singlePost_totalBlogCount; j++) {
				var contentDivId = "contentDiv" + divIterator;
				var imageSrcId = "imageSrc" + divIterator;
				var geocodeDivId = "geocodeDiv" + divIterator;
				var mapDivId = "mapDiv" + divIterator;
				$("#blogcontent").append("<div class=\"contentDivClass\" id=" + contentDivId + ">" + singlePost_posts[j]['travel_text'] + "</div>");
				$("#blogcontent").append("<div class=\"imageAndGeo\">\
					<img class=\"imageSrcClass\" id=" + imageSrcId + " src=" + singlePost_posts[j]['images'][0] + "></img>\
					<div class=\"geocodeClass\" id=" + geocodeDivId + "></div>\
				</div>");

				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Location : " + singlePost_locMetaData['geobytesfqcn'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Latitude : " + singlePost_locMetaData['geobyteslatitude'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Longitude: " + singlePost_locMetaData['geobyteslongitude'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Country Capital: " + singlePost_locMetaData['geobytescapital'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Country Population: " + singlePost_locMetaData['geobytespopulation'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Currency: " + singlePost_locMetaData['geobytescurrency'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Currency Code: " + singlePost_locMetaData['geobytescurrencycode'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Time Zone: " + singlePost_locMetaData['geobytestimezone'] + "</div>");
				$("#"+geocodeDivId).append("<div class=\"mapClass\"><iframe class=\"mapIframeClass\" scrolling=\"yes\" src=\"https://www.google.com/maps/embed/v1/place?q=" + singlePost_lat + "," + singlePost_long + "&zoom=17&key=AIzaSyAAFLBcMG8LbY2CQdPpufS4yxYSAUYoVrE\"></iframe><div>");

				divIterator++;
			}
			
		}
		// getcitydetails(location_metadata);
	}

	function displayFoodByLocation(obj) {

		var aggregatePostsCount = obj['aggregatePostsCount'];
		if(aggregatePostsCount === 0) {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> Oops there are no posts. Please use different search </h3></div>");
			return;
		}

		var postArray = obj['postArray'];
		var postArrayLength = postArray.length;
		if(aggregatePostsCount == 1) {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> Found " + aggregatePostsCount + " post at " + postArray[0]['locationString']+"</h3></div>");
		} else {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> Found " + aggregatePostsCount + " posts at " + postArray[0]['locationString']+"</h3></div>");
		}

		var divIterator = 0;
		for (var i = 0; i < postArrayLength; i++) {
			var singlePost_foodJointName 	= postArray[i]['_id'];  //Ikes
			var singlePost_posts 			= postArray[i]['foodPosts'];
			var singlePost_likes    	= postArray[i]['likes'];
			var singlePost_visitCount    	= postArray[i]['visitCount'];
			for (var j = 0; j < singlePost_visitCount; j++) {
				var contentDivId = "contentDiv" + divIterator;
				var imageSrcId = "imageSrc" + divIterator;
				var geocodeDivId = "geocodeDiv" + divIterator;
				var mapDivId = "mapDiv" + divIterator;
				$("#blogcontent").append("<div class=\"contentDivClass\" id=" + contentDivId + ">" + singlePost_posts[j]['food_text'] + "</div>");
				$("#blogcontent").append("<div class=\"imageAndGeo\">\
					<img class=\"imageSrcClass\" id=" + imageSrcId + " src=" + singlePost_posts[j]['foodImages'][0] + "></img>\
					<div class=\"geocodeClass\" id=" + geocodeDivId + "></div>\
				</div>");

				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Food Joint Name : " + singlePost_foodJointName + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Likes : " + singlePost_likes + "</div>");
				$("#"+geocodeDivId).append("<div class=\"geoLine\"> Visit count: " + singlePost_visitCount + "</div>");
				divIterator++;
			}	
		}		
	}

	function displayMyBlogs(obj) {

		var aggregatePostsCount = obj['totalBlogCount'];
		if(aggregatePostsCount === 0) {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> Oops! No Posts found . Please use other search criteria. </h3></div>");
			return;
		}

		var postArray = obj['blogs'];
		var postArrayLength = postArray.length;

		if(aggregatePostsCount == 1) {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> There is  " + aggregatePostsCount + " post added by you.</h3></div>");
		} else {
			$("#blogcontent").html("<div class=\"blogLocationClass\"><h3> There are  " + aggregatePostsCount + " posts that are added by you</h3></div>");
		}
		
		var divIterator = 0;
		for (var i = 0; i < postArrayLength; i++) {
				var contentDivId = "contentDiv" + divIterator;
				var imageSrcId = "imageSrc" + divIterator;
				var geocodeDivId = "geocodeDiv" + divIterator;

				$("#blogcontent").append("<div class=\"imageAndGeo\">\
					<img class=\"imageSrcClass\" id=" + imageSrcId + " src=" + obj['blogs'][i]['images'][0] + "></img></div>");
				divIterator++;
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
