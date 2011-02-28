// JavaScript Document
function open_menu(menu_id, button_id) {
	var_left = $("#" + button_id).offset().left - 5;
	$("#" + menu_id).css("margin-left",var_left + "px");
	
	$("#" + menu_id).removeClass("disable");
	$('html').one('click',function(){
		$("#" + menu_id).addClass("disable");
	});	
}

function switch_adminmode(flag) {
	if (flag)
	{
		if (!$(".admin_menu").html())
		{
			manager_block = '<span class="admin_menu"><a href="javascript:open_menu(\'top_bar_managerlist\', \'manager_button\')" class="no_uline" id="manager_button"><u>' + layout_text["management"] + '</u> <small>▼</small></a> | </span>';	
			$(".top_bar_right span").prepend(manager_block);
		}
		else
		{
			$(".admin_menu").removeClass("disable");
		}
		
		$("#admin_button").html("Common Mode");
		$("#admin_button").attr("href","javascript:switch_adminmode(0)");
	}
	else
	{
		$(".admin_menu").addClass("disable");
		$("#admin_button").html("Admin Mode");
		$("#admin_button").attr("href","javascript:switch_adminmode(1)");
	}	
}

function setup_str() {
	//$(".top_bar_left span").html("teT");
}

function init_fail() {
	
}

function init_theme(response) {		
	sign_text 	= response.user_name?layout_text["logout"]:layout_text["login"];
	sign_block 	= '<a href="' + response.user_url + '">' + sign_text + '</a>';

	language_block = '<a href="javascript:open_menu(\'top_bar_languagelist\', \'language_button\')" class="no_uline" id="language_button"><u>' + language_text[$.cookie(response.key + "_lng")] + '</u> <small>▼</small></a>';	
	language_list = '';
	$.each(response.language_list, function(i, n) {
		language_list += '<a href="javascript:change_language(\'' + response.key + '_lng' + '\',\'' + n + '\')">' + language_text[n] + '</a>';
	});
	
	manager_mode = (response.is_admin == "true")?'<a href="javascript:switch_adminmode(1)" class="link_button" id="admin_button">Admin Mode</a> | ':'';
		
	$("body").html(
	 '<div class="top_bar">'
	+	'<div class="top_bar_left"><span>' + layout_text["top_page"] + '</span></div>'
	+	'<div class="top_bar_right">'
	+		'<span> ' + manager_mode  + language_block + ' | ' + sign_block + '</span>'		
	+	'</div>'		
	+'</div>'
	+'<div class="dropdown_list disable" id="top_bar_languagelist">'
	+ 	language_list	
	+'</div>'
	+'<div class="dropdown_list disable" id="top_bar_managerlist">'
	+ 	'<a href="javascript:add_album(\'' + layout_text["new_album"] + '\')">Add New Album</a>'
	+ 	'<a href="#">System Config</a>'	
	+'</div>'
	+'<div class="main_block" id="album_list">fg<br/><br/><br/><br/><br/></div>'
	+'<div class="main_block disable" id="image_list">fg<br/><br/><br/><br/><br/></div>'
	+'<div class="main_block disable" id="image_show">fg<br/><br/><br/><br/><br/></div>'
	+'<div class="bottom_bar"><span>Powered by Dessert Album.</span></div>');
	//setup_str();
	
	$(function(){
  		$(window).hashchange( function(){
    		var hash = location.hash;
    		//document.title = 'The hash is ' + ( hash.replace( /^#/, '' ) || 'blank' ) + '.';
    		//document.title = hash;
  		})
  		
  		$(window).hashchange();  
	});
}
