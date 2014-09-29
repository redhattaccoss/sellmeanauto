var API_KEY = "f95n2h2rf96b5vtybw6xat4z";
var BASE_URL = "https://api.edmunds.com/api/";
var BASE_URL_V1 = "https://api.edmunds.com/v1/api/";
var MEDIA = "https://media.ed.edmunds-media.com";

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
	console.log('statusChangeCallback');
	console.log(response);
	// The response object is returned with a status field that lets the
	// app know the current login status of the person.
	// Full docs on the response object can be found in the documentation
	// for FB.getLoginStatus().
	if(response.status === 'connected') {
		// Logged into your app and Facebook.
		testAPI();
	} else if(response.status === 'not_authorized') {
		// The person is logged into Facebook, but not your app.
		document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
	} else {
		// The person is not logged into Facebook, so we're not sure if
		// they are logged into this app or not.
		document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
	}
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
}

function load_image(first_style, item) {
	var image_api = BASE_URL_V1 + "vehiclephoto/service/findphotosbystyleid?styleId=" + first_style + "&fmt=json&api_key=" + API_KEY;

	$.ajax({
		url : image_api,
		type : "GET",
		dataType : 'json',
		success : function(response_image) {
			jQuery.each(response_image, function(j, image) {
				if(image.shotTypeAbbreviation == "FQ") {
					var image_photo_small = "";
					jQuery.each(image.photoSrcs, function(k, photo) {
						if(photo.indexOf("_87.jpg") > -1) {
							image_photo_small = photo;
						}
					})
					if(image_photo_small == "") {
						jQuery("#model_" + item.id).attr("src", MEDIA + image.photoSrcs[0]).width("87");
					} else {
						jQuery("#model_" + item.id).attr("src", MEDIA + image_photo_small).width("87");
					}
				}
			});
		},
		error : function() {
			load_image(first_style, item);
		}
	});

}

//SELECTED BODY TYPE
var BODY_TYPE = "";
var SELECTED_MAKE = "";
var SELECTED_NAME = "";


//load Model List
function loadModelList(name, make){
	
	jQuery("#make-model-list").html("Loading Model List for " + name);
	jQuery("#make-name-link").html(name);
	var url = BASE_URL + "vehicle/v2/" + make + "/models?year=2013&fmt=json&api_key=" + API_KEY;
	jQuery.get(url, function(response) {
		var output = "";
		var src = jQuery("#loaded-model-template").html();
		var template = Handlebars.compile(src);
		jQuery.each(response.models, function(i, item) {
			var first_style = "";
			jQuery.each(item.years, function(j, year) {
				jQuery.each(year.styles, function(k, style) {
					if (BODY_TYPE==""){
						first_style = style.id;				
						return false;
					}else{
						if (typeof style.submodel != "undefined"){
							if (BODY_TYPE==style.submodel.body){
								first_style = style.id;				
								return false;
							}
						}
					}
				});
				if(first_style != "") {
					return false;
				}
			});
			if (first_style!=""){
				load_image(first_style, item);
				output += template(item);				
			}

		});
		if(output == "") {
			output = "Sorry no model car is loaded for this category.";
		} else {
			output = "<ul>" + output + "</ul>";
		}

		jQuery("#make-model-list").html(output);

	})
}


jQuery(document).ready(function() {

	jQuery(".select-car").on("click", function(e){
		BODY_TYPE = jQuery(this).attr("data-value");
		jQuery("#select-car-default").html(jQuery(this).attr("data-label"));
		loadModelList(SELECTED_NAME, SELECTED_MAKE);
	});
	
	jQuery("#sign-in-fb").on("click", function(e) {
		FB.login(function(response) {
			FB.api('/me', function(response) {
				FB.api("/me/picture", {
					"redirect" : false,
					"height" : "200",
					"type" : "normal",
					"width" : "200"
				}, function(pic_response) {
					response.picture = pic_response.data.url;
					
					jQuery.post("/facebook-register/signin/", response, function(api_response){
						api_response = jQuery.parseJSON(api_response);
						if (api_response.status=="Registered via FB"){
							alert("Registered via FB!")
						}else{
							alert(api_response.status)
						}
					})
					
					
				});
				
			});
			// handle the response
		}, {
			scope : 'public_profile,email'
		});
		e.preventDefault();
	});

	jQuery(".make-link").on("click", function(e) {
		var make = jQuery(this).attr("data-make");
		var name = jQuery(this).attr("data-name");
		SELECTED_MAKE = make;
		SELECTED_NAME = name;
		
		loadModelList(SELECTED_NAME, SELECTED_MAKE);
		e.preventDefault();
	});
})