from django.urls import path
from . import views
<<<<<<< HEAD
from .views import (
    CustomPasswordResetView,
    CustomPasswordResetDoneView,
    CustomPasswordResetFromKeyView,
    CustomPasswordResetFromKeyDoneView,
)


urlpatterns = [
    path('', views.home, name="home"),
    path('account/login/validate/', views.validatelogin, name='validatelogin'),
    path('account/signup/', views.signup, name='signup'),
<<<<<<< HEAD
    #path('stream/', PostStreamView.as_view(), name = 'stream'),
    path('dashboard', views.dashboard, name='dashboard'), 
    path('publish_to_ably/', views.publish_to_ably, name='publish_to_ably'),
=======

urlpatterns = [
    path('', views.home, name="home"),
    path('accounts/login/validate/', views.validatelogin, name='validatelogin'),
    path('dashboard', views.dashboard, name='dashboard'), 
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17
=======
    path('dashboard', views.dashboard, name='dashboard'),
>>>>>>> v1
    path('dashboard/uploadprofile', views.UploadProfile, name='uploadprofile'), 
    path('handle_media/', views.handle_media, name='handle_media'),
    path('dashboard/profile', views.UserProfile, name='UserProfile'),
    path('profile/<int:id>', views.randomProfile, name='profile'),
    path('add_friend/', views.AddFriend, name='add_friend'),
    path('confirm_friend/', views.ConfirmFriend, name='confirm_friend'),
    path('getCommentPost/<int:id>/', views.getCommentPost, name='getCommentPost'),
    path('sendComment/', views.sendComment, name='sendComment'),
    path('FetchCommentsAsync/<int:postId>/', views.FetchCommentsAsync, name='FetchCommentsAsync'),
    path('tags/<int:id>', views.randomTags, name='tags'),
    path('post/<int:id>', views.randomPosts, name='post'),
    path('sendLike/', views.sendLike, name='sendLike'),
    path('sendUnlike/', views.sendUnlike, name='sendUnlike'),
    path('getLikes/<int:postId>/', views.getLikes, name='getLikes'),
    path('editProfile/<int:id>', views.editProfile, name='editProfile'),
    path('searchResults/', views.searchResults, name='searchResults'),
    path('FetchForYou/', views.FetchForYou, name='FetchForYou'),
<<<<<<< HEAD
    path('account/password/reset/', CustomPasswordResetView.as_view(), name='account_reset_password'),
    path('account/password/reset/done/', CustomPasswordResetDoneView.as_view(), name='account_reset_done_password'),
    path('account/password/reset/key/<uidb64>/<key>/', CustomPasswordResetFromKeyView.as_view(), name='account_reset_from_key'),
    path('account/password/reset/key/done/', CustomPasswordResetFromKeyDoneView.as_view(), name='account_reset_from_key_done'),
    path('dashboard/emoji', views.emojis, name='get_emoji'),
    #path('dashboard/fetchUserPosts/<int:postId>/', views.auto_fetch_userPost, name='fetchUserPosts')
    #path('stream/', PostStreamView.as_view(), name = 'stream'),
    path('count_new_posts/', views.count_new_posts, name='count_new_posts'),
    #path('FetchFriendsPosts/', views.FetchFriendsPosts, name='FetchFriendsPosts'),
]
=======
    path('FetchFriendsPosts/', views.FetchFriendsPosts, name='FetchFriendsPosts'),
]
>>>>>>> 81396d173fbc83a724cab1e1868c7a58497b0e17
