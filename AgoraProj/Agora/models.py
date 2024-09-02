from django.db import models
from django.conf import settings

class Account(models.Model):
    firstname = models.CharField(null=True, max_length=255)
    lastname = models.CharField(null=True, max_length=255)
    gender = models.CharField(null=True, max_length=75)
    Age = models.IntegerField(null=True)
    Birthday = models.DateField(null=True)
    bio = models.CharField(null=True, max_length=255)
    UIAppearance = models.CharField(null=True, max_length=255)
    cover_photo = models.URLField(null=True, verbose_name="File Url")
    profile_photo = models.URLField(verbose_name="File Url")
    auth_user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.firstname} {self.lastname}"

class Audience(models.Model):
    audience = models.CharField(max_length=150)
    description = models.CharField(max_length=255)
    link = models.URLField(null=True, verbose_name="File Url")

    def __str__(self):
        return f"{self.audience}"

class Post(models.Model):
    account = models.ForeignKey(Account, null=True,on_delete=models.CASCADE)
    audience = models.ForeignKey(Audience,null=True,on_delete=models.CASCADE)
    caption = models.CharField( null=True, max_length=800)
    dateTime = models.DateTimeField(auto_now_add=True, null=True, max_length=75)

    def __str__(self):
        return f"{self.caption}"

class Photo(models.Model):
    link = models.URLField(verbose_name="File Url")
    link_id_imagekit = models.CharField(max_length=355, null=True, blank=True)
    post = models.ForeignKey(Post, null=True,on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.link}"

class Video(models.Model):
    link = models.URLField(verbose_name="File Url")
    post = models.ForeignKey(Post, null=True,on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.link}"

class Tag(models.Model):
    tag = models.CharField(max_length=500)
    post = models.ManyToManyField(Post, related_name='tags')

    def __str__(self):
        return f"{self.tag}"

class Friend(models.Model):
    user = models.ForeignKey(Account, related_name='user_friendships', null=True, on_delete=models.CASCADE)
    friend = models.ForeignKey(Account, related_name='friend_friendships', null=True, on_delete=models.CASCADE)
    status = models.CharField(max_length=100)
    date_friend_request = models.DateTimeField(auto_now_add=True, null=True, max_length=75)
    date_became_friends = models.DateTimeField(auto_now_add=True, null=True, max_length=75)

    def __str__(self):
        return f"{self.user.firstname} sent a friend request to {self.friend.firstname}"

class Notification(models.Model):
    content = models.CharField(max_length=255)
    status = models.CharField(max_length=100)
    friend_request = models.ForeignKey(Friend, null=True, on_delete=models.CASCADE, related_name='notifications')

    def __str__(self):
        return f"{self.content}"

class Comment(models.Model):
    content = models.CharField(max_length=255)
    dateTime = models.DateTimeField(auto_now_add=True, null=True, max_length=75)
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
    audience = models.ForeignKey(Audience,null=True,on_delete=models.CASCADE)
    caption = models.CharField( null=True, max_length=800)
    post = models.ForeignKey(Post, null=True, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"{self.account.firstname} shared {self.post.caption}"