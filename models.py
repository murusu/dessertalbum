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

from google.appengine.ext import db
from google.appengine.api import memcache

class AlbumConfig(db.Model):
  title 	    = db.StringProperty(required=True)
  template 	    = db.StringProperty(required=True)
  anti_leech 	= db.BooleanProperty(required=True, default=False)  
  list_type	    = db.StringProperty(required=True, choices=set(["black_list", "white_list"]))
  list_content 	= db.StringProperty()

  @classmethod
  def get_config(cls):
  	  config = memcache.get("config")
	  
	  if config is None:
	  	config = AlbumConfig.get_by_key_name('1')		
		if config is None:
			config = AlbumConfig(key_name='1', title='My Albums', template='default', anti_leech=False, list_type='black_list')
			config.put()
			
		memcache.add("config", config, 60*60*24*30) 
		
	  return config
  

class Album(db.Model):
  name 			    = db.StringProperty(required=True) 
  update_time 		= db.DateTimeProperty(auto_now=True)
  list_type 		= db.StringProperty(required=True, choices=set(["black_list", "white_list"]))
  list_content 		= db.StringProperty()
  access_type 		= db.StringProperty(required=True, choices=set(["pubilc", "share", "private"]))
  access_password 	= db.StringProperty()
  description 		= db.StringProperty()
  cover_thumbnail 	= db.StringProperty()
  image_number      = db.IntegerProperty(required=True)
  
  
