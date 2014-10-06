jQuery(document).ready(function() {
	jQuery(window).load(function (e) {
		console.log(window.location.pathname);
	});	
	
	//login
	
	
	jQuery("#form_forgot_password").on( "submit", function( event ) {
		event.preventDefault();
		

		var email = jQuery('#email').val();
		var login_password = jQuery('#login_password').val();
		if(email == ""){
			alert("Plese enter your email address.");
			return false;
		}
				
		var formData = jQuery( this ).serialize();
		console.log(formData);
		
		jQuery.post("/forgot-password/send/", formData, function(data){
			data = jQuery.parseJSON(data);
			console.log(data);
			alert(data.msg);	
		});
		
	});
	
	
});	