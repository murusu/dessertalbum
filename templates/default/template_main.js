// JavaScript Document
function open_menu(menu_id, button_id) {
	var_left = $("#" + button_id).offset().left;
	$("#" + menu_id).css("margin-left",var_left + "px");
	
	$("#" + menu_id).removeClass("disable");
	$('html').one('click',function(){
		$("#" + menu_id).addClass("disable");
	});	
}

function setup_str() {
	//$(".top_bar_left span").html("teT");
}

function init_fail() {
	
}

function init_theme(response) {	
	//alert(response.user_url);
	
	sign_text 	= response.user_name?layout_text["logout"]:layout_text["login"];
	sign_block 	= '<a href="' + response.user_url + '">' + sign_text + '</a>';

	language_block = '<a href="javascript:open_menu(\'top_bar_languagelist\', \'language_button\')" class="no_uline" id="language_button"><u>' + language_text[$.cookie(response.key + "_lng")] + '</u> <small>▼</small></a>';	
	language_list = '';
	$.each(response.language_list, function(i, n) {
		language_list += '<a href="javascript:change_language(\'' + response.key + '_lng' + '\',\'' + n + '\')">' + language_text[n] + '</a>';
	});
	
	manager_block = (response.is_admin == "true")?'<a href="javascript:open_menu(\'top_bar_managerlist\', \'manager_button\')" class="no_uline" id="manager_button"><u>' + layout_text["management"] + '</u> <small>▼</small></a> | ':'';
		
	$("body").html(
	 '<div class="top_bar">'
	+	'<div class="top_bar_left"><span>' + layout_text["top_page"] + '</span></div>'
	+	'<div class="top_bar_right">'
	+		'<span> ' + manager_block  + language_block + ' | ' + sign_block + '</span>'		
	+	'</div>'		
	+'</div>'
	+'<div class="dropdown_list disable" id="top_bar_languagelist">'
	+ 	language_list	
	+'</div>'
	+'<div class="dropdown_list disable" id="top_bar_managerlist">'
	+ 	'<a href="#">System setting</a>'
	+ 	'<a href="#">test2</a>'	
	+'</div>'
	+'<div class="main_block" id="album_list">fg<br/><br/><br/><br/><br/></div>'
	+'<div class="main_block disable" id="image_list">fg<br/><br/><br/><br/><br/></div>'
	+'<div class="main_block disable" id="image_show">fg<br/><br/><br/><br/><br/></div>'
	+'<div class="bottom_bar"><span>Powered by Dessert Album.</span></div>');
	
	//getInfo();
	setup_str();
	
	$(function(){
  		$(window).hashchange( function(){
    		var hash = location.hash;
    		//document.title = 'The hash is ' + ( hash.replace( /^#/, '' ) || 'blank' ) + '.';
    		//document.title = hash;
  		})
  		
  		$(window).hashchange();  
	});

}
