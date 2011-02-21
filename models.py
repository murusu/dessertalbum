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

class AlbumConfig(db.Model):
  title = db.StringProperty(required=True)
  theme = db.StringProperty(required=True)
  anti_leech = db.BooleanProperty(required=True, default=False)  
  list_type = db.StringProperty(required=True, choices=set(["black_list", "white_list"]))
  list_content = db.StringProperty()
  
