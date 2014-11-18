DASHBOARD_API = "/dashboard";
jQuery(document).ready(function() {
	jQuery(window).load(function (e) {
		posted_view_details();
		get_bids_by_order_id();		
	});	
});

function getCardDetails(style_id, items){
	//console.log(style_id);
	//console.log(items);
	
	var car_exterior = new Array();
	var car_interior = new Array();
	jQuery.each(items, function(i, item) {
		if(item.item_type == "exterior"){
			car_exterior.push(item.item_id);
		}
	});
	
	jQuery.each(items, function(i, item) {
		if(item.item_type == "interior"){
			car_exterior.push(item.item_id);
		}
	});
	
	
	
	var url = BASE_URL + "vehicle/v2/styles/" + style_id + "?view=full&fmt=json&api_key=" + API_KEY;
	jQuery.ajax({
		url : url,
		type : "GET",
		dataType : 'json',
		success : function(response) {
			
			total_price = response.price.baseInvoice;
			//console.log(total_price);
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
			
			
			if(car_exterior){
				jQuery.each(exterior, function(i, item) {
					var num = item.id
					num = num.toString();
					jQuery.each(car_exterior, function(i, v) {
						if(num == v){
							total_price = total_price + item.price.baseMSRP
							//console.log(v)
						}
					});						
				});
			}
			
			if(car_interior){
				jQuery.each(interior, function(i, item) {
					var num = item.id
					num = num.toString();
					jQuery.each(car_interior, function(i, v) {
						if(num == v){
							total_price = total_price + item.price.baseMSRP
							//console.log(v)
						}
					});						
				});
			}
			
			//console.log(total_price);
			jQuery("#award-bid-modal-price").html("$"+total_price);
		},
		error : function(response) {
			getCardDetails(style_id, items);
		}
	});
	
	
}

function display_bid_offer(bid_id){
	jQuery.get(DASHBOARD_API + "/bid-details/?id="+bid_id, function(response){
		response = jQuery.parseJSON(response);
		//console.log(response);
		if (response.success){			
			//jQuery("#award-bid-modal-price").html(response.bid.bid_price);			
			jQuery("#award-bid-modal-finance-estimate").html("$"+response.bid.finance_estimate);
			jQuery("#award-bid-modal-current-bid-expire-days").html("$"+response.bid.bid_price);
			jQuery("#award-form-order-id").val(order_id);
			jQuery("#award-bid-modal").modal({keyboard:false, backdrop:"static"});
			
			getCardDetails(response.bid.style_id, response.bid.order_items);
			
		}
	})
}
function get_bids_by_order_id(){
	var order_id= jQuery("#order_id").val();
	var pagenum= jQuery("#pagenum").val();
	jQuery.get(DASHBOARD_API + "/get-bids-by-order-id/?order_id="+order_id+"&page="+pagenum, function(response){
		response = jQuery.parseJSON(response);
		console.log(response);				
		//Steering
		var output=""
		var src = jQuery("#poster-view-list-template").html();
		var template = Handlebars.compile(src);
		jQuery.each(response.bids, function(j, bid) {
			output += template(bid);							
		});
		jQuery("#poster-view-list-tb tbody").html(output );
		
		
		jQuery('.award-btn').click(function(e){
			e.preventDefault();
			var bid_id = jQuery(this).attr("data-bid_id");
			if(bid_id){
				//jQuery("#award-bid-modal").modal({keyboard:false, backdrop:"static"});
				display_bid_offer(bid_id);
			}
		});
		set_up_pagination(parseInt(response.pagenum), parseInt(response.maxpage));
	});
}

function set_up_pagination(pagenum, maxpage){
	var output="";		
	if (pagenum > 1){
		page = pagenum - 1;
		output += "<li><a href='#' data-page-num="+page+"><span aria-hidden='true'>&laquo;</span><span class='sr-only'>Previous</span></a></li>";			
	}else{		
		output += "<li class='disabled'><a href='#'><span aria-hidden='true'>&laquo;</span><span class='sr-only'>Previous</span></a></li>";
	}
	
	for(var i=1; i<=maxpage; i++ ){
		
		if(pagenum == i){
			output +="<li class='active'><a href='#' data-page-num="+i+">"+i+" <span class='sr-only'>(current)</span></a></li>";
		}else{
			output +="<li><a href='#' data-page-num="+i+">"+i+"</a></li>";
		}
	}
	
	if (pagenum < maxpage){
		page = pagenum + 1;
		output += "<li><a href='#' data-page-num="+page+"><span aria-hidden='true'>&raquo;</span><span class='sr-only'>Next</span></a></li>";
	}else{		
		output += "<li class='disabled'><a href='#'><span aria-hidden='true'>&raquo;</span><span class='sr-only'>Next</span></a></li>";
	}
	
	jQuery(".pagination").html(output );
	
	jQuery('.pagination a').click(function(e){
		e.preventDefault();
		var order_id= jQuery("#order_id").val();
		var pagenum = jQuery(this).attr("data-page-num");
		if(pagenum){
			//console.log(order_id+" "+pagenum);
			jQuery("#pagenum").val(pagenum);
			get_bids_by_order_id();
		}
	});
	
}

function posted_view_details(){
	var order_id= jQuery("#order_id").val();
	var style_id= jQuery("#style_id").val();


	//console.log(order_id);
	jQuery.get(DASHBOARD_API + "/get-user-order-details/?order_id="+order_id, function(response){
		response = jQuery.parseJSON(response);
		//console.log(response);				
		if(response.success){
			jQuery("#zipcode").html(response.order.zipcode);
			jQuery("#address").html(response.order.consumer.street+", "+response.order.consumer.city_town+" ,"+response.order.consumer.state_province);
			jQuery("#current_bid").html("$"+response.order.current_lowest_bid+" <span>"+response.order.current_bid_count+" Bids</span>");
			jQuery("#finance_estimate").html("$"+response.order.current_lowest_finance_bid+" <span>per month for 72 months</span>");
			
			jQuery("#style_id").val(response.order.style_id);
			var result= configure_order_items(response.order);
			displayOrders(result, order_id);
			getEquipmentDetailsByStyleId();
			load_main_image();
			
			//jQuery("#finance_estimate_clone_str").html(jQuery("#finance_estimate").html());
			
		}else{
			alert("There's a problem in displaying order details.");
		}
	});
	
}