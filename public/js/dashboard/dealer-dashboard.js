function get_dealer_dashboard(){
	jQuery.get(DASHBOARD_API + "/get-dealer-dashboard", function(response){
		response = jQuery.parseJSON(response);
		//console.log(response);		
		var output=""
		if(response.success){
			var src = jQuery("#dealer-dashboard-list-template").html();
			var template = Handlebars.compile(src);
			jQuery.each(response.user_orders, function(o, order) {
				output += template(order);
				//console.log(order);
				var result= configure_order_items(order);
				//console.log(result);
				displayOrders(result, order.order_id);
				load_image(order.style_id, order.order_id)
			});
		}else{
			output="<tr><td colspan='4'>There's an error in parsing dealer's dashboard list.</td></tr>"
		}
		jQuery("#dahsboard_tb tbody").html(output);
	});	
}

function get_user_order_details(){
	var order_id=jQuery("#order_id").val();
	//console.log(order_id);
	jQuery.get(DASHBOARD_API + "/get-user-order-details/?order_id="+order_id, function(response){
		response = jQuery.parseJSON(response);
		console.log(response);				
	});
}