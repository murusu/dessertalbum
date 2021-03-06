#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import os
import datetime

from google.appengine.ext import webapp
from google.appengine.api import users
from google.appengine.ext.webapp import util
from google.appengine.api import memcache

from models import AlbumConfig, Album, Thumbnail, Image, ImageBF

def get_templatelist():
    path        = os.path.join(os.path.dirname(__file__),'templates')
    templates   = os.listdir(path)
    for template in templates:
        if not os.path.isdir(os.path.join(path,template)):
            templates.remove(template)
    return templates

def get_languagelist():
    path            = os.path.join(os.path.dirname(__file__),'templates', AlbumConfig.get_object().template,'lng')
    dir_list        = os.listdir(path)
    language_list   = []
    for dir_name in dir_list:
        if not os.path.isdir(os.path.join(path,dir_name)):
            language_list.append(dir_name[:-3])            
    return language_list

def init_album(handler):
    #handler.response.out.write('test')    
    is_admin = "false"
    if users.is_current_user_admin():
        is_admin = "true"
    
    user_url = ""
    user_name = ""
    if users.get_current_user():
        user_url = users.create_logout_url("/")
        user_name = users.get_current_user().nickname()
    else:
        user_url = users.create_login_url("/")
    
    language_json = ""    
    language_list = get_languagelist()
    for language in language_list:
        if language_json:
            language_json = language_json + ',"' + language + '"'
        else:
            language_json = '"' + language + '"'
    language_json = "[" + language_json + "]"
    
    config = AlbumConfig.get_object()
    
    handler.response.out.write('{"key":"' + config.key().__str__() + '","template":"' + config.template + '","is_admin":"' + is_admin  + '","user_url":"' + user_url  + '","user_name":"' + user_name + '","language_list":' + language_json + '}') 
    
def get_albumlist(handler):
    order = ""
    if handler.request.get("sort") == "update":
        order = "update_time"
    elif handler.request.get("sort") == "create":
        order = "create_time"
    else:
        order = "name"

    if handler.request.get("order") == "descend":
        order = "-" + order
        
    limit = handler.request.get("limit", default_value="1000")
    start = handler.request.get("start", default_value="0")
        
    handler.response.out.write(Album.get_list(order, limit, start))
    
def get_album(handler):
    id          = handler.request.get("id")
    password    = handler.request.get("pass")
    
    if not id:
        handler.response.out.write('{"error":"invaild_call"}')
        return
    
    album = Album.get_object(id)
    
    if not album:
        handler.response.out.write('{"error":"invaild_call"}')
        return
    
    if album.access_type == "share" and not password == album.access_password:
        handler.response.out.write('{"error":"access_denied"}')
        return
    
    if album.access_type == "private" and not users.is_current_user_admin():
        handler.response.out.write('{"error":"access_denied"}')
        return
    
    order = ""
    if handler.request.get("sort") == "create":
        order = "create_time"
    else:
        order = "name"

    if handler.request.get("order") == "descend":
        order = "-" + order

    limit = handler.request.get("limit", default_value="1000")
    start = handler.request.get("start", default_value="0")
    
    image_list = Album.get_image_list(id, order, limit, start)
            
    handler.response.out.write('{"album_id":"' + str(album.id) + '","album_name":"' + album.name + '","image_list":' + image_list + '}')
    
def add_album(handler):
    if not users.is_current_user_admin():
        handler.response.out.write('{"error":"access_denied"}');
        return
    '''
    album = Album(name= handler.request.get("name", default_value="New Album"), list_type='black_list', access_type='public',image_number=0)
    album.put()
    memcache.set("album_" + str(album.key().id()), album, 60*60*24*30)
    memcache.set("album_updatetime", datetime.datetime.utcnow(), 60*60*24*30)
    '''
    album = Album.add_object(handler.request.get("name", default_value="New Album"))    
    handler.response.out.write('{"id":"' + str(album.id) + '","name":"' + album.name + '"}');

class MainHandler(webapp.RequestHandler):
    def get(self):
        config          = AlbumConfig.get_object()
        language_list   = get_languagelist()
        
        cookie_lng = self.request.cookies.get(config.key().__str__() + '_lng')
        accept_lng = self.request.accept_language
        cookie_flag = "";
        accept_flag = "";
        
        for lng in language_list:
            if accept_lng:
                if lng in accept_lng:
                    accept_flag = lng;
            if cookie_lng:
                if lng in cookie_lng:
                    cookie_flag = lng;
        
        select_lng = "en-us"            
        if cookie_flag:
            select_lng = cookie_flag
        elif accept_flag:    
            select_lng = accept_flag       
        
        max_age = 60 * 60 * 24 * 30
        expires = datetime.datetime.strftime(datetime.datetime.utcnow() +  datetime.timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
        self.response.headers.add_header("Set-Cookie", config.key().__str__() + "_lng=" + select_lng + "; expires=" + expires + "; max_age=" + str(max_age))   

        self.response.out.write( \
"""
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
        <title>""" + config.title + """</title>
        <script type="text/javascript" language="JavaScript" src="static/jquery-1.5.min.js"></script>
        <script type="text/javascript" language="JavaScript" src="static/jquery.cookie.js"></script>
        <script type="text/javascript" language="JavaScript" src="static/jquery.xLazyLoader.js"></script>
        <script type="text/javascript" language="JavaScript" src="static/jquery.ba-hashchange.min.js"></script>
        <script type="text/javascript" language="JavaScript" src="static/core.js"></script>
        <script type="text/javascript" language="JavaScript" src="templates/""" + config.template + """/template_main.js"></script>
	<script type="text/javascript" language="JavaScript" src="templates/""" + config.template + """/lng/""" + select_lng + """.js"></script>
	<link type="text/css" rel="stylesheet" href="templates/""" + config.template + """/css/template.css" />
    </head>
    <body>
    </body>
</html>
""" )
        
    def post(self):
        #self.response.out.write('test')        
        action = self.request.get("action", default_value="init")        
        actions = { 
           'init': lambda:init_album(self), 
           'get_albumlist': lambda:get_albumlist(self), 
           'add_album': lambda:add_album(self),
           'get_album': lambda:get_album(self)
        }        
        actions.get(action, 'init')()
        


def main():
    application = webapp.WSGIApplication([('/', MainHandler)],
                                         debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
