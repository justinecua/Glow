from rest_framework import serializers
from ..models import Post, Tag, Photo, Glow

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'tag']

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['link', 'link_id_imagekit']  

class PostSerializer(serializers.ModelSerializer):
    time_ago = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    glows_count = serializers.SerializerMethodField()
    has_liked = serializers.SerializerMethodField()
    tags = TagSerializer(many=True)
    photos = PhotoSerializer(many=True, source='photo_set')  

    class Meta:
        model = Post
        fields = ['id', 'caption', 'dateTime', 'time_ago', 'comment_count', 'glows_count', 'has_liked', 'tags', 'photos']

    def get_time_ago(self, obj):
        from .main import time_ago
        return time_ago(obj.dateTime)

    def get_comment_count(self, obj):
        return obj.comment_count

    def get_glows_count(self, obj):
        return obj.glows_count

    def get_has_liked(self, obj):
        request = self.context.get('request')
        if request.user.is_authenticated:
            return Glow.objects.filter(post=obj, account__auth_user=request.user).exists()
        return False

