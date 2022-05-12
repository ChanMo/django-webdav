# import os.path
# import hashlib
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.http import HttpResponseNotFound
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from react.mixins import ReactMixin
from .models import ShareLink
from .forms import ShareAuthForm
from . import get_webdav_client


def share_view(request, pk):
    obj = get_object_or_404(ShareLink, pk=pk)
    if not request.session.get(f'{pk}_passed', False):
        return redirect(f'/share/{pk}/auth/')

    return render(request, 'webdav/share.html', {'object':obj})


def share_auth_view(request, pk):
    obj = get_object_or_404(ShareLink, pk=pk)
    if request.session.get(f'{pk}_passed', False):
        return redirect(f'/share/{pk}/')

    if request.method == 'POST':
        form = ShareAuthForm(request.POST)
        if form.is_valid():
            if form.cleaned_data.get('password') == obj.password:
                request.session[f'{pk}_passed'] = True
                return redirect(f'/share/{pk}/')

            form.add_error(None, '密码错误')
    else:
        form = ShareAuthForm()

    return render(request, 'webdav/share_auth.html', {'form':form})


class IndexView(LoginRequiredMixin, ReactMixin, TemplateView):
    template_name = 'webdav/index.html'
    def get_props_data(self):
        return {
            'current': self.request.GET.get('dir', '/')
        }


@login_required
def file_view(request, filepath):
    res, ext = get_webdav_client().open(filepath)
    if not res:
        return HttpResponseNotFound()

    url = '/'
    if ext == '.bin':
        url = reverse('threed:index', args=(filepath,))
    elif ext == '.nmea':
        url = reverse('gis:index', args=(filepath,))
    else:
        url = f'/media/{res}'

    if request.GET:
        url += '?' + request.GET.urlencode()
    return redirect(url)

