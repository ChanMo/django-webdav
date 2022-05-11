from django.contrib import admin
from .models import ShareLink, Comment, Activity


@admin.register(ShareLink)
class ShareLinkAdmin(admin.ModelAdmin):
    list_display = ('resource', 'creator', 'expired_at', 'created_at')
    list_per_page = 12
    list_filter = ('expired_at', 'created_at')
    search_fields = ('user__username', 'user__id', 'resource')


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('resource', 'user', 'message', 'created_at')
    list_per_page = 12
    list_filter = ('created_at',)
    search_fields = ('resource', 'user__id', 'user__username', 'message')

    
@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('resource', 'user', 'action', 'created_at')
    list_per_page = 12
    list_filter = ('created_at','action')
    search_fields = ('resource', 'user__id', 'user__username',)

    
