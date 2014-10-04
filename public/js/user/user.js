jQuery(document).ready(function() {
	jQuery(window).load(function (e) {
		console.log(window.location.pathname);
	});	
	
	jQuery("#form_personal_info").on( "submit", function( event ) {
		event.preventDefault();
		var formData = jQuery( this ).serialize();
		console.log(formData);
		alert("Under Construction");
		/*
		jQuery.post("/signin/", formData, function(data){
			data = jQuery.parseJSON(data);
			console.log(data);
			if(data.success){
				location.href="/user/";
			}else{
				alert(data.msg);
			}	
		});
		*/
	});
	
	jQuery("#form_credentials").on( "submit", function( event ) {
		event.preventDefault();
		var formData = jQuery( this ).serialize();
		console.log(formData);
		alert("Under Construction");
		/*
		jQuery.post("/signin/", formData, function(data){
			data = jQuery.parseJSON(data);
			console.log(data);
			if(data.success){
				location.href="/user/";
			}else{
				alert(data.msg);
			}	
		});
		*/
	});
	
	
	
});	