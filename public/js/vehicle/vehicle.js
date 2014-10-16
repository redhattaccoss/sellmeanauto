jQuery(document).ready(function() {
	jQuery(window).load(function (e) {
		//console.log(window.location.pathname);
		getStyleDetailsById();
	});
	
	
	jQuery(".summary-page").on("click", function(e) {
		e.preventDefault();												 
		proceedToSummaryPage();
	});
	
	jQuery(".proceed_to").on("click", function(e) {
	    e.preventDefault();
		var proceed_to = jQuery(this).attr("data-proceed");
		//console.log(proceed_to);
		jQuery("#proceed_btn").attr("href", "#"+proceed_to);
		jQuery("#proceed_btn").html("<span>Proceed to</span> "+proceed_to)
		
	});
	jQuery("#proceed_btn").on("click", function(e) {
		e.preventDefault();
		var proceed_to = jQuery("#nav-tabs li.active").children('a').eq(0).attr("data-proceed");
		jQuery("#proceed_btn").attr("href", "#"+proceed_to);
		//jQuery("#proceed_btn").html("<span>Proceed to</span> "+proceed_to)
		
		
		
		var lookup = jQuery(this).attr("href");
		//var obj = jQuery(this);	
		//console.log(lookup);
		if(lookup != '#Summary'){	
			jQuery("#nav-tabs li a").each(function( index ) {													   
				jQuery("a").parent("li").removeClass("active");
				if(lookup == jQuery(this).attr("href") ){
					jQuery(this).parent("li").addClass("active");
					
					var proceed_to = jQuery(this).attr("data-proceed");
					//console.log(proceed_to);
					//jQuery("#proceed_btn").attr("href", "#"+proceed_to);
					jQuery("#proceed_btn").html("<span>Proceed to</span> "+proceed_to)
					return false;
				}
				
			});
		}else{
			proceedToSummaryPage()
		}
	});
	
	
	
	jQuery("#form-style").on( "submit", function( event ) {
		event.preventDefault();
		var formData = jQuery( this ).serialize();
		console.log(formData);
		jQuery.post("/vehicle/process-vehicle-options", formData, function(data){
			data = jQuery.parseJSON(data);
			if(data.success){
				location.href="/vehicle/summary/"+data.style_id;
			}else{
				alert("There's a problem in processing vehicle options.");
			}
		});
	});
	
	
	
	
	
});	

jQuery(function ($) {
	var $active = $('#accordion .panel-collapse.in').prev().addClass('active');
	$active.find('a').prepend('<i class="glyphicon glyphicon-minus"></i>');
	$('#accordion .panel-heading').not($active).find('a').prepend('<i class="glyphicon glyphicon-plus"></i>');
	$('#accordion').on('show.bs.collapse', function (e) {
		$('#accordion .panel-heading.active').removeClass('active').find('.glyphicon').toggleClass('glyphicon-plus glyphicon-minus');
		$(e.target).prev().addClass('active').find('.glyphicon').toggleClass('glyphicon-plus glyphicon-minus');
	})
});
function proceedToSummaryPage(){
	//console.log("proceed to summary page.");
	jQuery("#form-style" ).submit();
}
function getStyleDetailsById(){
	var style_id = jQuery('#style_id').val();
	//console.log(style_id);
	var url = BASE_URL + "vehicle/v2/styles/" + style_id + "?view=full&fmt=json&api_key=" + API_KEY;
	jQuery.ajax({
		url : url,
		type : "GET",
		dataType : 'json',
		success : function(response) {
			//console.log(response);
			jQuery(".car_name").html(response.make.name+' '+response.model.name);
			jQuery("#car_make").val(response.make.niceName);
			jQuery("#baseMSRP").html("$"+response.price.baseMSRP);
			jQuery("#baseInvoice").html("$"+response.price.baseInvoice);
			jQuery("#mpg").html(response.MPG.city+"/"+response.MPG.highway+" <span>City/Hwy</span>");
			//console.log(response.MPG.city+"/"+response.MPG.highway+" <span>City/Hwy</span>");
			jQuery("#horsepower").html(response.engine.horsepower);
			jQuery("#numOfDoors").html(response.numOfDoors);
			

			var src = jQuery("#transmission-template").html();
			var template = Handlebars.compile(src);
			jQuery("#transmission").html(template(response));
			
			var src = jQuery("#car-year-template").html();
			var template = Handlebars.compile(src);
			jQuery("#car-year").html(template(response));
			
			//Exterior
			var output=""
			var src = jQuery("#exterior-options-template").html();
			var template = Handlebars.compile(src);
			jQuery.each(response.options, function(i, item) {
				if(item.category == "Exterior"){
					jQuery.each(item.options, function(k, v) {
						output += template(v);							   
						//console.log(v);
					});															   
				}
			});											  
			jQuery("#exterior-options tbody").html(output);
			
			//Interior
			var output=""
			var src = jQuery("#interior-options-template").html();
			var template = Handlebars.compile(src);
			jQuery.each(response.options, function(i, item) {
				if(item.category == "Interior"){
					jQuery.each(item.options, function(k, v) {
						output += template(v);							   
						//console.log(v);
					});															   
				}
			});											  
			jQuery("#interior-options tbody").html(output);
			
			
			
			var output=""
			var src = jQuery("#color-box-template").html();
			var template = Handlebars.compile(src);
			jQuery.each(response.colors, function(i, item) {
				if(item.category == "Exterior"){
					jQuery.each(item.options, function(k, v) {
						output += template(v);							   
						//console.log(v);
					});															   
				}
			});	
			jQuery("#color-box").html(output);
			
			var output=""
			var src = jQuery("#interior-color-template").html();
			var template = Handlebars.compile(src);
			jQuery.each(response.colors, function(i, item) {
				if(item.category == "Interior"){
					jQuery.each(item.options, function(k, v) {
						output += template(v);							   
					});															   
				}
			});	
			var h= "<tr><td colspan=2 class='interior-color-options'>Color Options</td></tr>"
			jQuery("#interior-options tbody").append(h + output);
			
			jQuery(".color-con").on("click", function(e) {
				jQuery(".color-con").removeClass("selected_color");
				var color_id = jQuery(this).attr("data-value");
				jQuery(this).addClass("selected_color");
				console.log(color_id);
				jQuery("#color_id").val(color_id);
			});
			
			load_profile_image();
		},
		error : function(response) {
			getStyleDetailsById();
		}
	});
	
}


