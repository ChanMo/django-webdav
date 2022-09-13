"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from webdav.views import share_view, share_auth_view

urlpatterns = [
    path('share/<uuid:pk>/', share_view),
    path('share/<uuid:pk>/auth/', share_auth_view),
    path('api/webdav/', include('webdav.apis')),
    path('webdav/', include('webdav.urls')),
    path('admin/', admin.site.urls),
]
