jQuery(document).ready(function() {
	jQuery(window).load(function (e) {
		console.log(window.location.pathname);
	});	
	
	//Step 1
	jQuery("#login_form").on( "submit", function( event ) {
		event.preventDefault();
		var formData = jQuery( this ).serialize();
		console.log(formData);
		jQuery.post("/signin/", formData, function(data){
			data = jQuery.parseJSON(data);
			console.log(data);
			if(data.success){
				location.href="/user/";
			}else{
				alert(data.msg);
			}	
		});
	});
	
	
});	