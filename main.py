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
import Cookie

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.api import memcache

from models import AlbumConfig

def get_themelist():
    path = os.path.join(os.path.dirname(__file__),'themes')
    themes = os.listdir(path)
    for theme in themes:
        if not os.path.isdir(os.path.join(path,theme)):
            themes.remove(theme)
    return themes

def get_languagelist():
    path = os.path.join(os.path.dirname(__file__),'themes', AlbumConfig.get_config().theme,'lng')
    languages = os.listdir(path)    
    for language in languages:
        if os.path.isdir(os.path.join(path,language)):
            languages.remove(language)
    return languages

class MainHandler(webapp.RequestHandler):
    def get(self):
        #self.response.out.write(get_languagelist())
        cookie = Cookie.SimpleCookie()
        cookie["lng"] = "teset"
        self.response.out.write(cookie["lng"].value)

	current_theme = AlbumConfig.get_config().theme
'''
        self.response.out.write( \
"""
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
        <title>""" + AlbumConfig.get_config().title + """</title>
        <script type="text/javascript" language="JavaScript" src="static/jquery-1.5.min.js"></script>
        <script type="text/javascript" language="JavaScript" src="static/jquery.cookie.js"></script>
        <script type="text/javascript" language="JavaScript" src="static/jquery.xLazyLoader.js"></script>
        <script type="text/javascript" language="JavaScript" src="static/core.js"></script>
        <script type="text/javascript" language="JavaScript" src="themes/""" + current_theme + """/theme_main.js"></script>
	<script type="text/javascript" language="JavaScript" src="themes/""" + current_theme + """/lng/en-us.js"></script>
	<link type="text/css" rel="stylesheet" href="themes/""" + current_theme + """/css/theme.css" />
    </head>
    <body>
    </body>
</html>
""" )
'''  


def main():
    application = webapp.WSGIApplication([('/', MainHandler)],
                                         debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
