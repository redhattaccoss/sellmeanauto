jQuery(document).ready(function() {
	jQuery(window).load(function (e) {
		console.log(window.location.pathname);	
		getCarSelectSession();	
		getStyleDetailsById();
		load_profile_image()
	});	
});	


function getCarSelectSession(){
	var url = "/vehicle/get-car-select-session";
	
	jQuery.ajax({
		url : url,
		type : "GET",
		dataType : 'json',
		success : function(response) {
			window.localStorage.setItem("car_select", JSON.stringify(response.car_select));
		},
		error : function(response) {
			getCarSelectSession();
		}
	});	
	
}

function checkCarSelect(){
	var CAR_SELECT = window.localStorage.getItem("car_select");
	if(CAR_SELECT){
 		CAR_SELECT = jQuery.parseJSON(CAR_SELECT);
		return CAR_SELECT;
	}else{
		getCarSelectSession();
	}
}

function getStyleDetailsById(){
	var style_id = jQuery('#style_id').val();
	var CAR_SELECT = checkCarSelect();
	
	
	
	var url = BASE_URL + "vehicle/v2/styles/" + style_id + "?view=full&fmt=json&api_key=" + API_KEY;
	jQuery.ajax({
		url : url,
		type : "GET",
		dataType : 'json',
		success : function(response) {
			//console.log(CAR_SELECT.exterior.length);
			jQuery(".car_name").html(response.make.name+' '+response.model.name);
			jQuery("#car_make").val(response.make.niceName);
			jQuery("#baseMSRP").html("$"+response.price.baseMSRP);
			jQuery("#baseInvoice").html("$"+response.price.baseInvoice);
			jQuery("#mpg").html(response.MPG.city+"/"+response.MPG.highway+" <span>City/Hwy</span>");
			jQuery("#horsepower").html(response.engine.horsepower);
			jQuery("#numOfDoors").html(response.numOfDoors);
			
			var src = jQuery("#transmission-template").html();
			var template = Handlebars.compile(src);
			jQuery("#transmission").html(template(response));
			
			var src = jQuery("#car-year-template").html();
			var template = Handlebars.compile(src);
			jQuery("#car-year").html(template(response));
			
			
			
			var exterior = new Array();
			var interior = new Array();
			jQuery.each(response.options, function(i, item) {
				if(item.category == "Exterior"){
					jQuery.each(item.options, function(k, v) {
						exterior.push(v);
					});
				}
				if(item.category == "Interior"){
					jQuery.each(item.options, function(k, v) {
						interior.push(v);
					});
				}
			});
			
			//Exterior
			var output=""
			var src = jQuery("#exterior-options-template").html();
			var template = Handlebars.compile(src);
			
			jQuery.each(exterior, function(i, item) {
				//console.log(item);
				var num = item.id
				num = num.toString();
				jQuery.each(CAR_SELECT.exterior, function(i, v) {
					if(num == v){
						output += template(item);
					}
				});	
			});
			
			jQuery("#exterior-options").html(output);
			
			
			//Interior
			var output=""
			var src = jQuery("#interior-options-template").html();
			var template = Handlebars.compile(src);
			
			jQuery.each(interior, function(i, item) {
				var num = item.id
				num = num.toString();
				jQuery.each(CAR_SELECT.interior, function(i, v) {
					if(num == v){
						output += template(item);
					}
				});	
			});
			jQuery("#interior-options").html(output);
			
			
			
			
		},
		error : function(response) {
			getStyleDetailsById();
		}
	});
	
}

function load_profile_image() {
	var style_id = jQuery('#style_id').val();
	var image_api = BASE_URL_V1 + "vehiclephoto/service/findphotosbystyleid?styleId=" + style_id + "&fmt=json&api_key=" + API_KEY;
	var image_photo_small = "";
	jQuery.ajax({
		url : image_api,
		type : "GET",
		dataType : 'json',
		success : function(response_image) {
			//console.log(response_image);
			
			jQuery.each(response_image, function(j, image) {
				if(image.shotTypeAbbreviation == "FQ") {				
					jQuery.each(image.photoSrcs, function(k, photo) {
						if(photo.indexOf("_600.jpg") > -1) {
							image_photo_small = photo;
							//console.log(image_photo_small);
							jQuery("#car_main_image").attr("src", MEDIA + image_photo_small).width("500");
							return false;
						}
					})
					return false;
				}
			});
		},
		error : function() {
			load_profile_image()
		}
	});

}

jQuery(function ($) {
	var $active = $('#accordion .panel-collapse.in').prev().addClass('active');
	$active.find('a').prepend('<i class="glyphicon glyphicon-minus"></i>');
	$('#accordion .panel-heading').not($active).find('a').prepend('<i class="glyphicon glyphicon-plus"></i>');
	$('#accordion').on('show.bs.collapse', function (e) {
		$('#accordion .panel-heading.active').removeClass('active').find('.glyphicon').toggleClass('glyphicon-plus glyphicon-minus');
		$(e.target).prev().addClass('active').find('.glyphicon').toggleClass('glyphicon-plus glyphicon-minus');
	})
});
