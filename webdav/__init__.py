import os
from django.conf import settings
from .client import Client, without_root

def get_webdav_client():
    c = Client(
        settings.WEBDAV_HOSTNAME,
        settings.WEBDAV_PORT,
        username=settings.WEBDAV_USERNAME,
        password=settings.WEBDAV_PASSWORD)

    return c


def get_index(uri):
    dirname = os.path.dirname(uri)
    res = get_webdav_client().ls(dirname, skip=0)[1:]
    path_list = [i.path for i in res]
    return path_list.index(uri)


def get_next_uri(uri):
    dirname = os.path.dirname(uri)
    res = get_webdav_client().ls(dirname, 0)[1:]
    path_list = [i.path for i in res]
    index = path_list.index(uri)
    if index >= len(path_list) - 1:
        return None
    return res[index+1]


def get_previous_uri(uri):
    dirname = os.path.dirname(uri)
    res = get_webdav_client().ls(dirname, 0)[1:]
    path_list = [i.path for i in res]
    index = path_list.index(uri)
    if index <= 0:
        return None
    return res[index-1]


# def get_project_id(uri):
#     return uri.split('/')[0]
