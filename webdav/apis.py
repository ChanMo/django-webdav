import re
import os
# import h5py
from django.conf import settings
from django.core.files.images import ImageFile
from django.urls import path
from django.http import StreamingHttpResponse, HttpResponseNotFound, FileResponse, HttpResponse, JsonResponse
from django.core.files.storage import default_storage
from sorl.thumbnail import get_thumbnail
# from django.core.files.storage import default_storage
from rest_framework.routers import DefaultRouter
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.generics import ListAPIView
from rest_framework.viewsets import ModelViewSet
from . import get_webdav_client
from .models import Activity, Comment, ShareLink
from .serializers import ActivitySerializer, CommentSerializer, ShareLinkSerializer
from .signals import upload_file_done, mv_file_done


class ActivityFilterView(ListAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    # filterset_fields = ('resource',)

    def get_queryset(self):
        qs = super().get_queryset()
        resource = self.request.query_params.get('resource')
        if not resource:
            return []

        resource = build_uri(resource, self.request, self.kwargs)
        return qs.filter(resource=resource)



class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    # filterset_fields = ('resource',)

    def get_queryset(self):
        qs = super().get_queryset()
        resource = self.request.query_params.get('resource')
        if not resource:
            return []

        resource = build_uri(resource, self.request, self.kwargs)
        return qs.filter(resource=resource)

    def perform_create(self, serializer):
        serializer.save(**self.kwargs)


class ShareLinkViewSet(ModelViewSet):
    queryset = ShareLink.objects.all()
    serializer_class = ShareLinkSerializer
    lookup_field = 'uuid'
    # filterset_fields = ('resource',)

    def get_queryset(self):
        qs = super().get_queryset()
        resource = self.request.query_params.get('resource')
        if not resource:
            return []

        resource = build_uri(resource, self.request, self.kwargs)
        return qs.filter(resource=resource)

    def perform_create(self, serializer):
        serializer.save(**self.kwargs)



def build_uri(uri, request=None, kwargs=None):
    # pk = kwargs.get('pk')
    # return f'/{pk}{uri}'.replace('//', '/')
    return f'/{uri}'.replace('//', '/')


@api_view()
def dir_tree(request, **kwargs):
    c = get_webdav_client()
    tree = c.collection_tree(build_uri('/', request, kwargs))
    return Response(tree)


@api_view()
def file_list(request, **kwargs):
    c = get_webdav_client()
    dirpath = request.GET.get('dir', '/')
    res = c.ls(build_uri(dirpath, request, kwargs))
    newres = []
    for row in res:
        newres.append([*row, ])
    return Response(res)


@api_view(['POST'])
def create_folder_view(request, **kwargs):
    c = get_webdav_client()
    name = request.data.get('name')
    c.mkdir(build_uri(f'/{name}', request, kwargs))
    return Response({'success':True})


@api_view(['POST'])
def move_view(request, **kwargs):
    uri = request.data.get('uri')
    destination = request.data.get('destination')
    origin = build_uri(uri, request, kwargs)
    destination = build_uri(destination, request, kwargs)
    get_webdav_client().move(
        origin,
        destination
    )
    mv_file_done.send('move_view',
                        origin=origin,
                        destination=destination,
                        user=request.user)
    return Response({'success':True})

@api_view(['DELETE'])
def delete_view(request, **kwargs):
    c = get_webdav_client()
    uri = request.data.get('uri')
    c.delete(build_uri(uri, request, kwargs))
    return Response({'success':True})


@api_view(['GET'])
def open_view(request, **kwargs):
    """
    download file
    if file info is None, raise 404
    """
    filename = request.query_params.get('uri')
    uri = build_uri(filename, request, kwargs)
    c = get_webdav_client()
    info = c.info(uri)
    if not info:
        return HttpResponseNotFound()

    return StreamingHttpResponse(
        c.direct_download(uri),
        content_type=info.contenttype,
        headers={'Content-Disposition': f'attachment;filename="{filename}"'}
    )


@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_view(request, **kwargs):
    c = get_webdav_client()
    f = request.data['file']
    tmpfile = f'/tmp/{f.name}'
    with open(tmpfile, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)

    uri = request.data.get('uri', '/')
    uri = f'{uri}/{f.name}'
    uri = build_uri(uri, request, kwargs)

    with open(tmpfile, 'rb') as ff:
        c.upload(uri, ff)

    upload_file_done.send('upload_view', resource=uri, user=request.user)

    return Response({'success':True})


@api_view(['GET'])
def preview_view(request, **kwargs):
    """
    预览文件内容, 图片等
    """
    filename = request.query_params.get('uri')
    uri = build_uri(filename, request, kwargs)
    c = get_webdav_client()
    info = c.info(uri)
    if not info:
        return HttpResponseNotFound()

    # TODO File max size check
    if re.match(r'^image\/', info.contenttype):
        img_path = c.path(uri)
        img = default_storage.open(img_path)
        imgFile = ImageFile(img)
        size = '960'
        if imgFile.height > 1200:
            size = 'x1200'
        thumbnail = get_thumbnail(img, size, quality=90)
        # return FileResponse(open(thumbnail.url, 'rb'))
        res = ImageFile(thumbnail).read()
        return HttpResponse(res, content_type=info.contenttype)
    elif info.contenttype == 'application/json':
        text_path = c.path(uri)
        text = default_storage.open(text_path).read()
        return HttpResponse(text)
    elif re.match('^(audio|video)\/', info.contenttype):
        return StreamingHttpResponse(
            c.direct_download(uri),
            content_type=info.contenttype,
            headers={'Content-Disposition': f'attachment;filename="{filename}"'}
        )
    # elif re.match(r'.*\.h5$', filename):
    #     localpath = settings.BASE_DIR / f'dav/data{uri}'
    #     f = h5py.File(localpath, 'r')
    #     res = {}
    #     for key in f.keys():
    #         res2 = {}
    #         for k2 in f[key].keys():
    #             res2.update({k2: f[key][k2].shape})
    #         res.update({key:res2})
    #     return JsonResponse(res)

    return HttpResponse('不可预览')



router = DefaultRouter()
router.register('comment', CommentViewSet)
router.register('sharelink', ShareLinkViewSet)



urlpatterns = [
    path('activity/', ActivityFilterView.as_view()),
    path('tree/', dir_tree),
    path('upload/', upload_view),
    path('delete/', delete_view),
    path('mkdir/', create_folder_view),
    path('open/', open_view),
    path('move/', move_view),
    path('preview/', preview_view),
    path('', file_list),
]
urlpatterns += router.urls
