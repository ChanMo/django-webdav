from rest_framework import serializers
# from accounts.serializers import BaseUserSerializer
from .models import Activity, Comment, ShareLink
from .utils import build_uri


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # ret['user'] = BaseUserSerializer(instance.user).data
        ret['user'] = {
            'id': instance.user.id,
            'username': instance.user.username
        }
        return ret


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    class Meta:
        model = Comment
        fields = '__all__'

    # def to_internal_value(self, value):
    #     return {
    #         **value,
    #         'user': self.context['request'].user
    #     }

    def save(self, **kwargs):
        data = self.validated_data
        request = self.context['request']
        resource = data.get('resource', '')
        resource = build_uri(resource, request, kwargs)
        self.instance = Comment.objects.create(
            message=data.get('message'),
            user=request.user,
            resource=resource
        )
        return self.instance

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # ret['user'] = BaseUserSerializer(instance.user).data
        ret['user'] = {
            'id': instance.user.id,
            'username': instance.user.username
        }

        return ret



class ShareLinkSerializer(serializers.ModelSerializer):
    creator = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    class Meta:
        model = ShareLink
        fields = '__all__'


    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # site = self.context['request'].site
        ret['link'] = f'/share/{instance.uuid}/'

        return ret

    def save(self, **kwargs):
        data = self.validated_data
        request = self.context['request']
        resource = data.get('resource', '')
        if kwargs:
            resource = build_uri(resource, request, kwargs)
        self.instance, created = ShareLink.objects.update_or_create(
            creator=request.user,
            resource=resource,
            defaults = {
                'password': data.get('password')
            }
        )
        return self.instance
