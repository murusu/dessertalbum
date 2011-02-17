// JavaScript Document
function setup_page() {
	/*
	$("head").append('<link type="text/css" rel="stylesheet" href="static/themes/default/css/theme.css" />').ready(
		function(){
			setTimeout(
				function() {
					alert("test");
				}, 
			1); 
		}
	)
	*/
	
	
	
	$("head").append('<script type="text/javascript" src="static/themes/default/lng/lng_list.js"></script>').ready(
		function(){
			setTimeout(
				function(){
					$("head").append('<link type="text/css" rel="stylesheet" href="static/themes/default/css/theme.css" />').ready(
						function(){
							setTimeout(
								function(){
									$("body").html('<div class="top_bar"><div class="top_bar_left">dfg</div><div class="top_bar_right">dfgh</div><div class="top_bar_bottom"></div></div><div class="main_block"></div><div class="bottom_bar"><div class="bottom_bar_top"></div><div class="bottom_bar_left">001</div><div class="bottom_bar_right">002</div></div>');
								},
							1);
						}
					);
					init_lng("default");
				}, 
				1
			);
	});
}

function setup_str() {
}


function init_theme() {	
	$("body").html(
	 '<div class="top_bar">'
	+	'<div class="top_bar_left"><span>Album list</span></div>'
	+	'<div class="top_bar_right"><span><a href="www.google.com" class="no_uline"><u>View setting</u> <small>▼</small></a> | <a href="www.google.com" class="no_uline"><u>Default theme</u> <small>▼</small></a> | <a href="www.google.com" class="no_uline"><u>English</u> <small>▼</small></a> | <a href="www.google.com">Sign in</a></span></div>'
	//+	'<div class="top_bar_bottom"></div>'
	+'</div>'
	+'<div class="main_block">fg<br/><br/><br/><br/><br/></div>'
	+'<div class="bottom_bar"><span>Powered by Dessert Album.</span></div>');
	
	//getInfo();
}
