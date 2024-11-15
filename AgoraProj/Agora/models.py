from django.db import models
from django.conf import settings

class Account(models.Model):
    firstname = models.CharField(max_length=255, blank=True, default="")
    lastname = models.CharField(max_length=255, blank=True, default="")
    gender = models.CharField(max_length=75, blank=True, default="")
    age = models.IntegerField(null=True)
    birthday = models.DateField(null=True, blank=True)
    bio = models.CharField(max_length=255, blank=True, default="")
    ui_appearance = models.CharField(max_length=255, blank=True, default="")
    cover_photo = models.URLField(verbose_name="File URL", blank=True, default="")
    cover_photo_id_imagekit = models.CharField(max_length=355, null=True, blank=True, default="")
    profile_photo = models.URLField(verbose_name="File URL", default="")
    profile_photo_id_imagekit = models.CharField(max_length=355, null=True, blank=True, default="")
    auth_user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE)
    last_activity = models.DateTimeField(null=True, blank=True)
    is_online = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.firstname} {self.lastname}"

class Audience(models.Model):
    audience = models.CharField(max_length=150, default="")
    description = models.CharField(max_length=255, default="")
    link = models.URLField(verbose_name="File URL", blank=True, default="")

    def __str__(self):
        return f"{self.audience}"

class Post(models.Model):
    account = models.ForeignKey(Account, null=True, on_delete=models.CASCADE)
    audience = models.ForeignKey(Audience, null=True, on_delete=models.CASCADE)
    caption = models.CharField(max_length=800, blank=True, default="")
    dateTime = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"{self.caption}"

class Photo(models.Model):
    link = models.URLField(verbose_name="File URL", default="")
    link_id_imagekit = models.CharField(max_length=355, null=True, blank=True, default="")
    post = models.ForeignKey(Post, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.link}"

class Video(models.Model):
    link = models.URLField(verbose_name="File URL", default="")
    post = models.ForeignKey(Post, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.link}"

class Tag(models.Model):
    tag = models.CharField(max_length=500, default="")
    post = models.ManyToManyField(Post, related_name='tags')

    def __str__(self):
        return f"{self.tag}"

class Friend(models.Model):
    user = models.ForeignKey(Account, related_name='user_friendships', null=True, on_delete=models.CASCADE)
    friend = models.ForeignKey(Account, related_name='friend_friendships', null=True, on_delete=models.CASCADE)
    status = models.CharField(max_length=100, default="")
    date_friend_request = models.DateTimeField(auto_now_add=True, null=True)
    date_became_friends = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"{self.user.firstname} sent a friend request to {self.friend.firstname}"

class Notification(models.Model):
    content = models.CharField(max_length=255, default="")
    status = models.CharField(max_length=100, default="")
    friend_request = models.ForeignKey(Friend, null=True, on_delete=models.CASCADE, related_name='notifications')

    def __str__(self):
        return f"{self.content}"

class Comment(models.Model):
    content = models.CharField(max_length=255, default="")
    dateTime = models.DateTimeField(auto_now_add=True, null=True)
    post = models.ForeignKey(Post, null=True, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.content}"

class Glow(models.Model):
    account = models.ForeignKey(Account, null=True, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, null=True, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"{self.account.firstname} reacted on {self.post.caption}"

class Share(models.Model):
    account = models.ForeignKey(Account, null=True, on_delete=models.CASCADE)
    audience = models.ForeignKey(Audience, null=True, on_delete=models.CASCADE)
    caption = models.CharField(max_length=800, blank=True, default="")
    post = models.ForeignKey(Post, null=True, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"{self.account.firstname} shared {self.post.caption}"

