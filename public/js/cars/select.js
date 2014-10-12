var API_KEY = "f95n2h2rf96b5vtybw6xat4z";
var BASE_URL = "https://api.edmunds.com/api/";
var BASE_URL_V1 = "https://api.edmunds.com/v1/api/";
var MEDIA = "https://media.ed.edmunds-media.com";

function loadModelStylesAvailable(){
	var makeName = jQuery("#make-value").val();
	var modelName = jQuery("#model-value").val();
	var year_val = jQuery("#year-value").val();
	
	
	var url = BASE_URL+"vehicle/v2/"+makeName+"/"+modelName+"/"+"?fmt=json&api_key="+API_KEY;
	
	jQuery.get(url, function(response){
		var name = response.id;
		name = name.replace(/_/gi, " ");
		jQuery("#car_name").html(name);
		var output = "";
		var src = jQuery("#car-style-template").html();
		var template = Handlebars.compile(src);
		jQuery.each(response.years, function(i, year){
			if (year.year==parseInt(year_val)){				
				jQuery.each(year.styles, function(j, item){
					
					load_image(item.id, item);
					load_style_details(item.id);
					output += template(item);
				});
			}
		});
		
		jQuery("#select-car-list").html(output);
	});
}

function load_style_details(styleid){
	var url = BASE_URL+"vehicle/v2/styles/"+styleid+"?view=full&fmt=json&api_key="+API_KEY;
	
	
	$.ajax({
		url : url,
		type : "GET",
		dataType : 'json',
		success : function(response) {
			jQuery("#ms_"+styleid).html(response.price.baseMSRP);
			jQuery("#city_"+styleid).html(response.MPG.city);
			jQuery("#hwy_"+styleid).html(response.MPG.highway);
		},
		error:function(){
			load_style_details(styleid);
		}
	});
}

function load_image(first_style, item) {
	var image_api = BASE_URL_V1 + "vehiclephoto/service/findphotosbystyleid?styleId=" + first_style + "&fmt=json&api_key=" + API_KEY;

	$.ajax({
		url : image_api,
		type : "GET",
		dataType : 'json',
		success : function(response_image) {
			
			console.log(response_image);
			jQuery.each(response_image, function(j, image) {
				if(image.shotTypeAbbreviation == "FQ") {
					var image_photo_small = "";
					jQuery.each(image.photoSrcs, function(k, photo) {
						if(photo.indexOf("_400.jpg") > -1) {
							image_photo_small = photo;
						}
					})
					if(image_photo_small == "") {
						jQuery("#img_" + item.id).attr("src", MEDIA + image.photoSrcs[0]);
					} else {
						jQuery("#img_" + item.id).attr("src", MEDIA + image_photo_small);
					}
				}
			});
		},
		error : function() {
			load_image(first_style, item);
		}
	});

}

jQuery(document).ready(function() {
	loadModelStylesAvailable();
	
});

jQuery(document).on("click", ".exterior-config", function(e){
	window.location.href = "/vehicle/style/"+jQuery(this).attr("data-id");	
	e.preventDefault();
});
