function get_dealer_dashboard(){
	jQuery.get(DASHBOARD_API + "/get-dealer-dashboard", function(response){
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
