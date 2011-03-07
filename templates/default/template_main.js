// JavaScript Document
function error_handler(req, status, error) {
	alert("req=" + req + "<br/>status=" + status + "<br/>error=" + error);
}

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
		
		$("#admin_button").html("Admin Mode");
		$("#admin_button").attr("href","javascript:switch_adminmode(0)");
	}
	else
	{
		$(".admin_menu").addClass("disable");
		$("#admin_button").html("Common Mode");
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
	
	manager_mode = (response.is_admin == "true")?'<a href="javascript:switch_adminmode(1)" class="link_button" id="admin_button">Commond Mode</a> | ':'';
	//manager_mode = '<a href="javascript:switch_adminmode(1)" class="link_button" id="admin_button">Admin Mode</a> | ';	
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
	+'<div class="dropdown_list disable" id="image_admin_menu">'
	+ 	'<a href="javascript:show_uploadform()" id="add_image">Add New Image</a>'
	+ 	'<a href="#">System Config</a>'	
	+'</div>'
	+'<div class="main_block" id="album_list"></div>'
	+'<div class="main_block disable" id="image_list"></div>'
	+'<div class="main_block disable" id="image_show"></div>'
	+'<div style="clear:both; "></div>'
	+'<div class="bottom_bar"><span>Powered by Dessert Album.</span></div>');
	//setup_str();
	
	//get_albumlist(list_albums);
	
	$(function(){
  		$(window).hashchange( function(){
    		var hash 	= location.hash;    		
    		position 	= hash.substring(1,2);
    		id			= hash.substring(2);
    		    		
    		change_page(position, id);
  		})
  		
  		$(window).hashchange();  
	});
}

function change_page(page_code, id) {
	var div_name = "";
	
	switch(page_code)
	{
		case "a":
			div_name = "image_list";
			
    		if(!$("#image_list").html()) 
    		{
    			//alert("a");
    			get_album(show_image_list, id);
    		}
    		else
    		{
    			$("#image_show").empty();
    		}
    		break;
    				
    	case "i":
    		div_name = "image_show";
    		
    		if(!$("#image_show").html()) 
    		{
    			alert("i");
    		}
    		break;
    				
    	default:
    		div_name = "album_list";
    		
    		if(!$("#album_list").html()) 
    		{
    			get_albumlist(list_albums);
    		}
    		else
    		{
    			$("#image_list").empty();
    			$("#image_show").empty();
    		}
    		break;
	}
	
	$(".main_block").removeClass("disable");
	$(".main_block").addClass("disable");
	$("#" + div_name).removeClass("disable");
}

function list_albums(json_data) {	
	loading_icon = "./templates/default/images/loading.gif";
	albums_list = "";
	
	$.each(json_data, function(i, n) {
		thumbnail = n.cover_thumbnail;
		if (n.cover_thumbnail == "no_cover") thumbnail = "./templates/default/images/" + layout_text["no_cover"];
		if (n.cover_thumbnail == "password_protect") thumbnail = "./templates/default/images/" + layout_text["password_protect"];
		albums_list += '<div><a href="#a' + n.id + '" ><img src="' + thumbnail + '"/></a><span>' + n.name + '</span><span><div></div></span></div>';
	});
	
	//albums_list = '<ul class="albums_list">' + albums_list + '<li style="clear:both;height:1px;"></li></ul>';
	$("#album_list").append(albums_list);
}

function show_newalbum(json_data) {
	$("#album_list").prepend('<div><a href="javascript:get_album(\'' + json_data.id + '\')" ><img src="./templates/default/images/' + layout_text["no_cover"] + '"/></a><span>' + json_data.name + '</span><span>0</span></div>');
}

function show_image_list(json_data) {	
	loading_icon = "./templates/default/images/loading.gif";
	image_list = "";
	
	if(json_data.error) 
	{
		error_handler("test", "test2", json_data.error);
		return;
	}
	
	$.each(json_data.image_list, function(i, n) {
		//thumbnail = n.cover_thumbnail;
		//if (n.cover_thumbnail == "no_cover") thumbnail = "./templates/default/images/" + layout_text["no_cover"];
		//if (n.cover_thumbnail == "password_protect") thumbnail = "./templates/default/images/" + layout_text["password_protect"];
		image_list += '<div><a href="javascript:get_image(\'' + n.image_id + '\')" ><img src="./thumbnail/' + n.thumbnail_id + '"/></a></div>';
	});
	
	$("#manager_button").attr("href","javascript:open_menu('image_admin_menu', 'manager_button')");
	$(".top_bar_left span").html('<a href="#">' + layout_text["top_page"] + '</a> 》 ' + json_data.album_name);
}
