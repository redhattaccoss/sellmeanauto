DASHBOARD_API = "/dashboard";
jQuery(document).ready(function() {
	jQuery(window).load(function (e) {
		check_user_session();
	});	
});

function check_user_session(){
	jQuery.get(DASHBOARD_API+"/check-user-session", function(response){
		response = jQuery.parseJSON(response);
		var user_page = jQuery("#user_page").val();				
		if(response.success){
			get_bids();
		}else{
			location.href='/user/logout';
		}
		
	});	
}
function get_bids(){
	jQuery.get("/bids/get-bids", function(response){
		response = jQuery.parseJSON(response);
		console.log(response);
		if(response.success){
			var output="";
			var src = jQuery("#dealer-bids-list-template").html();
			var template = Handlebars.compile(src);
			jQuery.each(response.bids, function(b, bid) {
				output += template(bid);
				var data=new Array();
				jQuery.each(bid.order_details, function(o, order) {
					//console.log(order)									
					
					if(o == 'style_id'){
						var style_id = order;
						//console.log(style_id)
						data['style_id'] = style_id;
					}
					if(o == 'order_items'){
						//console.log(order)
						jQuery.each(order, function(i, item) {
							//console.log(item)						
							if(item.item_type == "color_id" ){
								//console.log(item.item_id+" "+item.item_type)
								data['color_id'] = item.item_id;
							}
							
							if(item.item_type == "interior_color" ){
								//console.log(item.item_id+" "+item.item_type)
								data['interior_color'] = item.item_id;
							}
							
						});										
					}
					
				});	
				displayOrders(data, bid.id);
				load_image(data,bid.id);
			});	
			jQuery("#bid-list-tb tbody").html(output);
		}
	});
}


function displayOrders(data, bid_id){
	//console.log(data)
	
	var url = BASE_URL + "vehicle/v2/styles/" + data['style_id'] + "?view=full&fmt=json&api_key=" + API_KEY;
	jQuery.ajax({
		url : url,
		type : "GET",
		dataType : 'json',
		success : function(response) {
			jQuery("#car_name_"+bid_id).html(response.make.name+' '+response.model.name);
			jQuery("#engine_"+bid_id).html(response.engine.name);
			jQuery("#transmission_"+bid_id).html(response.year.year+" "+response.trim+' '+response.transmission.transmissionType);	
			
			
			if(data['color_id']){
				jQuery.each(response.colors, function(i, item) {
					if(item.category == "Exterior"){
						jQuery.each(item.options, function(k, v) {
							if(data['color_id'] == v.id){							   
								jQuery("#exterior_color_"+bid_id).html(v.name);
								return false;
							}
						});															   
					}
				});
			}
			
			
			if(data['interior_color']){
				jQuery.each(response.colors, function(i, item) {
					if(item.category == "Interior"){
						jQuery.each(item.options, function(k, v) {
							if(data['interior_color'] == v.id){							   
								jQuery("#interior_color_"+bid_id).html(v.name);
								return false;
							}
						});															   
					}
				});
			}
		},
		error : function(response) {
			displayOrders(data, bid_id);
		}
	});
	
}


function load_image(data, bid_id) {
	var image_api = BASE_URL_V1 + "vehiclephoto/service/findphotosbystyleid?styleId=" + data['style_id'] + "&fmt=json&api_key=" + API_KEY;

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
						jQuery("#car_main_image_" + bid_id).attr("src", MEDIA + image.photoSrcs[0]);
					} else {
						jQuery("#car_main_image_" + bid_id).attr("src", MEDIA + image_photo_small);
					}
				}
			});
			
		},
		error : function() {
			load_image(data, bid_id);
		}
	});

}
