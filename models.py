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

import datetime

from google.appengine.ext import db
from google.appengine.api import users
from google.appengine.api import memcache

class AlbumConfig(db.Model):
  title 	    = db.StringProperty(required=True)
  template 	    = db.StringProperty(required=True)
  anti_leech 	= db.BooleanProperty(required=True, default=False)  
  list_type	    = db.StringProperty(required=True, choices=set(["black_list", "white_list"]))
  list_content 	= db.StringProperty()

  @classmethod
  def get_object(cls):
  	  config = memcache.get("config")
	  
	  if config is None:
	  	config = AlbumConfig.get_by_key_name('1')		
		if config is None:
			config = AlbumConfig(key_name='1', title='My Albums', template='default', anti_leech=False, list_type='black_list')
			config.put()
			
		memcache.set("config", config, 60*60*24*30) 
		
	  return config
  

class Album(db.Model):
  name 			    = db.StringProperty(required=True) 
  update_time 		= db.DateTimeProperty(auto_now=True)
  create_time       = db.DateTimeProperty(auto_now_add=True)
  list_type 		= db.StringProperty(required=True, choices=set(["black_list", "white_list"]))
  list_content 		= db.StringProperty()
  access_type 		= db.StringProperty(required=True, choices=set(["public", "share", "private"]))
  access_password 	= db.StringProperty()
  description 		= db.StringProperty()
  cover_thumbnail 	= db.StringProperty()
  image_number      = db.IntegerProperty(required=True)
  
  @property
  def id(self):
      return self.key().id()
  
  @classmethod
  def get_object(cls, id):
      album = memcache.get("album_" + id)
            
      if album is None:
          album = Album.get_by_id(int(id))
          memcache.set("album_" + id, album, 60*60*24*30)
      
      return album
  
  @classmethod
  def add_object(cls, album_name):
      album = Album(name=album_name, list_type='black_list', access_type='public',image_number=0)
      album.put()
      memcache.set("album_" + str(album.key().id()), album, 60*60*24*30)
      memcache.set("album_updatetime", datetime.datetime.utcnow(), 60*60*24*30)
      return album
  
  @classmethod
  def get_list(cls, order, limit, start):
      key = "albumlist_" + order + "_" + limit + "_" + start
      if users.is_current_user_admin():
        key = key + "_admin"
        
      list_updatetime = memcache.get(key + "_updatetime")
      album_updatetime = memcache.get("album_updatetime")
    
      albumlist_json = ""
      if list_updatetime and album_updatetime and list_updatetime > album_updatetime:
          albumlist_json = memcache.get(key)
    
      if not albumlist_json:    
          query = Album.all()
          query.order(order)
          results = query.fetch(int(limit),int(start))
          
          albumlist_json = ""
          
          for album in results:
            if album.access_type != "private" or users.is_current_user_admin():
                thumbnail = "no_cover"
                if album.cover_thumbnail:
                    if album.access_type == "share" and not users.is_current_user_admin():
                        thumbnail = "password_protect"
                    else:
                        thumbnail = album.cover_thumbnail

                description = ""
                if album.description:
                    description = album.description
            
                if albumlist_json:
                    albumlist_json = albumlist_json + ',{"id":"' + str(album.id) + '","name":"' + album.name + '","cover_thumbnail":"' + thumbnail + '","description":"' + description + '","image_number":"' + str(album.image_number) + '","access_type":"' + album.access_type + '"}'
                else:
                    albumlist_json = '{"id":"' + str(album.id) + '","name":"' + album.name + '","cover_thumbnail":"' + thumbnail + '","description":"' + description + '","image_number":"' + str(album.image_number) + '","access_type":"' + album.access_type + '"}'
                
          albumlist_json = '[' + albumlist_json + ']'
          memcache.set(key, albumlist_json, 60*60*24*30) 
          memcache.set(key + "_updatetime", datetime.datetime.utcnow(), 60*60*24*30)
          
          if not album_updatetime:
             memcache.set("album_updatetime", datetime.datetime.utcnow(), 60*60*24*30)
      
      return albumlist_json
  
  @classmethod
  def get_image_list(cls, id, order, limit, start):
      key = "album_image_list_" + id
      
      albumimage_list_json = ""
      albumimage_list_json = memcache.get(key)
    
      if not albumimage_list_json:
          query = Image.all()
          query.filter('album=', id)
          query.order(order)
          results = query.fetch(int(limit),int(start))
          
          albumimage_list_json = ""
        
          for image in results:
              thumbnail = Thumbnail.get_object(str(image.id))              
              if albumimage_list_json:
                  albumimage_list_json = albumimage_list_json + ',{"thumbnail_id":"' + str(thumbnail.id) + '","image_id":"' + str(image.id) + '","thumbnail_width":"' + str(image.width) + '","thumbnail_height":"' + str(image.height) + '"}'
              else:
                  albumimage_list_json = '{"thumbnail_id":"' + str(thumbnail.id) + '","image_id":"' + str(image.id) + '","thumbnail_width":"' + str(image.width) + '","thumbnail_height":"' + str(image.height) + '"}'
          
          albumimage_list_json = '[' + albumimage_list_json + ']' 
          memcache.set(key, albumimage_list_json, 60*60*24*30)
          
      return albumimage_list_json
  
class Thumbnail(db.Model):
  #album             = db.StringProperty(required=True)
  image             = db.StringProperty(required=True)
  #name              = db.StringProperty(required=True)
  #create_time       = db.DateTimeProperty(auto_now_add=True)
  mime              = db.StringProperty(required=True)
  size              = db.IntegerProperty(required=True)
  width             = db.IntegerProperty(required=True)
  height            = db.IntegerProperty(required=True)
  bf                = db.BlobProperty(required=True)
  
  @property
  def id(self):
      return self.key().id()
  
  @classmethod
  def get_object(cls, id):
      thumbnail = memcache.get("thumbnail_" + id)
            
      if thumbnail is None:
          thumbnail = Thumbnail.get_by_id(int(id))
          memcache.set("thumbnail_" + id, thumbnail, 60*60*24*30)
      
      return thumbnail
  
class Image(db.Model):
  album             = db.StringProperty(required=True)
  name              = db.StringProperty(required=True)
  create_time       = db.DateTimeProperty(auto_now_add=True)
  mime              = db.StringProperty(required=True)
  size              = db.IntegerProperty(required=True)
  width             = db.IntegerProperty(required=True)
  height            = db.IntegerProperty(required=True)
  bf                = db.BlobProperty()
  
  @property
  def id(self):
      return self.key().id()
  
  @classmethod
  def get_object(cls, id):
      image = memcache.get("image_" + id)
            
      if image is None:
          image = Image.get_by_id(int(id))
          memcache.set("image_" + id, image, 60*60*24*30)
      
      return image
  
class ImageBF(db.Model):  
  image             = db.StringProperty(required=True)
  bf                = db.BlobProperty(required=True)
  
  
