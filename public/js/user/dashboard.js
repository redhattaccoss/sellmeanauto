DASHBOARD_API = "/dashboardApi";


jQuery(document).ready(function() {
	jQuery(window).load(function (e) {
		//console.log(window.location.pathname);
		check_user_session();
	});	
});

function check_user_session(){
	jQuery.get("/user/check-user-session", function(response){
		response = jQuery.parseJSON(response);
		//console.log(response);		
		if(response.success){
			get_user_dashboard();
		}else{
			location.href='/user/logout';
		}
	});	
}


function get_user_dashboard(){
	jQuery.get(DASHBOARD_API + "/get-user-dashboard", function(response){
		response = jQuery.parseJSON(response);
		//console.log(response);
		if(response.success){
			var output=""
			var src = jQuery("#dashboard-list-template").html();
			var template = Handlebars.compile(src);
			
			jQuery.each(response.user_orders, function(o, order) {
				output += template(order);
				
				if(order.items){
					jQuery.each(order.items, function(i, item) {
						//console.log(item);							  
						//if(item.item_type == 'style_id'){
							 getStyleDetailsById(item, order.order_id);
						//}
					});
				}
				
				
			});
			jQuery("#dahsboard_tb tbody").html(output);
		}
	});	
}


function getStyleDetailsById(item, order_id){
	
	if(item.item_type == 'style_id'){		
		var style_id = item.item_id;
	}
	
	if(item.item_type == 'color_id'){
		var color_id = +item.item_id;
	}
	
	
	if(style_id){
		//console.log(order_id+" => "+style_id);
		var url = BASE_URL + "vehicle/v2/styles/" + style_id + "?view=full&fmt=json&api_key=" + API_KEY;
		jQuery.ajax({
			url : url,
			type : "GET",
			dataType : 'json',
			success : function(response) {
				jQuery("#car_name_"+order_id).html(response.make.name+' '+response.model.name);
				jQuery("#engine_"+order_id).html(response.engine.name);
				jQuery("#transmission_"+order_id).html(response.trim+' '+response.transmission.transmissionType);
				//jQuery("#car_name_"+order_id).html(response.make.name+' '+response.model.name);
				//jQuery("#car_name_"+order_id).html(response.make.name+' '+response.model.name);
					if(color_id){
						console.log("exterior color => "+color_id);
					}
				/*
				jQuery.each(response.colors, function(i, item) {
					if(item.category == "Exterior"){
						jQuery.each(item.options, function(k, v) {
							//output += template(v);							   
							console.log(v);
						});															   
					}
				});
				*/
				
			},
			error : function(response) {
				getStyleDetailsById(item, order_id);
			}
		});
	}
}
