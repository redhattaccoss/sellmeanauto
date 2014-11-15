DASHBOARD_API = "/dashboard";


jQuery(document).ready(function() {
	jQuery(window).load(function (e) {
		//console.log(window.location.pathname);
		check_user_session();
	});	
});

function check_user_session(){
	jQuery.get(DASHBOARD_API+"/check-user-session", function(response){
		response = jQuery.parseJSON(response);
		var user_page = jQuery("#user_page").val();				
		if(response.success){
			if(response.type=="dealer"){
				if(user_page == "dashboard"){
					get_dealer_dashboard();
				}
				if(user_page == "order"){
					get_user_order_details();
				}			
			}else if(response.type=="consumer"){
				if(user_page == "dashboard"){
					get_user_dashboard();
				}
			}else{
				alert("Error: Unknown user type");				
			}
		}else{
			location.href='/user/logout';
		}
		
	});	
}


function millisecondsToStr (milliseconds) {
    // TIP: to find current time in milliseconds, use:
    // var  current_time_milliseconds = new Date().getTime();

    function numberEnding (number) {
        return (number > 1) ? 's' : '';
    }

    var temp = Math.floor(milliseconds / 1000);
    var years = Math.floor(temp / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    }
    //TODO: Months! Maybe weeks? 
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    if (seconds) {
        return seconds + ' second' + numberEnding(seconds);
    }
    return 'less than a second'; //'just now' //or other string you like;
}

function configure_order_items(order){	
	
	var data=new Array();
	var exterior=new Array();
	var interior=new Array();
	
	data["style_id"]=order.style_id;	
	
	jQuery.each(order.items, function(i, item) {
		if(item.item_type == 'color_id'){		
			var color_id = item.item_id;
			data["color_id"]=color_id;	
		}
		
		if(item.item_type == 'interior_color'){		
			var interior_color = item.item_id;
			data["interior_color"]=interior_color;	
		}
		
		if(item.item_type == 'exterior'){		
			exterior.push(item.item_id);
			data["exterior"]=exterior;	
		}
		
		if(item.item_type == 'interior'){		
			interior.push(item.item_id);
			data["interior"]=interior;	
		}
	});
	
	return data
	
}

function displayOrders(data, order_id){
	var url = BASE_URL + "vehicle/v2/styles/" + data['style_id'] + "?view=full&fmt=json&api_key=" + API_KEY;
	jQuery.ajax({
		url : url,
		type : "GET",
		dataType : 'json',
		success : function(response) {
			total_price = response.price.baseInvoice;
			jQuery("#car_name_"+order_id).html(response.make.name+' '+response.model.name);
			jQuery("#engine_"+order_id).html(response.engine.name);
			jQuery("#transmission_"+order_id).html(response.year.year+" "+response.trim+' '+response.transmission.transmissionType);
			
			jQuery("#mpg_"+order_id).html(response.MPG.city+"/"+response.MPG.highway+" <span>City/Hwy</span>");
			jQuery("#horsepower_"+order_id).html(response.engine.horsepower);
			jQuery("#numOfDoors_"+order_id).html(response.numOfDoors);
			
			if(data['color_id']){
				//console.log("color_id => "+data['color_id']);
				jQuery.each(response.colors, function(i, item) {
					if(item.category == "Exterior"){
						jQuery.each(item.options, function(k, v) {
							if(data['color_id'] == v.id){							   
								//console.log(v);
								jQuery("#exterior_color_"+order_id).html(v.name);
								return false;
							}
						});															   
					}
				});
			}
			
			
			if(data['interior_color']){
				//console.log("interior_color => "+data['interior_color']);
				jQuery.each(response.colors, function(i, item) {
					if(item.category == "Interior"){
						jQuery.each(item.options, function(k, v) {
							if(data['interior_color'] == v.id){							   
								//console.log(v);
								jQuery("#interior_color_"+order_id).html(v.name);
								return false;
							}
						});															   
					}
				});
			}
			
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
			//console.log(data['exterior']);
			if(data['exterior']){
				var output=""
				var src = jQuery("#exterior-options-template").html();
				var template = Handlebars.compile(src);
				
				jQuery.each(exterior, function(i, item) {
					
					var num = item.id
					num = num.toString();
					jQuery.each(data['exterior'], function(i, v) {
						if(num == v){
							output += template(item);
							total_price = total_price + item.price.baseMSRP
						}
					});	
					
				});
				jQuery("#exterior-options_"+order_id).html(output);
			}
			
			if(data['interior']){
				var output=""
				var src = jQuery("#interior-options-template").html();
				var template = Handlebars.compile(src);
				
				jQuery.each(interior, function(i, item) {
					
					var num = item.id
					num = num.toString();
					jQuery.each(data['interior'], function(i, v) {
						if(num == v){
							output += template(item);
							total_price = total_price + item.price.baseMSRP
						}
					});	
					
				});
				jQuery("#interior-options_"+order_id).html(output);
			}
			
			
			//Engine Tab
			if(jQuery("#engine-options-template").html()){
				var output=""
				var src = jQuery("#engine-options-template").html();
				var template = Handlebars.compile(src);
				jQuery("#engine-options-"+order_id+" tbody").html(template(response) );
			}
			
			//Transmission
			if(jQuery("#engine-options-template").html()){
				var output=""
				var src = jQuery("#transmission-options-template").html();
				var template = Handlebars.compile(src);
				jQuery("#transmission-options-"+order_id+" tbody").html(template(response) );
			}
			jQuery("#total_baseInvoice_"+order_id).html("$"+total_price);
			
		},
		error : function(response) {
			displayOrders(data, order_id);
		}
	});
}

