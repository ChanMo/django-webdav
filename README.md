# Django File manager by Webdav

File Manager like dropbox

## Features

* 文件管理
* 多级目录
* 分片上传
* 文件预览
* 评论
* 分享
* 操作历史

## Depends on

* Django
* djangorestframework
* sorl-thumbnail
* Webdav
* React + Vite
* @mui/material


## Quick Start

### Install

```
$ git clone 
```

### Update Settings.py

```
INSTALLED_APPS = [
    ...
    'webdav',
    ...
]

WEBDAV_HOST = 'localhost'
WEBDAV_USER = 'demo'
WEBDAV_PASSWORD = 'demopassword'
```

### Update Urls.py

```
urlpatterns = [
    ...
    path('webdav/', include('webdav.urls')),
    ...
]
```

### Sync database

```
$ ./manage.py migrate
```

## Reference

* Dropbox
* Nextcloud

## Todo

* [ ] Permission Controls
