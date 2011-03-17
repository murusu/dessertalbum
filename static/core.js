$(document).ready(function(){
	$.ajax({
   		type: "POST",
		cache: false,
		url: "/",
   		data: "action=init",
   		dataType: "json",
   		error: function(req, status, error) {
   			//init_fail();
   			
   			error_handler(req, status, error);
   		},
  		success: function(json_data){
     		init_theme(json_data);   		
   		}
	});
	
});

function get_albumlist() {
	call_back	= arguments[0];	
	sort_type 	= arguments[1]?arguments[1]:"create"; 
	order 		= arguments[2]?arguments[2]:"descend"; 
	start 		= arguments[3]?arguments[3]:0; 
	limit 		= arguments[4]?arguments[4]:1000;
	
	if(!call_back)
	{
		return;
	}
	
	$.ajax({
		type: "POST",
		cache: false,
		url: "/",
		data: "action=get_albumlist"
			+ "&sort=" + sort_type
			+ "&order=" + order
			+ "&start=" + start
			+ "&limit=" + limit,
		dataType: "json",
		error: function(req, status, error) {
			//alert("get album list fail");
			error_handler(req, status, error);
   		},
   		success: function(json_data){
			call_back(json_data);
   		}
	})
}

function add_album(name) {
	$.ajax({
   		type: "POST",
		cache: false,
		url: "/",
   		data: "action=add_album"
			+ "&name=" + name,
   		dataType: "json",
   		error: function(req, status, error) {
			//alert("add album fail");
			error_handler(req, status, error);
   		},
  		success: function(json_data){
			//alert("add album success");
			show_newalbum(json_data);
   		}
	});
}

function get_album() {
	call_back	= arguments[0];
	id 			= arguments[1]?arguments[1]:""; 
	password 	= arguments[2]?arguments[2]:""; 
	sort_type 	= arguments[3]?arguments[3]:"create"; 
	order 		= arguments[4]?arguments[4]:"descend"; 
	start 		= arguments[5]?arguments[5]:0; 
	limit 		= arguments[6]?arguments[6]:1000;

	$.ajax({
   		type: "POST",
		cache: false,
		url: "/",
   		data: "action=get_album"
			+ "&id=" + id
			+ "&pass=" + password
			+ "&sort=" + sort_type
			+ "&order=" + order
			+ "&start=" + start
			+ "&limit=" + limit,
   		dataType: "json",
   		error: function(req, status, error) {
			//alert("get album fail");
			error_handler(req, status, error);
   		},
  		success: function(json_data){
			//alert("get album success");
			//show_newalbum(json_data);
			//show_image_list(json_data);
			call_back(json_data);	
			//alert(add_album);		
			//show_image_list(json_data);		
			
			//add_album("7856");
   		}
	});
}

function get_image() {
	alert("get_image");
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
/*
function change_theme() {
	var theme_name = $.cookie("theme")?$.cookie("theme"):theme_list[0];
	$.cookie("theme", theme_name);
	
	$("script").remove("[src*='themes']"); 
	$("link").remove("[href*='themes']"); 
	
	$("head").append('<script type="text/javascript" src="themes/' + theme_name + '/theme_main.js"></script>').ready(function(){setTimeout(setup_page, 1);})
}
*/
function change_language(key, lng_name) {
	if ($.cookie(key) != lng_name)
	{
		$.cookie(key, lng_name);
		window.location.reload();
	}
}
/*
function init_lng(theme_name) {
	var lng = ($.cookie("lng")?$.cookie("lng"):(navigator.language?navigator.language:navigator.browserLanguage)).toLowerCase();

	var list_length  = lng_list.length;
	for(var i = 0; i < list_length; i++)
	{
		if(lng_list[i] == lng) return change_language(theme_name, lng);
	}

	return change_language(theme_name, lng_list[0]);
}
*/