function load_profile_image() {
	var style_id = jQuery('#style_id').val();
	var image_api = BASE_URL_V1 + "vehiclephoto/service/findphotosbystyleid?styleId=" + style_id + "&fmt=json&api_key=" + API_KEY;
	var image_photo_small = "";
	jQuery.ajax({
		url : image_api,
		type : "GET",
		dataType : 'json',
		success : function(response_image) {
			//console.log(response_image);
			
			jQuery.each(response_image, function(j, image) {
				if(image.shotTypeAbbreviation == "FQ") {				
					jQuery.each(image.photoSrcs, function(k, photo) {
						if(photo.indexOf("_600.jpg") > -1) {
							image_photo_small = photo;
							//console.log(image_photo_small);
							jQuery("#car_main_image").attr("src", MEDIA + image_photo_small).width("500");
							return false;
						}
					})
					return false;
				}
				//console.log(image_photo_small);
				//jQuery("#car_main_image").attr("src", MEDIA + image_photo_small).width("400");
			});
			getEquipmentDetailsByStyleId();
		},
		error : function() {
			load_profile_image()
		}
	});

}


function getEquipmentDetailsByStyleId(){
	var style_id = jQuery('#style_id').val();
	var url = BASE_URL + "vehicle/v2/styles/" + style_id + "/equipment?availability=standard&equipmentType=OTHER&fmt=json&api_key=" + API_KEY;
	jQuery.ajax({
		url : url,
		type : "GET",
		dataType : 'json',
		success : function(response) {
			var numOfSeats=0;
			jQuery.each(response.equipment, function(j, equipment) {
				if(equipment.name == "Seating Configuration") {									
					jQuery.each(equipment.attributes, function(k, v) {
						numOfSeats = parseInt(numOfSeats) + parseInt(v['value']);
					})
					return false;
				}				
			});
			
			var output=""
			var src = jQuery("#accessories-options-template").html();
			var template = Handlebars.compile(src);
			
			//jQuery.each(response.equipment, function(j, equipment) {
			//	output += template(equipment);													 
			//});
			//console.log(response.equipment);
			jQuery("#accessories-options tbody").html(template(response) );

			jQuery("#numOfSeats").html(numOfSeats);
			getDealershipCount();
		},
		error : function(response) {
			getEquipmentDetailsByStyleId()
		}
	});
	
	
	
	
	
}


function getDealershipCount(){
	var make = jQuery("#car_make").val();
	var zipcode = jQuery("#zipcode").val();
	var url = BASE_URL + "dealer/v2/dealers/count?zipcode="+ zipcode +"&radius=100&make="+ make +"&state=new&api_key=" + API_KEY;
	jQuery.ajax({
		url : url,
		type : "GET",
		dataType : 'json',
		success : function(response) {
			jQuery("#dealersCount").html(response.dealersCount);
			newtotalcashpricebystyleidandzip();
		},
		error : function(response) {
			getDealershipCount();
		}
	});	
}


function newtotalcashpricebystyleidandzip(){
	var style_id = jQuery('#style_id').val();
	var zipcode = jQuery("#zipcode").val();
	//https://api.edmunds.com/v1/api/tco/newtotalcashpricebystyleidandzip/200477465/90404?fmt=json&api_key=f95n2h2rf96b5vtybw6xat4z
	var url = BASE_URL_V1 + "tco/newtotalcashpricebystyleidandzip/"+ style_id +"/"+ zipcode +"?fmt=json&api_key=" + API_KEY;
	jQuery.ajax({
		url : url,
		type : "GET",
		dataType : 'json',
		success : function(response) {
			jQuery("#financing").html("$"+response.value);
		},
		error : function(response) {
			newtotalcashpricebystyleidandzip();
		}
	});	
}