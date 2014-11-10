jQuery(document).ready(function() {
	jQuery(window).load(function (e) {
		console.log(window.location.pathname);		
		getCarSelectSession();	
	});	
	
	jQuery("#summary-post-btn").on("click", function(e) {
		e.preventDefault();													 
		var url = "/vehicle/summary-post";
		jQuery.ajax({
			url : url,
			type : "POST",
			dataType : 'json',
			success : function(response) {
				
				if(response.success){
					//TODO forward it to dashboard
					location.href="/user/post-response";
				}else{
					//location.href=response.url;
					//alert(response.msg);
					//jQuery('#Signin').modal('show');
					jQuery('#Signin').modal({ 
						backdrop: 'static',
						keyboard: false
					});
				}
			},
			error : function(response) {
				console.log("There's an issue in processing this form.");
			}
		});
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
			getStyleDetailsById();
			load_profile_image();
			getEquipmentDetailsByStyleId();
			newtotalcashpricebystyleidandzip();
			
			jQuery("#summary-post-btn").removeAttr("disabled");
		},
		error : function(response) {
			getCarSelectSession();
		}
	});	
}

function getStyleDetailsById(){
	var style_id = jQuery('#style_id').val();
	//console.log(window.localStorage.getItem("car_select"));
	//return false;
	var url = BASE_URL + "vehicle/v2/styles/" + style_id + "?view=full&fmt=json&api_key=" + API_KEY;
	jQuery.ajax({
		url : url,
		type : "GET",
		dataType : 'json',
		success : function(response) {
			var CAR_SELECT = window.localStorage.getItem("car_select");
			if(CAR_SELECT){
				CAR_SELECT = jQuery.parseJSON(CAR_SELECT);
			}
			//console.log(CAR_SELECT);return false;
			total_price = response.price.baseInvoice;
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
			//console.log(CAR_SELECT.exterior);
			if(CAR_SELECT.exterior){
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
							total_price = total_price + item.price.baseMSRP
						}
					});	
				});
				jQuery("#exterior-options").html(output);
			}

			
			
			
			
			//Interior
			if(CAR_SELECT.interior){
				var output=""
				var src = jQuery("#interior-options-template").html();
				var template = Handlebars.compile(src);
				
				jQuery.each(interior, function(i, item) {
					var num = item.id
					num = num.toString();
					jQuery.each(CAR_SELECT.interior, function(i, v) {
						if(num == v){
							output += template(item);
							total_price = total_price + item.price.baseMSRP
						}
					});	
				});
				jQuery("#interior-options").html(output);
			}
			jQuery("#total_baseInvoice").html("$"+total_price);
			
			
			
			//Engine Tab
			var output=""
			var src = jQuery("#engine-options-template").html();
			var template = Handlebars.compile(src);
			jQuery("#engine-options").html(template(response) );
			//Transmission
			var output=""
			var src = jQuery("#transmission-options-template").html();
			var template = Handlebars.compile(src);
			jQuery("#transmission-options").html(template(response) );
			
			if(CAR_SELECT.interior_color){
				var output=""
				jQuery.each(response.colors, function(i, item) {
					if(item.category == "Interior"){
						jQuery.each(item.options, function(k, v) {
							if(v.id == CAR_SELECT.interior_color){
								//jQuery("#interior-options").html(output);
								output = '<li style="margin-top:10px;">Interior Color '+v.name+' <span class="price" style="float:right; margin-right:20px;">+ $0</span></li>';
								jQuery("#interior-options").append(output);
								return false;
							}
						});															   
					}
				});	
			}
			
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
							//jQuery("#car_main_image").attr("src", MEDIA + image_photo_small).width("500");
							var img="<img src='"+MEDIA+image_photo_small+"' style='width: 500px;'>";
							jQuery("#car-main-image").html(img);
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


function getEquipmentDetailsByStyleId(){
	var style_id = jQuery('#style_id').val();
	var url = BASE_URL + "vehicle/v2/styles/" + style_id + "/equipment?availability=standard&equipmentType=OTHER&fmt=json&api_key=" + API_KEY;
	jQuery.ajax({
		url : url,
		type : "GET",
		dataType : 'json',
		success : function(response) {
			var numOfSeats=0;
			jQuery.each(response.equipment, function(j, equipment) {
				if(equipment.name == "Seating Configuration") {									
					jQuery.each(equipment.attributes, function(k, v) {
						numOfSeats = parseInt(numOfSeats) + parseInt(v['value']);
					})
					return false;
				}				
			});
			
			var output=""
			var src = jQuery("#accessories-options-template").html();
			var template = Handlebars.compile(src);
			jQuery("#accessories-options").html(template(response) );
			jQuery("#numOfSeats").html(numOfSeats);
			
			
			//Steering
			var output=""
			var src = jQuery("#steering-options-template").html();
			var template = Handlebars.compile(src);
			jQuery.each(response.equipment, function(j, equipment) {
				if(equipment.name.indexOf("Steering") > -1) {									
					output += template(equipment);
				}				
			});
			jQuery("#steering-options").html(output );
			
			//Chassis
			var output=""
			var src = jQuery("#steering-options-template").html();
			var template = Handlebars.compile(src);
			jQuery.each(response.equipment, function(j, equipment) {
				if(equipment.name.indexOf("Chassis") > -1) {									
					output += template(equipment);
				}				
			});
			jQuery("#chasis-options").html(output );
			
			//Dimesions
			var output=""
			var src = jQuery("#steering-options-template").html();
			var template = Handlebars.compile(src);
			jQuery.each(response.equipment, function(j, equipment) {
				if(equipment.name.indexOf("Dimensions") > -1) {									
					output += template(equipment);
				}				
			});
			jQuery("#dimensions-options").html(output );

		},
		error : function(response) {
			getEquipmentDetailsByStyleId()
		}
	});	
}


function newtotalcashpricebystyleidandzip(){
	var style_id = jQuery('#style_id').val();
	var zipcode = jQuery("#zipcode").val();
	//https://api.edmunds.com/v1/api/tco/newtotalcashpricebystyleidandzip/200477465/90404?fmt=json&api_key=f95n2h2rf96b5vtybw6xat4z
	var url = BASE_URL_V1 + "tco/newtotalcashpricebystyleidandzip/"+ style_id +"/"+ zipcode +"?fmt=json&api_key=" + API_KEY;
	jQuery.ajax({
		url : url,
		type : "GET",
		dataType : 'json',
		success : function(response) {
			jQuery("#financing").html("$"+response.value);
		},
		error : function(response) {
			newtotalcashpricebystyleidandzip();
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
