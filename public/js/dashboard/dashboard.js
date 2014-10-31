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
					//jQuery.each(order.items, function(i, item) {
					//	getStyleDetailsById(item, order.order_id);						
					//});
					var result= configure_order_items(order.items);
					//console.log(result);
					displayOrders(result, order.order_id);
				}
				
				
			});
			jQuery("#dahsboard_tb tbody").html(output);
		}
	});	
}

function configure_order_items(items){
	//console.log(items);
	var data=new Array();
	var exterior=new Array();
	var interior=new Array();
	jQuery.each(items, function(i, item) {
		if(item.item_type == 'style_id'){		
			var style_id = item.item_id;
			data["style_id"]=style_id;	
		}	
		
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
			jQuery("#car_name_"+order_id).html(response.make.name+' '+response.model.name);
			jQuery("#engine_"+order_id).html(response.engine.name);
			jQuery("#transmission_"+order_id).html(response.trim+' '+response.transmission.transmissionType);
			
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
			
		},
		error : function(response) {
			displayOrders(data, order_id);
		}
	});
}

/*
function getStyleDetailsById(items, order_id){
	
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
				
				//jQuery.each(response.colors, function(i, item) {
				//	if(item.category == "Exterior"){
				//		jQuery.each(item.options, function(k, v) {
							//output += template(v);							   
				//			console.log(v);
				//		});															   
				//	}
				//});
				
				
			},
			error : function(response) {
				getStyleDetailsById(item, order_id);
			}
		});
	}
}
*/