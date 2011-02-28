$(document).ready(function(){
	//init_lng();
	//init_theme();
	/*
	setTimeout(function() {
			//$("link").remove("[href*='static/static/test.css']"); 
			//$("head").append('<link type="text/css" rel="stylesheet" href="static/test2.css"/>');
			//alert("test");
			//$("#test_div").attr("class", "test_style2");
			$(".test_style").removeClass("test_style").addClass("test_style2");
		}, 
		5000); 
	*/
	//change_theme();
	/*
	var theme_name = $.cookie("theme")?$.cookie("theme"):"default";
	
	$.xLazyLoader({
		js: ['themes/' + theme_name + '/lng_list.js','themes/' + theme_name + '/theme_main.js'],
		css: ['themes/' + theme_name + '/css/theme.css'],
		name: theme_name,
		load: function(){
			//alert("document.getElementsByTagName("head")[0].innerHTML"test"");
			init_theme();
		}
	});
	*/
	//alert("test1");
	$.ajax({
   		type: "POST",
		cache: false,
		url: "/",
   		data: "action=init",
   		dataType: "json",
   		error: function(req, status, error) {
   			//$("body").html("test");
			//alert("tesT2");
			//alert(error);
   			init_fail();
   		},
  		success: function(json_data){
			//alert("start up");
     		init_theme(json_data);
     		///$("body").html("<div>" + error_info["invalid_response"] + "</div>");     		
   		}
	});
	
});

function add_album(name) {
	$.ajax({
   		type: "POST",
		cache: false,
		url: "/",
   		data: "action=add_album"
			+ "name=" + name,
   		dataType: "json",
   		error: function(req, status, error) {
   			//$("body").html("test");
			//alert("tesT2");
			//alert(error);
   			//init_fail();
			alert("add album fail");
   		},
  		success: function(json_data){
			//alert("start up");
     		//init_theme(json_data);
     		///$("body").html("<div>" + error_info["invalid_response"] + "</div>");     
			alert("add album success");
			alert(json_data);
   		}
	});
}
/*
function init_lng() {
	var lng = ($.cookie("lng")?$.cookie("lng"):(navigator.language?navigator.language:navigator.browserLanguage)).toLowerCase();

	var list_length  = lng_list.length;
	for(var i = 0; i < list_length; i++)
	{
		if(lng_list[i] == lng) return change_language(lng);
	}

	return change_language("en_us");
}

function init_theme() {
	var theme_name = $.cookie("theme")?$.cookie("theme"):"default";
	$.cookie("theme", theme_name);

	$("head").append('<script type="text/javascript" src="static/themes/' + theme_name + '/theme.js"></script>').ready(
		function(){
			setTimeout(
				function() {
					setup_page();
				}, 
			1);}
	) 
}



function setup_str() {
}
*/
function change_theme() {
	var theme_name = $.cookie("theme")?$.cookie("theme"):theme_list[0];
	$.cookie("theme", theme_name);
	
	$("script").remove("[src*='themes']"); 
	$("link").remove("[href*='themes']"); 
	
	$("head").append('<script type="text/javascript" src="themes/' + theme_name + '/theme_main.js"></script>').ready(function(){setTimeout(setup_page, 1);})
}

function change_language(key, lng_name) {
	if ($.cookie(key) != lng_name)
	{
		$.cookie(key, lng_name);
		window.location.reload();
	}
}

function init_lng(theme_name) {
	var lng = ($.cookie("lng")?$.cookie("lng"):(navigator.language?navigator.language:navigator.browserLanguage)).toLowerCase();

	var list_length  = lng_list.length;
	for(var i = 0; i < list_length; i++)
	{
		if(lng_list[i] == lng) return change_language(theme_name, lng);
	}

	return change_language(theme_name, lng_list[0]);
}
