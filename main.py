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
from google.appengine.ext.webapp import util
from google.appengine.api import memcache

from models import AlbumConfig

def get_templatelist():
    path        = os.path.join(os.path.dirname(__file__),'templates')
    templates   = os.listdir(path)
    for template in templates:
        if not os.path.isdir(os.path.join(path,template)):
            templates.remove(template)
    return templates

def get_languagelist():
    path            = os.path.join(os.path.dirname(__file__),'templates', AlbumConfig.get_config().template,'lng')
    dir_list        = os.listdir(path)
    language_list   = []
    for dir_name in dir_list:
        if not os.path.isdir(os.path.join(path,dir_name)):
            language_list.append(dir_name[:-3])            
    return language_list

class MainHandler(webapp.RequestHandler):
    def get(self):
        config          = AlbumConfig.get_config()
        language_list   = get_languagelist()
        
        cookie_lng = self.request.cookies.get(config.key().__str__() + '_lng')
        accept_lng = self.request.accept_language
        select_lng = "en-us"
        
        for lng in language_list:
            if cookie_lng:
                if lng in cookie_lng:
                    select_lng = lng
            if accept_lng:
                if lng in accept_lng:
                    select_lng = lng
        
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
        <script type="text/javascript" language="JavaScript" src="static/core.js"></script>
        <script type="text/javascript" language="JavaScript" src="templates/""" + config.template + """/template_main.js"></script>
	<script type="text/javascript" language="JavaScript" src="templates/""" + config.template + """/lng/""" + select_lng + """.js"></script>
	<link type="text/css" rel="stylesheet" href="templates/""" + config.template + """/css/template.css" />
    </head>
    <body>
    </body>
</html>
""" )


def main():
    application = webapp.WSGIApplication([('/', MainHandler)],
                                         debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
