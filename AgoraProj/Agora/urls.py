from django.urls import path, re_path
from . import views
from .views import deletePost
from .views import getrandomPosts
from .views import LoginApiView
from .views import SignupView

from .views import (
    CustomPasswordResetView,
    CustomPasswordResetDoneView,
    CustomPasswordResetFromKeyView,
    CustomPasswordResetFromKeyDoneView,
)

urlpatterns = [
    path('', views.homepage, name="home"),
    path('About', views.about, name="About"),
    path('validatelogin/', views.validatelogin, name="validatelogin"),
    path('signup/', views.signup, name="signup"),
    path('account/login/validate/', views.validatelogin, name='validatelogin'),
    path('account/signup/', views.signup, name='signup'),
    path('dashboard', views.dashboard, name='dashboard'),
    path('dashboard/uploadprofile', views.UploadProfile, name='uploadprofile'),
    path('handle_media/', views.handle_media, name='handle_media'),
    path('myprofile/<int:id>', views.UserProfile, name='myprofile'),
    path('profile/<int:id>', views.randomProfile, name='profile'),
    path('add_friend/', views.AddFriend, name='add_friend'),
    path('confirm_friend/', views.ConfirmFriend, name='confirm_friend'),
    path('getCommentPost/<int:id>/', views.getCommentPost, name='getCommentPost'),
    path('sendComment/', views.sendComment, name='sendComment'),
    path('FetchComments/<int:postId>/', views.FetchComments, name='FetchComments'),
    path('tags/<int:id>', views.randomTags, name='tags'),
    path('post/<int:id>', views.randomPosts, name='post'),
    path('sendLike/', views.sendLike, name='sendLike'),
    path('sendUnlike/', views.sendUnlike, name='sendUnlike'),
    path('getLikes/<int:postId>/', views.getLikes, name='getLikes'),
    path('editProfile/<int:id>', views.editProfile, name='editProfile'),
    path('searchResults/', views.searchResults, name='searchResults'),
    path('FetchForYou/', views.FetchForYou, name='FetchForYou'),
    re_path(r'^FetchFriendsPosts/$', views.FetchFollowing, name='FetchFriendsPosts'),
    path('account/password/reset/', CustomPasswordResetView.as_view(), name='account_reset_password'),
    path('account/password/reset/done/', CustomPasswordResetDoneView.as_view(), name='account_reset_done_password'),
    path('account/password/reset/key/<uidb64>/<key>/', CustomPasswordResetFromKeyView.as_view(), name='account_reset_from_key'),
    path('account/password/reset/key/done/', CustomPasswordResetFromKeyDoneView.as_view(), name='account_reset_from_key_done'),
    path('dashboard/emoji', views.emojis, name='get_emoji'),
    #path('dashboard/fetchUserPosts/<int:postId>/', views.auto_fetch_userPost, name='fetchUserPosts')
    #path('stream/', PostStreamView.as_view(), name = 'stream'),
    #path('count_new_posts/', views.count_new_posts, name='count_new_posts'),
    #path('FetchFriendsPosts/', views.FetchFriendsPosts, name='FetchFriendsPosts'),
    path('fetchNewUsers/', views.fetchNewUsers, name="fetchNewUsers"),
    path('games/', views.game_list, name='game_list'),
    path('games/launch/', views.game_launch, name='game_launch'),
    path('chat_page', views.chat_page, name='chat_page'),
    path('chat_with_gemini/', views.chat_with_gemini, name='chat_with_gemini'),
    re_path(r'^settings/$', views.settingsPage, name='settings'),
    re_path(r'^myprofile/deletePost/(?P<id>\d+)/$', deletePost, name='deletePost'),
    re_path(r'^capture-event/$', views.capture_event, name='capture-event'),
    re_path(r'^myprofile/sendNewProfile/$', views.sendNewProfile, name='sendNewProfile'),
    re_path(r'^myprofile/sendNewCover/$', views.sendNewCover, name='sendNewCover'), 
    re_path(r'^getrandomPosts/', getrandomPosts.as_view(), name='getrandomPosts'),
    re_path(r'^signupApi/', SignupView.as_view(), name='signupApi'), 
    #-----------------------------------------Justine------------------------------------------------
    re_path(r'^loginApi/', LoginApiView.as_view(), name='loginApi'),


























    #----------------------------------------Jefferson------------------------------------------------
































    #------------------------------------------Vaughn------------------------------------------------




























]
