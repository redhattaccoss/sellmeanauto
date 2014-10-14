jQuery(document).ready(function() {
	jQuery(window).load(function (e) {
		console.log(window.location.pathname);
	});	
	
	//login
	
	
	jQuery("#login_form").on( "submit", function( event ) {
		event.preventDefault();
		

		var username = jQuery('#username').val();
		var login_password = jQuery('#login_password').val();
		if(username == ""){
			alert("Plese enter your email address.");
			return false;
		}
		
		if(login_password == ""){
			alert("Plese type in your password.");
			return false;
		}
		
		
		
		var formData = jQuery( this ).serialize();
		console.log(formData);
		jQuery.post("/signin/", formData, function(data){
			data = jQuery.parseJSON(data);
			console.log(data);
			if(data.success){
				if (jQuery("#q-car-select").val()!=""){
					location.href = jQuery("#q-car-select").val();
				}else{
					location.href="/user/";
				}
			}else{
				alert(data.msg);
			}	
		});
	});
	
	
});	