function get_dealer_dashboard(params){
	if (typeof params == "undefined"){
		params = "";
	}else{
		params = "?"+params;
	}
	
	jQuery.get(DASHBOARD_API + "/get-dealer-dashboard/"+params, function(response){
		response = jQuery.parseJSON(response);
		//console.log(response);		
		var output=""
		if(response.success){
			var src = jQuery("#dealer-dashboard-list-template").html();
			var template = Handlebars.compile(src);
			jQuery.each(response.user_orders, function(o, order) {
				order.ending = order.ending*1000;
				order.ending = millisecondsToStr(order.ending);
				output += template(order);

				var result= configure_order_items(order);
				displayOrders(result, order.order_id);
				load_image(order.style_id, order.order_id);
				
			});
		}else{
			output="<tr><td colspan='4'>There's an error in parsing dealer's dashboard list.</td></tr>"
		}
		jQuery("#dahsboard_tb tbody").html(output);
	});	
}

jQuery(document).on("submit", "#search-car-form", function(){
	var params = jQuery(this).serialize();
	get_dealer_dashboard(params);	
	return false;
});

/**
 * Add event for Place a bid
 */
jQuery(document).on("click", ".place-bid", function(e){
	e.preventDefault();
	var order_id = jQuery(this).attr("data-order_id");
	
	jQuery.get("/orders/view/?id="+order_id, function(response){
		response = jQuery.parseJSON(response);
		if (response.success){
			jQuery("#place-bid-modal-model").html(response.order.niceName);
			jQuery("#place-bid-modal-transmission").html(response.order.transmission);
			jQuery("#place-bid-modal-price").html(response.order.msrp);
			jQuery("#place-bid-modal-consumer-address").html(response.order.address);
			
			jQuery("#place-bid-modal-current-bid-expire-days").html(response.order.current_lowest_bid);
			
			jQuery("#place-bid-modal-finance-estimate").html(response.order.finance);
			jQuery("#place-bid-modal-low-finance").html(response.order.current_lowest_finance_bid);
			jQuery("#bid-form-order-id").val(order_id);
			jQuery("#place-bid-modal").modal({keyboard:false, backdrop:"static"});
		}
	})
});

var sendingBid = false;
jQuery(document).on("submit", "#bid-form", function(){
	if (!sendingBid){
		sendingBid = true;
		var data = jQuery(this).serialize();
		jQuery.post("/bids/place-bid/", data, function(response){
			response = jQuery.parseJSON(response);
			sendingBid = false;
			if (response.success){
				jQuery("#place-bid-modal").modal("hide");
				alert("You have bid successfully");
				get_dealer_dashboard();
				
			}
		})		
	}

	
	return false;
});
function get_user_order_details(){
	var order_id=jQuery("#order_id").val();
	//console.log(order_id);
	jQuery.get(DASHBOARD_API + "/get-user-order-details/?order_id="+order_id, function(response){
		response = jQuery.parseJSON(response);
		console.log(response);				
		if(response.success){
			jQuery("#zipcode").html(response.order.zipcode);
			jQuery("#address").html(response.order.consumer.street+", "+response.order.consumer.city_town+" ,"+response.order.consumer.state_province);
			jQuery("#current_bid").html("$"+response.order.current_lowest_bid+" <span>"+response.order.current_bid_count+" Bids</span>");
			jQuery("#finance_estimate").html("$"+response.order.current_lowest_finance_bid+" <span>per month for 72 months</span>");
			
			jQuery("#style_id").val(response.order.style_id);
			var result= configure_order_items(response.order);
			//console.log(result);
			displayOrders(result, order_id);
			getEquipmentDetailsByStyleId();
			load_main_image();
		}else{
			alert("There's a problem in displaying order details.");
		}
	});
}
