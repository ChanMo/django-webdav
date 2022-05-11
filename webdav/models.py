import uuid
from django.db import models
from django.conf import settings
from . import get_webdav_client


class DavMixin:
    # resource = models.CharField(max_length=255)

    @property
    def get_resource(self):
        return get_webdav_client().info(self.resource)

    def get_resource_url(self):
        res, _ = get_webdav_client().open(self.resource)
        return f'/media/{res}'


class ShareLink(DavMixin, models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, primary_key=True)
    resource = models.CharField(max_length=255)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    password = models.CharField(max_length=20, blank=True, null=True)
    expired_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.uuid)

    class Meta:
        ordering = ['-created_at']
        unique_together = [['uuid', 'resource']]


class Comment(models.Model):
    resource = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message[0:20]

    class Meta:
        ordering = ['-created_at']



class Activity(models.Model):
    ACTION_CHOICES = (
        ('mv', '重命名'),
        ('upload_file', '上传'),
        ('comment', '评论'),
    )
    resource = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    action = models.CharField(max_length=200, choices=ACTION_CHOICES)
    # description = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.action

    class Meta:
        ordering = ['-created_at']
