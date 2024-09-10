from django.contrib import admin
from .models import Account, Audience, Post, Photo, Video, Tag, Friend, Notification, Comment, Glow

class AccountAdmin(admin.ModelAdmin):
    list_display = (
        'firstname', 'lastname', 'gender', 'Age', 'Birthday', 'bio', 
        'UIAppearance', 'cover_photo', 'profile_photo', 'auth_user', 
        'last_activity', 'is_online_display'
    )
    
    def is_online_display(self, obj):
        return "True" if obj.is_online else "False"
    is_online_display.short_description = 'Is Online'

admin.site.register(Account, AccountAdmin)
admin.site.register(Audience)
admin.site.register(Post)
admin.site.register(Tag)
admin.site.register(Photo)
admin.site.register(Video)
admin.site.register(Friend)
admin.site.register(Notification)
admin.site.register(Comment)
admin.site.register(Glow)
