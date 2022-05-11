from django.urls import path
from . import views


urlpatterns = [
    path('<path:filepath>/', views.file_view, name='index'),
    path('', views.index_view, name='index'),
]

app_name = 'webdav'
