from django.contrib import admin
from .models import Account, Audience, Post, Photo, Video, Tag, Friend, Notification, Comment, Glow

admin.site.register(Account)
admin.site.register(Audience)
admin.site.register(Post)
admin.site.register(Tag)
admin.site.register(Photo)
admin.site.register(Video)
admin.site.register(Friend)
admin.site.register(Notification)
admin.site.register(Comment)
admin.site.register(Glow)


