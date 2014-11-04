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
		if(response.success){
			get_dealer_dashboard();
		}else{
			location.href='/user/logout';
		}
	});	
}


function get_dealer_dashboard(){
	jQuery.get(DASHBOARD_API + "/get-dealer-dashboard", function(response){
		response = jQuery.parseJSON(response);
		console.log(response);		
	});	
}