function getEquipmentDetailsByStyleId(){
	var style_id = jQuery('#style_id').val();
	var order_id = jQuery('#order_id').val();
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
			jQuery("#accessories-options_"+order_id).html(template(response) );
			jQuery("#numOfSeats_"+order_id).html(numOfSeats);
			
			//Steering
			var output=""
			var src = jQuery("#steering-options-template").html();
			var template = Handlebars.compile(src);
			jQuery.each(response.equipment, function(j, equipment) {
				if(equipment.name.indexOf("Steering") > -1) {									
					output += template(equipment);
				}				
			});
			jQuery("#steering-options-"+order_id+" tbody").html(output );
			
			
			//Chassis
			var output=""
			var src = jQuery("#steering-options-template").html();
			var template = Handlebars.compile(src);
			jQuery.each(response.equipment, function(j, equipment) {
				if(equipment.name.indexOf("Chassis") > -1) {									
					output += template(equipment);
				}				
			});
			jQuery("#chasis-options-"+order_id+" tbody").html(output );
			
			//Dimesions
			var output=""
			var src = jQuery("#steering-options-template").html();
			var template = Handlebars.compile(src);
			jQuery.each(response.equipment, function(j, equipment) {
				if(equipment.name.indexOf("Dimensions") > -1) {									
					output += template(equipment);
				}				
			});
			jQuery("#dimensions-options-"+order_id+" tbody").html(output );

		},
		error : function(response) {
			getEquipmentDetailsByStyleId()
		}
	});	
}

function load_image(style_id, order_id) {
	var image_api = BASE_URL_V1 + "vehiclephoto/service/findphotosbystyleid?styleId=" + style_id + "&fmt=json&api_key=" + API_KEY;

	jQuery.ajax({
		url : image_api,
		type : "GET",
		dataType : 'json',
		success : function(response_image) {
			
			//console.log(response_image);
			
			jQuery.each(response_image, function(j, image) {
				if(image.shotTypeAbbreviation == "FQ") {
					var image_photo_small = "";
					jQuery.each(image.photoSrcs, function(k, photo) {
						if(photo.indexOf("_400.jpg") > -1) {
							image_photo_small = photo;
						}
					})
					if(image_photo_small == "") {
						jQuery("#car_main_image_" + order_id).attr("src", MEDIA + image.photoSrcs[0]);
					} else {
						jQuery("#car_main_image_" + order_id).attr("src", MEDIA + image_photo_small);
					}
				}
			});
			
		},
		error : function() {
			load_image(style_id, order_id);
		}
	});

}

function load_main_image() {
	var style_id = jQuery('#style_id').val();
	var order_id = jQuery('#order_id').val();
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
							//jQuery("#car_main_image_"+order_id).attr("src", MEDIA + image_photo_small);
							//jQuery("#car_main_image_"+order_id).width("500");
							var img="<img src='"+MEDIA+image_photo_small+"' style='width: 500px;'>";
							jQuery("#car-main-image-"+order_id).html(img);
							return false;
						}
					})
					return false;
				}
			});
		},
		error : function() {
			load_main_image()
		}
	});

}