//Global variables initialized
var imageCount = 0;
var arrOfResults = [];
var imagePresent = false; 
var imageUrlFound= false;

$(function() {
  //Initialize ZAFClient
  var client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '100%' });
  
  //Get image path from zendesk ticket fields (4nos)
  client.get('ticket.customField:custom_field_114101729171').then(
	function(data) {	
	imageCount++;	
		if(data['ticket.customField:custom_field_114101729171']!="" && data['ticket.customField:custom_field_114101729171']!=null){			
			var imagePath = data['ticket.customField:custom_field_114101729171'];
			imageUrlFound = true;
			if(imagePath != null){
				var indexOne  = imagePath.indexOf("/o/");
				var indexTwo  = imagePath.indexOf("?generation");
				var imageName  = imagePath.substring(indexOne+3,indexTwo);
				showImageData(imageName,client);		
			}
		}
	}
  ); 
  
  client.get('ticket.customField:custom_field_114101655912').then(
	function(data) {
	imageCount++;		
		if(data['ticket.customField:custom_field_114101655912']!="" && data['ticket.customField:custom_field_114101655912']!=null){			
			var imagePath = data['ticket.customField:custom_field_114101655912'];
			imageUrlFound = true;
			if(imagePath != null){
				var indexOne  = imagePath.indexOf("/o/");
				var indexTwo  = imagePath.indexOf("?generation");
				var imageName = imagePath.substring(indexOne+3,indexTwo);
				showImageData(imageName,client);	
			}			
		}
	}
  );  
  
  client.get('ticket.customField:custom_field_114101729331').then(
	function(data) {	
	imageCount++;	
		if(data['ticket.customField:custom_field_114101729331']!="" && data['ticket.customField:custom_field_114101729331']!=null){			
			var imagePath = data['ticket.customField:custom_field_114101729331'];
			imageUrlFound = true;
			if(imagePath != null){
				var indexOne  = imagePath.indexOf("/o/");
				var indexTwo  = imagePath.indexOf("?generation");
				var imageName  = imagePath.substring(indexOne+3,indexTwo);
				showImageData(imageName,client);			
			}
		}
	}
  ); 
  
  client.get('ticket.customField:custom_field_114101655952').then(
	function(data) {	
	imageCount++;	
		if(data['ticket.customField:custom_field_114101655952']!="" && data['ticket.customField:custom_field_114101655952']!=null){			
			var imagePath = data['ticket.customField:custom_field_114101655952'];
			imageUrlFound = true;
			if(imagePath != null){
				var indexOne  = imagePath.indexOf("/o/");
				var indexTwo  = imagePath.indexOf("?generation");
				var imageName  = imagePath.substring(indexOne+3,indexTwo);
				showImageData(imageName,client);			
			}
		}
	}
  );
  
if(!imageUrlFound){
	  setTimeout(function(){sendData("",""); }, 3000);
  }
  
  
//	Open image in a modal window on click of individual images  
$(document).on('click',"#pop0" ,function(){
	var img = $(this).find("img");
    var imageSrc = img.first().attr("src");
	localStorage.setItem('imageSrc', imageSrc);
	
	client.invoke('instances.create', {
          location: 'modal',
          url: 'assets/modal.html'
    });
});

$(document).on('click',"#pop1" ,function(){
	var img = $(this).find("img");
    var imageSrc = img.first().attr("src");
	localStorage.setItem('imageSrc', imageSrc);	
	client.invoke('instances.create', {
          location: 'modal',
          url: 'assets/modal.html'
    });
});

$(document).on('click',"#pop2" ,function(){
    var img = $(this).find("img");
    var imageSrc = img.first().attr("src");
	localStorage.setItem('imageSrc', imageSrc);
	
	client.invoke('instances.create', {
          location: 'modal',
          url: 'assets/modal.html'
    });
});

$(document).on('click',"#pop3" ,function(){
    var img = $(this).find("img");
    var imageSrc = img.first().attr("src");
	localStorage.setItem('imageSrc', imageSrc);
	
	client.invoke('instances.create', {
          location: 'modal',
          url: 'assets/modal.html'
    });
});
  
});

//Methof which actuay calls the vision API
function showImageData(imageName, client){
	var parameters = {
	  "requests": [
		{
		  "image": {
			"source": {
			  "gcsImageUri": "gs://artifacts-image/" + imageName
			}
		  },
		  "features": [
        {
          "type": "WEB_DETECTION"
        }/*,
        {
          "type": "TEXT_DETECTION"
        }*/
      ]
		}
	  ]
	}
	var settings = {
		url: 'https://vision.googleapis.com/v1/images:annotate?key=YOURAPIKEY',
		data: JSON.stringify(parameters),
		type: 'POST',
		contentType: 'application/json'
	};
	client.request(settings).then(
		function(response) {
			sendData(response, imageName);
		}
	)
}
//Method return back the data to the iframe.html
function sendData(data, imageName){
	if(data=="" && imageName==""){
		var requester_data = {
			'arrOfResults' : arrOfResults
		};		
		var source = $("#requester-template").html();
		var template = Handlebars.compile(source);
		var html = template(requester_data);
		$("#content").html(html);
	}else{
	var isHighRisk= false, isMediumRisk= false;isLowRisk= false;
	
	if(data.responses[0].webDetection.fullMatchingImages!=null && data.responses[0].webDetection.fullMatchingImages !="undefined"){
		if(data.responses[0].webDetection.fullMatchingImages.length>0){
			isHighRisk = true;
		}
	}
	else if(data.responses[0].webDetection.partialMatchingImages!=null && data.responses[0].webDetection.partialMatchingImages !="undefined"){
		if(data.responses[0].webDetection.partialMatchingImages.length>0){		
			isMediumRisk=  true;
		}
	}else{
		isLowRisk = true;
	}	
			
	var imagePath = "https://storage.googleapis.com/artifacts-image/" + imageName;
	
	var data = {
		'imagePath' : imagePath,
		'isHighRisk' :isHighRisk,
		'isMediumRisk': isMediumRisk,
		'isLowRisk' : isLowRisk
	};	
	arrOfResults.push(data);
	if(imageCount==4){
		var requester_data = {
			'arrOfResults' : arrOfResults
		};		
		var source = $("#requester-template").html();
		var template = Handlebars.compile(source);
		var html = template(requester_data);
		$("#content").html(html);
	}
}
}
