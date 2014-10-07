jQuery(document).ready(function() {
	jQuery(window).load(function (e) {
		console.log(window.location.pathname);
	});	
	
	jQuery('input[type=file]').on('change', function( event ) {
    	jQuery("#form_img" ).submit();
	});
	jQuery("#form_personal_info").on( "submit", function( event ) {
    	event.preventDefault(); // Totally stop stuff happening
		var formData = jQuery( this ).serialize();
		console.log(formData);
		jQuery.post("/user/update-personal-info", formData, function(data){
			data = jQuery.parseJSON(data);
			console.log(data);
			alert(data.msg);	
		});
		
	});
	
	jQuery("#form_credentials").on( "submit", function( event ) {
		event.preventDefault();
		var formData = jQuery( this ).serialize();
		//console.log(formData);
		//alert("Under Construction");
		
		jQuery.post("/user/update-password", formData, function(data){
			data = jQuery.parseJSON(data);
			console.log(data);
			alert(data.msg);	
		});
		
	});
	
	
	
});	