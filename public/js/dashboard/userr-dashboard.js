function get_user_dashboard(){
	jQuery.get(DASHBOARD_API + "/get-user-dashboard", function(response){
		response = jQuery.parseJSON(response);
		console.log(response);		
		var output=""
		if(response.success){
			var src = jQuery("#user-dashboard-list-template").html();
			var template = Handlebars.compile(src);
			jQuery.each(response.user_orders, function(o, order) {
				output += template(order);
			});
		}else{
			output="<tr><td colspan='4'>There's an error in parsing dashboard list.</td></tr>"
		}
		jQuery("#dahsboard_tb tbody").html(output);
	});	
}