jQuery(document).ready(function() {
	jQuery(window).load(function (e) {
		//console.log(window.location.pathname);
		getStyleDetailsById();		
	});
});	

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
			jQuery("#car_name").html(response.make.name+' '+response.model.name);
			jQuery("#car_make").val(response.make.niceName);
			jQuery("#baseMSRP").html("$"+response.price.baseMSRP);
			jQuery("#baseInvoice").html("$"+response.price.baseInvoice);
			jQuery("#mpg").html(response.MPG.city+"/"+response.MPG.highway+" <span>City/Hwy</span>");
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
			var src = jQuery("#exterior-options-template").html();
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
			
			load_profile_image();
		},
		error : function(response) {
			console.log(response);
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
			console.log("error");
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
						//console.log(v['value']);
					})
					return false;
				}
				
			});
			//console.log(numOfSeats);
			jQuery("#numOfSeats").html(numOfSeats);
			getDealershipCount();
		},
		error : function(response) {
			console.log(response);
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
			console.log(response);
		}
	});	
}


function newtotalcashpricebystyleidandzip(){
	var style_id = jQuery('#style_id').val();
	var zipcode = jQuery("#zipcode").val();
	var url = BASE_URL + "tco/newtotalcashpricebystyleidandzip/"+ style_id +"/"+ zipcode +"?fmt=json&api_key=" + API_KEY;
	jQuery.ajax({
		url : url,
		type : "GET",
		dataType : 'json',
		success : function(response) {
			jQuery("#financing").html(response.value);
			
		},
		error : function(response) {
			console.log(response);
		}
	});	
}