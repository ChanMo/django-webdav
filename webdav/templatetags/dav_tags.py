import os
from django import template
from django.conf import settings
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.encoding import uri_to_iri
from webdav.client import Client, without_root as rm_root

register = template.Library()

@register.filter
def dav_file(path):
    c = Client(
        settings.WEBDAV_HOSTNAME,
        username=settings.WEBDAV_USERNAME,
        password=settings.WEBDAV_PASSWORD)
    
    url, ext = c.open(path)
    if ext == 'bin':
        return redirect(reverse('threed:index', args=(url,)))
    return f'/media/{url}'


@register.filter
def clean_name(path, suffix=True):
    head, tail = os.path.split(path)
    if not tail:
        tail = head.split('/')[-1]
    tail = tail.replace('Swath', '子测线')
    if suffix:
        return uri_to_iri(tail)
    return os.path.splitext(tail)[0]


@register.filter
def clean_path(path):
    return '/'.join(path.split('/')[2:])
    

@register.filter
def clean_dir(path):
    return os.path.splitext(path)[0]


@register.filter
def without_root(path):
    return rm_root(path)

