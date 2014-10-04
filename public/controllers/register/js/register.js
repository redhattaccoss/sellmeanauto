jQuery(document).ready(function() {
	jQuery(window).load(function (e) {
		console.log(window.location.pathname);
	});	
	
	//Step 1
	jQuery("#form_step1").on( "submit", function( event ) {
		event.preventDefault();
		
		var email = jQuery('#email').val();
		var password = jQuery('#password').val();
		var confirmpassword = jQuery('#confirmpassword').val();
		
		if(email == ""){
			alert("Plese enter your email address.");
			return false;
		}
		
		if(password == ""){
			alert("Plese enter your password.");
			return false;
		}
		
		if(password != confirmpassword){
			alert("Plese re-enter your password.");
			return false;
		}
		
		
		var formData = jQuery( this ).serialize();
		jQuery.post("/register/process-step1", formData, function(data){
			data = jQuery.parseJSON(data);
			console.log(data);
			if(data.success){
				location.href="/register/step2";
			}else{
				alert(data.msg);
			}	
		});		
	});
	
	//Step 2
	jQuery("#form_step2").on( "submit", function( event ) {
		event.preventDefault();
		var fname = jQuery('#fname').val();
		var lname = jQuery('#lname').val();

		
		if(fname == ""){
			alert("Plese type your first name.");
			return false;
		}
		
		if(lname == ""){
			alert("Plese type your lsst name.");
			return false;
		}
		
		
		var formData = jQuery( this ).serialize();
		//console.log(formData);
		jQuery.post("/register/process-step2", formData, function(data){
			data = jQuery.parseJSON(data);
			console.log(data);
			if(data.success){
				location.href="/register/step3";
			}else{
				alert(data.msg);
			}	
		});
		
	});
	
	
	//Step 3
	jQuery("#form_step3").on( "submit", function( event ) {
		event.preventDefault();
		var formData = jQuery( this ).serialize();
		//console.log(formData);
		
		jQuery.post("/register/process-step3", formData, function(data){
			data = jQuery.parseJSON(data);
			console.log(data);
			if(data.success){
				location.href="/register/thankyou";
			}else{
				alert(data.msg);
			}	
		});
		
	});
	
	
	
	
});	