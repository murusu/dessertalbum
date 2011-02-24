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
	init_theme();
});
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

function change_language(theme_name, lng_name) {			
	$.cookie("lng", lng_name);		   
	$("script").remove("[src*='themes/" + theme_name + "/lng']"); 	

	$("head").append('<script type="text/javascript" src="themes/" + theme_name + "/lng/' + lng_name + '.js"></script>').ready(function(){setTimeout(setup_str, 1);});
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
