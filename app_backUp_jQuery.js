$(document).ready(function($){

	var results = [];
	var counter = 0;
	
	$( "#searchClick" ).on( "click", function(e){

		e.preventDefault();
		results = [];
		counter = 0;
		$("#results").empty();

		var promised = searchWiki($('#searchField').val());

		promised.done(function(x){

			$.each(x.query.search, function(key, value){
				//console.log(value);
	  			results.push({
	  				'id': key,
	  				'pageid' : value.pageid,
	  				'title' : value.title,
	  				'snippet' : value.snippet,
	  				'pageURL' : 'https://en.wikipedia.org/?curid='+ value.pageid
	  			});

	  			//getImages(i);
	  			//getThumb(i);
	  		});
	  		console.log(results);
		})

	});


	function searchWiki(searchFor){	

		return $.ajax({
			url: '//en.wikipedia.org/w/api.php',
		  	data: {
			    action: 'query',
			    list: 'search',
			    srsearch: searchFor,
			    format: 'json',
			    formatversion: 2
		  	},
		  	dataType: 'jsonp',
		  	type: 'POST',
		    headers: { 'Api-User-Agent': 'eyMedia/1.0' }		
		});		

	}

	function getImages(index){		

		$.ajax({

  			type: "GET",
	        url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=images&titles="+results[index].title+"&format=json&callback=?",
	        contentType: "application/json; charset=utf-8",
	        async: false,
	        dataType: "json",
	        success: function (data, textStatus, jqXHR) {
	        	results[index].imageName = data.query.pages[results[index].pageid].images[0].title.substring(5);
	        	getImageURL(index)
	        },

  		});
	}

	function getImageURL(index){		

		$.ajax({

  			type: "GET",
	        url: "https://en.wikipedia.org/w/api.php?action=query&format=json&titles=Image:"+results[index].imageName+"&prop=imageinfo&iiprop=url&callback=?",
	        contentType: "application/json; charset=utf-8",
	        async: false,
	        dataType: "json",
	        success: function (data, textStatus, jqXHR) {
	        	results[index].imageURL = data.query.pages[Object.keys(data.query.pages)[0]].imageinfo[0].url;
	        	getThumb(index);
	        },

  		});
	}

	function getThumb(index){		

		$.ajax({

  			type: "GET",
	        url: "https://en.wikipedia.org/w/api.php?action=query&titles="+results[index].title+"&prop=pageimages&format=json&pithumbsize=200&callback=?",
	        contentType: "application/json; charset=utf-8",
	        async: false,
	        dataType: "json",
	        success: function (data, textStatus, jqXHR) {
	        	if(data.query.pages[results[index].pageid].thumbnail){
	        		results[index].imageThumb = data.query.pages[results[index].pageid].thumbnail.source;
	        	}else{
	        		results[index].imageThumb = '';
	        	}
	        	counter++;

	        },

  		});

	}

	$( document ).ajaxComplete(function() {
		if(counter === 10 ){
			populate();
		}
		
	});

	function populate(){

		for(var i =0; i<results.length; i++){

			var imageData = "";

			if(results[i].imageThumb !== ""){
				imageData = "<img class='card-img-top' src='"+results[i].imageThumb+"' alt='Card image cap'>";
			}else if (results[i].imageURL !== "" ){
				imageData = "<img class='card-img-top' src='"+results[i].imageURL+"' alt='Card image cap'>";
			}else{
				imageData = "<img class='card-img-top' src='https://en.wikipedia.org/wiki/Wikipedia#/media/File:Wikipedia-logo-v2.svg' alt='Card image cap'>";
			}
			

			$("#results").append(""+
				"<div class='col-3 mx-2 my-2'>"+
				"<div class='card' style='width: 18rem;'>"+imageData+
				"<div class='card-body'>"+
				"<h5 class='card-title'>"+results[i].title+"</h5>"+
				"<p class='card-text'>"+results[i].snippet+"</p>"+
				"<a href='"+results[i].pageURL+"' target='_blank' class='btn btn-primary'>Read More</a>"+
				"</div></div></div>");

		}

	}

});

