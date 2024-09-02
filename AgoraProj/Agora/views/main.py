from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.models import User
from ..models import Account, Audience, Post, Photo, Video, Tag, Friend, Notification, Comment, Glow
from ..helpers import ImagekitClient
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from datetime import datetime
from django.views import View
import requests
import base64
import json
import html
import secrets
import datetime
from ably import AblyRealtime
import asyncio
from django.conf import settings
from datetime import datetime
from django.db.models import Q
from django.core.serializers.json import DjangoJSONEncoder
from django.utils import timezone
from datetime import datetime
import pytz
from django.db.models import Count
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from allauth.account.views import PasswordResetView, PasswordResetDoneView, PasswordResetFromKeyView, PasswordResetFromKeyDoneView
from django.contrib.auth import get_user_model
from django.contrib import messages
import os


def homepage(request):
    return render(request, 'homepage.html')

def about(request):
    return render(request, 'index.html')

def loader(request):
    return render (request, 'loaderio-bf3ddf451e2ba17db18608ca395e3df9.html')

def dashboard(request):
    is_new_user = check_user(request)
    accountInfo = getAccountInfo(request)
    audience = getAudience(request)
    notif_data, unread_notifications_count = fetchNotif(request)
    showfriends = showFriends(request)
    hashtags = showTags(request)
    search = searchResults(request)

    context = {
        'is_new_user': is_new_user,
        'accountInfo': accountInfo,
        'audienceInfo': audience,
        'notifications': notif_data,
        'unread_count': unread_notifications_count,
        'friends': showfriends,
        'hashtags': hashtags,
        'search_results': search.get('results', [])
    }

    return render(request, 'dashboard.html', context)


def emojis(request):
    emoji = get_emoji()

    data = {
        'emoji': emoji
    }

    return JsonResponse(data)

@csrf_exempt
def validatelogin(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"status": "success", "message": "Login successfully", "redirect": "/dashboard"})
        else:
            return JsonResponse({"status": "error", "message": "Incorrect email or password"})
    return JsonResponse({"status": "error", "message": "Invalid request method"})

def check_user(request):
    if request.user.is_authenticated:
        user_exists = User.objects.filter(id=request.user.id).exists()
        account_exists = Account.objects.filter(auth_user_id=request.user.id).exists()
        is_new_user = not (user_exists and account_exists)

        return is_new_user
    else:
        return False

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password1 = data.get('pass')
        password2 = data.get('pass2')

        if password1 == password2:
            if not User.objects.filter(username=username).exists():
                if not User.objects.filter(email=email).exists():
                    user = User.objects.create_user(
                        username=username,
                        email=email,
                        password=password1,
                    )
                    user = authenticate(username=username, password=password1)
                    if user is not None:
                        login(request, user)
                        return JsonResponse({"status": "success", "message": "Signup successfully", "redirect": "/dashboard"})
                    else:
                        return JsonResponse({"status": "error", "message": "Authentication failed"})
                else:
                    return JsonResponse({"status": "error", "message": "Email is already in use"})
            else:
                return JsonResponse({"status": "error", "message": "Username is already taken"})
        else:
            return JsonResponse({"status": "error", "message": "Passwords do not match. Please type again"})

    return JsonResponse({"status": "error", "message": "Invalid request method"})


@csrf_exempt
def UploadProfile(request):
    if request.method == 'POST':
        form_data = json.loads(request.POST['data'])
        profile = request.POST.get('profile_url')
        uploaded_file = request.FILES.get('profile_url')

        firstname = form_data.get('firstname')
        lastname = form_data.get('lastname')
        gender = form_data.get('gender')
        birthday = form_data.get('birthday')

        auth_user_id = request.user.id

        if uploaded_file:
            imgkit = ImagekitClient(uploaded_file)
            result = imgkit.upload_media_file()
            profile_url = result["url"]
        elif profile and profile != '../static/images/Upstream-1.png':
            profile_url = profile
        else:
            profile_url = '../static/images/Upstream-1.png'

        Account.objects.create(
            firstname=firstname,
            lastname=lastname,
            gender=gender,
            profile_photo=profile_url,
            Birthday=birthday,
            auth_user_id=auth_user_id
        )
        return JsonResponse({"status": "success", "message": "Profile Updated successfully", "redirect": "/dashboard"})
    else:
        return JsonResponse({"status": "error", "message": "Only POST requests are allowed."})



def getAccountInfo(request):
    if request.user.is_authenticated:
        try:
            account = Account.objects.get(auth_user=request.user)
            return account
        except Account.DoesNotExist:
            return None
    else:
        return None

def getAudience(request):
    if request.user.is_authenticated:
        try:
            account = Audience.objects.all()
            return account
        except Account.DoesNotExist:
            return None
    else:
        return None

def get_emoji():
    try:
        response = requests.get('https://emoji-api.com/emojis?access_key=c4e0a9cde6711fdf7e6214ac04633e6032fa5513')
        response.raise_for_status()
        emoji_data = response.json()

        decoded_emojis = [html.unescape(emoji['character'][0]) for emoji in emoji_data]
        decoded_emojis = [emoji.strip("[]'") for emoji in decoded_emojis if emoji]
        return decoded_emojis

    except requests.exceptions.HTTPError as errh:
        print(f"HTTP Error: {errh}")
    except requests.exceptions.ConnectionError as errc:
        print(f"Error Connectiong: {errc}")
    except requests.exceptions.Timeout as errt:
        print(f"An Error Occurred: {errt}")
    except requests.exceptions.RequestException as err:
        print(f"An Error Occured: {err}")

    return []


@csrf_exempt
def handle_media(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        accID = data.get("accID")
        audience = data.get("audience")
        caption = data.get("caption")
        tag_list = data.get("tags", [])

        photos = data.get("photos", [])
        photo_names = [photo.get("name") for photo in photos]
        photo_base64_data = [photo.get("origurl").split(",")[1] for photo in photos]

        videos = data.get("videos", [])
        video_names = [video.get("name") for video in videos]
        video_base64_data = [video.get("file").split(",")[1] for video in videos]

        accFK = Account.objects.get(pk=accID)
        AudienceFK = Audience.objects.get(pk=audience)

        new_post = Post.objects.create(
            account=accFK,
            audience=AudienceFK,
            caption=caption,
        )

        for tag_name in tag_list:
            try:
                tag = Tag.objects.get(tag=tag_name)
                tag.post.add(new_post)
            except Tag.DoesNotExist:
                tag = Tag.objects.create(tag=tag_name)
                tag.post.add(new_post)

        for name, base64_data in zip(photo_names, photo_base64_data):
            image_data = base64.b64decode(base64_data)
            content_file = ContentFile(image_data, name=name)

            imgkit = ImagekitClient(content_file)
            Photoresult = imgkit.upload_media_file()
            photo_link = Photoresult["url"]
            photo_link_id = Photoresult["fileId"]

            Photo.objects.create(
                link=photo_link,
                post=new_post,
                link_id_imagekit=photo_link_id
            )

        for vname, base64_data in zip(video_names, video_base64_data):
            video_data = base64.b64decode(base64_data)
            content_file = ContentFile(video_data, name=vname)

            imgkit = ImagekitClient(content_file)
            Videoresult = imgkit.upload_media_file()
            video_link = Videoresult["url"]

            Video.objects.create(
                link = video_link,
                post = new_post,
            )

        photos = list(Photo.objects.filter(post=new_post).values())

        account_username = new_post.account.auth_user.username
        account_profile_photo = new_post.account.profile_photo
        account_id = new_post.account.id
        account_firstname = new_post.account.firstname

        post_time = time_ago(new_post.dateTime),
        tags = list(Tag.objects.filter(post=new_post).values('id', 'tag'))
        comment_count = Comment.objects.filter(post=new_post).count()
        glows_count = Glow.objects.filter(post=new_post).count()
        has_liked = Glow.objects.filter(post=new_post, account__auth_user=request.user).exists()

        currentTime = datetime.now()
        postDate = new_post.dateTime

        context = {
            'status': 'success',
            'message': 'Successfully posted!',
            'userId': request.user.id,
            'accId': account_id,
            'firstname': account_firstname,
            'username': account_username,
            'profile_photo': account_profile_photo,
            'post_id': new_post.id,
            'caption': caption,
            'time': post_time,
            'photos': photos,
            'tags': tags,
            'comment_count': comment_count,
            'glows_count': glows_count,
            'has_liked': has_liked,
        }

        return JsonResponse( context, encoder = DjangoJSONEncoder)
    return JsonResponse({"status": "error", "message": "Only POST method is accepted"})


def FetchForYou(request):
    if request.user.is_authenticated:
        try:
            accounts = Account.objects.all()
            posts_with_accounts = []

            for account in accounts:
                posts = Post.objects.filter(account=account)
                posts_with_accounts.extend(posts)

            posts_with_accounts.sort(key=lambda x: x.dateTime, reverse=True)

            paginator = Paginator(posts_with_accounts, 5)
            page_number = request.GET.get('page')
            try:
                posts_with_accounts = paginator.page(page_number)
            except PageNotAnInteger:
                posts_with_accounts = paginator.page(1)
            except EmptyPage:
                posts_with_accounts = paginator.page(paginator.num_pages)

            posts_data = []
            for post in posts_with_accounts:
                tags = list(Tag.objects.filter(post=post).values('id', 'tag'))
                comment_count = Comment.objects.filter(post=post).count()
                glows_count = Glow.objects.filter(post=post).count()
                has_liked = Glow.objects.filter(post=post, account__auth_user=request.user).exists()
                photos = list(Photo.objects.filter(post=post).values())
                post_data = {
                    'id': post.id,
                    'account': {
                        'id': post.account.id,
                        'firstname': post.account.firstname,
                        'profile_photo': post.account.profile_photo,
                        'username': post.account.auth_user.username
                    },
                    'caption': post.caption,
                    'dateTime': post.dateTime.isoformat(),
                    'time_ago': time_ago(post.dateTime),
                    'tags': tags,
                    'comment_count': comment_count,
                    'glows_count': glows_count,
                    'has_liked': has_liked,
                    'photos': photos
                }
                posts_data.append(post_data)

            return JsonResponse({'status': 'success', 'posts': posts_data})
        except Exception as e:
            print(f"Error fetching posts: {e}")
            return JsonResponse({'status': 'error', 'message': str(e)})
    else:
        try:
            accounts = Account.objects.all()
            posts_with_accounts = []

            for account in accounts:
                posts = Post.objects.filter(account=account)
                posts_with_accounts.extend(posts)

            posts_with_accounts.sort(key=lambda x: x.dateTime, reverse=True)

            paginator = Paginator(posts_with_accounts, 5)
            page_number = request.GET.get('page')
            try:
                posts_with_accounts = paginator.page(page_number)
            except PageNotAnInteger:
                posts_with_accounts = paginator.page(1)
            except EmptyPage:
                posts_with_accounts = paginator.page(paginator.num_pages)

            posts_data = []
            for post in posts_with_accounts:
                tags = list(Tag.objects.filter(post=post).values('id', 'tag'))
                comment_count = Comment.objects.filter(post=post).count()
                glows_count = Glow.objects.filter(post=post).count()
                photos = list(Photo.objects.filter(post=post).values())
                post_data = {
                    'id': post.id,
                    'account': {
                        'id': post.account.id,
                        'firstname': post.account.firstname,
                        'profile_photo': post.account.profile_photo,
                        'username': post.account.auth_user.username
                    },
                    'caption': post.caption,
                    'dateTime': post.dateTime.isoformat(),
                    'time_ago': time_ago(post.dateTime),
                    'tags': tags,
                    'comment_count': comment_count,
                    'glows_count': glows_count,
                    'photos': photos
                }
                posts_data.append(post_data)

            return JsonResponse({'status': 'success', 'posts': posts_data})
        except Exception as e:
            print(f"Error fetching posts: {e}")
            return JsonResponse({'status': 'error', 'message': str(e)})

def fetchNewUsers(request):
    try:
        date_joined_gt = timezone.make_aware(timezone.datetime(2024, 5, 15)) #make_aware is required if you filter date without a timezone
        users = User.objects.filter(date_joined__gt=date_joined_gt).select_related('account').order_by('-date_joined').values(
            'account__profile_photo',
            'username',
            'account__firstname',
            'account__lastname',
        )[:25]

        accounts = list(users)

        return JsonResponse({'status': 'success', 'accounts': accounts})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})


def time_ago(post_datetime):
    now = datetime.now(pytz.utc)
    time_diff = now - post_datetime

    if time_diff.total_seconds() < 60:
        return "• Just now"
    elif time_diff.total_seconds() < 3600:
        minutes = int(time_diff.total_seconds() / 60)
        return f"• {minutes} minute{'s' if minutes != 1 else ''} ago"
    elif time_diff.total_seconds() < 86400:
        hours = int(time_diff.total_seconds() / 3600)
        return f"• {hours} hour{'s' if hours != 1 else ''} ago"
    elif time_diff.total_seconds() < 604800:
        days = int(time_diff.total_seconds() / 86400)
        return f"• {days} day{'s' if days != 1 else ''} ago"
    elif time_diff.total_seconds() < 2592000:
        weeks = int(time_diff.total_seconds() / 604800)
        return f"• {weeks} week{'s' if weeks != 1 else ''} ago"
    elif time_diff.total_seconds() < 31536000:
        months = int(time_diff.total_seconds() / 2592000)
        return f"• {months} month{'s' if months != 1 else ''} ago"
    else:
        years = int(time_diff.total_seconds() / 31536000)
        return f"•{years} year{'s' if years != 1 else ''} ago"


def NotifDate(post_datetime):
    now = datetime.now(pytz.utc)
    time_diff = now - post_datetime

    if time_diff.total_seconds() < 60:
        return "Just now"
    elif time_diff.total_seconds() < 3600:
        minutes = int(time_diff.total_seconds() / 60)
        return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
    elif time_diff.total_seconds() < 86400:
        hours = int(time_diff.total_seconds() / 3600)
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    elif time_diff.total_seconds() < 604800:
        days = int(time_diff.total_seconds() / 86400)
        return f"{days} day{'s' if days != 1 else ''} ago"
    elif time_diff.total_seconds() < 2592000:
        weeks = int(time_diff.total_seconds() / 604800)
        return f"{weeks} week{'s' if weeks != 1 else ''} ago"
    elif time_diff.total_seconds() < 31536000:
        months = int(time_diff.total_seconds() / 2592000)
        return f"{months} month{'s' if months != 1 else ''} ago"
    else:
        years = int(time_diff.total_seconds() / 31536000)
        return f"{years} year{'s' if years != 1 else ''} ago"


def UserProfile(request, id):
    otherAccount = Account.objects.get(id=id)
    accID = Account.objects.get(auth_user=request.user)
    randomAccId = User.objects.get(id=otherAccount.auth_user.id)

    friendship_is_pending = Friend.objects.filter(user=accID, friend=otherAccount, status='pending').exists() or \
                            Friend.objects.filter(user=otherAccount, friend=accID, status='pending').exists()

    friendship_is_friends = Friend.objects.filter(user=accID, friend=otherAccount, status='Friends').exists() or \
                            Friend.objects.filter(user=otherAccount, friend=accID, status='Friends').exists()

    notif_data, unread_notifications_count = fetchNotif(request)
    showfriends = showFriends(request)
    hashtags = showTags(request)
    audience = getAudience(request)
    search = searchResults(request)
    accountInfo = getAccountInfo(request)
    randomUserFriends = showRandomUsers_Friends(request, randomAccId)
    glowCountOfPosts = 0

    posts = Post.objects.filter(account=otherAccount).order_by('-dateTime')
    posts_with_photos = {}
    posts_without_photos = {}
    totalGlows = 0
    total_photos_count = 0
    unique_acc_who_glowed = {}

    for post in posts:
        photos = Photo.objects.filter(post=post)
        glows = Glow.objects.filter(post=post).order_by('-timestamp')
        comments = Comment.objects.filter(post=post)
        totalPostGlows = Glow.objects.filter(post=post).count()

        totalGlows += totalPostGlows

        for glow in glows:
            unique_acc_who_glowed[glow.account.id] = [
                glow.account.firstname,
                glow.account.lastname,
                glow.account.profile_photo,
                glow.timestamp,
            ]

        post_info = {
            'totalPhotos': photos.count(),
            'time_ago': time_ago(post.dateTime),
            'glows_count': glows.count(),
            'comments_count': comments.count(),
        }

        if photos.exists():
            total_photos_count += photos.count()
            posts_with_photos[post] = {
                **post_info,
                'photos': photos,
            }
        else:
            posts_without_photos[post] = post_info

    context = {
        'randomaccount': otherAccount,
        'friendship_is_pending': friendship_is_pending,
        'friendship_is_friends': friendship_is_friends,
        'unread_count': unread_notifications_count,
        'notifications': notif_data,
        'random_accountInfo': randomAccId,
        'accountInfo': accountInfo,
        'friends': showfriends,
        'hashtags': hashtags,
        'search_results': search.get('results', []),
        'audienceInfo': audience,
        'posts': {
            'posts_with_photos': posts_with_photos,
            'posts_without_photos': posts_without_photos,
        },
        'randomUserFriends': randomUserFriends,
        'totalGlows': totalGlows,
        'total_photos_count': total_photos_count,
        'unique_acc_who_glowed': unique_acc_who_glowed,
    }

    return render(request, 'user-profile.html', context)


@csrf_exempt
def AddFriend(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = data.get("user")
        friend = data.get("friend")
        FriendStatus = "pending"

        userID = User.objects.get(pk=user)
        accID = Account.objects.get(auth_user=userID)
        friendID = Account.objects.get(pk=friend)

        new_friendrequest = Friend.objects.create(
                user = accID,
                friend = friendID,
                status = FriendStatus
            )

        NotifStatus = "Unread"

        Notification.objects.create(
            content = accID.firstname + " " + accID.lastname + " "  + "sent you a friend request",
            status = NotifStatus,
            friend_request = new_friendrequest
        )

        return JsonResponse({"status": "success", "message": "Successfull"})
    else:
        return JsonResponse({"status": "error"})


def randomProfile(request, id):
    if request.user.is_authenticated:
        otherAccount = Account.objects.get(id=id)
        accID = Account.objects.get(auth_user=request.user)
        randomAccId = User.objects.get(id=otherAccount.auth_user.id)

        friendship_is_pending = Friend.objects.filter(user=accID, friend=otherAccount, status='pending').exists() or \
                                Friend.objects.filter(user=otherAccount, friend=accID, status='pending').exists()

        friendship_is_friends = Friend.objects.filter(user=accID, friend=otherAccount, status='Friends').exists() or \
                                Friend.objects.filter(user=otherAccount, friend=accID, status='Friends').exists()

        notif_data, unread_notifications_count = fetchNotif(request)
        showfriends = showFriends(request)
        hashtags = showTags(request)
        audience = getAudience(request)
        search = searchResults(request)
        accountInfo = getAccountInfo(request)
        randomUserFriends = showRandomUsers_Friends(request, randomAccId)
        glowCountOfPosts = 0

        posts = Post.objects.filter(account=otherAccount).order_by('-dateTime')
        posts_with_photos = {}
        posts_without_photos = {}
        totalGlows = 0
        total_photos_count = 0
        unique_acc_who_glowed = {}

        for post in posts:
            photos = Photo.objects.filter(post=post)
            glows = Glow.objects.filter(post=post).order_by('-timestamp')
            comments = Comment.objects.filter(post=post)
            totalPostGlows = Glow.objects.filter(post=post).count()

            totalGlows += totalPostGlows

            for glow in glows:
                unique_acc_who_glowed[glow.account.id] = [
                    glow.account.firstname,
                    glow.account.lastname,
                    glow.account.profile_photo,
                    glow.timestamp,
                ]

            post_info = {
                'totalPhotos': photos.count(),
                'time_ago': time_ago(post.dateTime),
                'glows_count': glows.count(),
                'comments_count': comments.count(),
            }

            if photos.exists():
                total_photos_count += photos.count()
                posts_with_photos[post] = {
                    **post_info,
                    'photos': photos,
                }
            else:
                posts_without_photos[post] = post_info

        context = {
            'randomaccount': otherAccount,
            'friendship_is_pending': friendship_is_pending,
            'friendship_is_friends': friendship_is_friends,
            'unread_count': unread_notifications_count,
            'notifications': notif_data,
            'random_accountInfo': randomAccId,
            'accountInfo': accountInfo,
            'friends': showfriends,
            'hashtags': hashtags,
            'search_results': search.get('results', []),
            'audienceInfo': audience,
            'posts': {
                'posts_with_photos': posts_with_photos,
                'posts_without_photos': posts_without_photos,
            },
            'randomUserFriends': randomUserFriends,
            'totalGlows': totalGlows,
            'total_photos_count': total_photos_count,
            'unique_acc_who_glowed': unique_acc_who_glowed,
        }

        return render(request, 'random-profile.html', context)
    else:
        otherAccount = Account.objects.get(id=id)
        randomAccId = User.objects.get(id=otherAccount.auth_user.id)

        showfriends = showFriends(request)
        hashtags = showTags(request)
        audience = getAudience(request)
        accountInfo = getAccountInfo(request)
        randomUserFriends = showRandomUsers_Friends(request, randomAccId)
        glowCountOfPosts = 0

        posts = Post.objects.filter(account=otherAccount).order_by('-dateTime')
        posts_with_photos = {}
        posts_without_photos = {}
        totalGlows = 0
        total_photos_count = 0
        unique_acc_who_glowed = {}

        for post in posts:
            photos = Photo.objects.filter(post=post)
            glows = Glow.objects.filter(post=post).order_by('-timestamp')
            comments = Comment.objects.filter(post=post)
            totalPostGlows = Glow.objects.filter(post=post).count()

            totalGlows += totalPostGlows

            for glow in glows:
                unique_acc_who_glowed[glow.account.id] = [
                    glow.account.firstname,
                    glow.account.lastname,
                    glow.account.profile_photo,
                    glow.timestamp,
                ]

            post_info = {
                'totalPhotos': photos.count(),
                'time_ago': time_ago(post.dateTime),
                'glows_count': glows.count(),
                'comments_count': comments.count(),
            }

            if photos.exists():
                total_photos_count += photos.count()
                posts_with_photos[post] = {
                    **post_info, #copiees all key value pairs of post_info from above
                    'photos': photos,
                }
            else:
                posts_without_photos[post] = post_info

        context = {
            'randomaccount': otherAccount,
            'accountInfo': accountInfo,
            'friends': showfriends,
            'hashtags': hashtags,
            'audienceInfo': audience,
            'posts': {
                'posts_with_photos': posts_with_photos,
                'posts_without_photos': posts_without_photos,
            },
            'totalGlows': totalGlows,
            'total_photos_count': total_photos_count,
            'randomUserFriends': randomUserFriends,
            'unique_acc_who_glowed': unique_acc_who_glowed,
        }

        return render(request, 'random-profile_guest.html', context)




'''
def FetchFriendsPosts(request):
    if request.user.is_authenticated:
        try:
            user_account = Account.objects.get(auth_user=request.user)
            friends = Friend.objects.filter(
                (Q(user=user_account) | Q(friend=user_account)) & Q(status='Friends')
            ).select_related('user', 'friend')
            friend_accounts = {friend.user for friend in friends if friend.user != user_account}
            friend_accounts.update({friend.friend for friend in friends if friend.friend != user_account})

            posts_data = []
            for friend_account in friend_accounts:
                posts = Post.objects.filter(account=friend_account).order_by('-dateTime').select_related('account')

                for post in posts:
                    tags = list(Tag.objects.filter(post=post).values('id', 'tag'))
                    comment_count = Comment.objects.filter(post=post).count()
                    glows_count = Glow.objects.filter(post=post).count()
                    has_liked = Glow.objects.filter(post=post, account=user_account).exists()
                    photos = list(Photo.objects.filter(post=post).values())

                    post_data = {
                        'id': post.id,
                        'account': {
                            'id': post.account.id,
                            'firstname': post.account.firstname,
                            'profile_photo': post.account.profile_photo,
                            'username': post.account.auth_user.username
                        },
                        'caption': post.caption,
                        'dateTime': post.dateTime.isoformat(),
                        'time_ago': time_ago(post.dateTime),
                        'tags': tags,
                        'comment_count': comment_count,
                        'glows_count': glows_count,
                        'has_liked': has_liked,
                        'photos': photos
                    }

                    posts_data.append(post_data)

            return JsonResponse({'status': 'success', 'posts': posts_data})
        except Exception as e:
            print(f"Error fetching posts: {e}")
            return JsonResponse({'status': 'error', 'message': str(e)})
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated'})

'''

def FetchPosts(request):
    if request.user.is_authenticated:
        accID = Account.objects.all()
        try:
            accounts = Account.objects.all()
            posts_with_accounts = []

            for account in accounts:
                posts = Post.objects.filter(account=account)
                posts_with_accounts.extend(posts)

            for post in posts_with_accounts:
                post.dateTime = timezone.localtime(post.dateTime)

            posts_with_accounts.sort(key=lambda x: x.dateTime, reverse=True)

            posts_with_photos = {}
            for post in posts_with_accounts:
                post_photos = Photo.objects.filter(post=post)
                posts_with_photos[post] = post_photos

            for post in posts_with_accounts:
                post.tags.set(Tag.objects.filter(post=post))

            for post in posts_with_accounts:
                post.time_ago = time_ago(post.dateTime)

            for post in posts_with_accounts:
                post.comment_count = Comment.objects.filter(post=post).count()

            for post in posts_with_accounts:
                post.glows_count = Glow.objects.filter(post=post).count()

            for post in posts_with_accounts:
                post.has_liked = Glow.objects.filter(post=post, account=accID).exists()

            return {'accounts': accounts, 'posts_with_photos': posts_with_photos, 'posts': posts_with_accounts}
        except Exception as e:
            print(f"Error fetching posts: {e}")
            return {'accounts': [], 'posts_with_photos': {}, 'posts': []}
    else:
        return {'accounts': [], 'posts_with_photos': {}, 'posts': []}
'''

def FetchUserPosts(request):
    if request.user.is_authenticated:
        try:
            posts_with_accounts = Post.objects.all().order_by('-dateTime')

            posts_with_photos = []
            for post in posts_with_accounts:
                post.dateTime = timezone.localtime(post.dateTime)
                post.time_ago = time_ago(post.dateTime)
                post.comment_count = Comment.objects.filter(post=post).count()
                post.glows_count = Glow.objects.filter(post=post).count()
                post.has_liked = Glow.objects.filter(post=post).exists()

                tags = Tag.objects.filter(post=post)
                post_tags = [{'id': tag.id, 'tag': tag.tag} for tag in tags]

                post_photos = list(Photo.objects.filter(post=post).values('link'))
                posts_with_photos.append({
                    'id': post.id,
                    'account': {
                        'id': post.account.id,
                        'firstname': post.account.firstname,
                        'username': post.account.username,
                        'profile_photo': post.account.profile_photo.url,
                    },
                    'photos': post_photos,
                    'caption': post.caption,
                    'tags': post_tags,
                    'time_ago': post.time_ago,
                    'comment_count': post.comment_count,
                    'glows_count': post.glows_count,
                    'has_liked': post.has_liked,
                })

            return JsonResponse({'status': 'success', 'posts': posts_with_photos})
        except Exception as e:
            print(f"Error fetching posts: {e}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated'}, status=401)

    '''

def Fetch_Random_User_Posts(request, id):
    if request.user.is_authenticated:
        try:
            accID = Account.objects.get(auth_user=id)
            posts_with_accounts = Post.objects.filter(account=accID).order_by('-dateTime')

            posts_with_photos = {}
            for post in posts_with_accounts:
                post.dateTime = timezone.localtime(post.dateTime)
                post.time_ago = time_ago(post.dateTime)
                post.comment_count = Comment.objects.filter(post=post).count()
                post.glows_count = Glow.objects.filter(post=post).count()
                post.has_liked = Glow.objects.filter(post=post, account=accID).exists()
                post.tags.set(Tag.objects.filter(post=post))

                post_photos = Photo.objects.filter(post=post)
                posts_with_photos[post] = post_photos

            return {'posts_with_photos': posts_with_photos, 'posts': posts_with_accounts}
        except Exception as e:
            print(f"Error fetching posts: {e}")
            return {'posts_with_photos': {}, 'posts': []}
    else:
        return {'posts_with_photos': {}, 'posts': []}



def fetchNotif(request):
    if request.user.is_authenticated:
        try:
            accID = Account.objects.get(auth_user=request.user)
            friend_requests = Friend.objects.filter(friend=accID)
            friend_acceptances = Friend.objects.filter(user=accID)

            friend_request_notifications = Notification.objects.filter(Q(friend_request__in=friend_requests) & Q(status="Unread"))
            friend_acceptance_notifications = Notification.objects.filter(friend_request__in=friend_acceptances, status="confirmed")

            all_notifications = list(friend_request_notifications) + list(friend_acceptance_notifications)
            unread_notifications_count = len(all_notifications)

            notif_data = []

            for notif in all_notifications:
                friend = notif.friend_request
                date_friend_request = friend.date_friend_request
                time_ago_str = NotifDate(date_friend_request)

                if friend.friend == accID:
                    friend_user = friend.user
                else:
                    friend_user = friend.friend

                notif_data.append((
                    notif.id,
                    notif.content,
                    time_ago_str,
                    friend.id,
                    friend.status,
                    friend_user.profile_photo,
                ))

            notif_data.sort(key=lambda x: x[3], reverse=True)

            return notif_data, unread_notifications_count
        except Account.DoesNotExist:
            return None, 0
        except Friend.DoesNotExist:
            return None, 0
    else:
        return None, 0



@csrf_exempt
def ConfirmFriend(request):
    if request.user.is_authenticated:
        accID = Account.objects.get(auth_user=request.user)

        if request.method == 'POST':
            data = json.loads(request.body)
            notifID = data.get("NotifId")
            friend_requestID = data.get("friend_requestID")

            confirmFriend = Friend.objects.get(id=friend_requestID)
            confirmFriend.status = "Friends"
            confirmFriend.save()

            Notification.objects.create(
                content = accID.firstname + " " + accID.lastname + " "  + "accepted your friend request",
                status = "confirmed",
                friend_request = confirmFriend
            )

            return JsonResponse({"status": "success", "message": "Successfull"})
        else:
            return JsonResponse({"status": "error"})
    else:
            return None


def getCommentPost(request, id):
    try:
        post = Post.objects.get(id=id)
        photos = Photo.objects.filter(post=post)
        accountInfo = post.account
        comments = Comment.objects.filter(post=post)

        comments_data = []

        post_data = {
            'id': post.id,
            'caption': post.caption,
            'dateTime': post.dateTime
        }

        for comment in comments:
            dateTime = time_ago(comment.dateTime)
            comments_data.append({
                'postID': comment.post.id,
                'content': comment.content,
                'dateTime':  dateTime,
                'profile_photo': comment.account.profile_photo,
                'firstname': comment.account.firstname,
                'lastname': comment.account.lastname
            })

        account_data = {
            'firstname': accountInfo.firstname,
            'lastname': accountInfo.lastname,
            'profile_photo': accountInfo.profile_photo
        }

        photo_data = [{
            'id': photo.id,
            'url': photo.link,

        } for photo in photos]

        response_data = {
            'status': 'success',
            'message': 'Successful',
            'post': post_data,
            'photos': photo_data,
            'accountInfo': account_data,
            'comments': comments_data,
        }

        return JsonResponse(response_data, encoder=DjangoJSONEncoder)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})


@csrf_exempt
def FetchComments(request, postId):
    if request.user.is_authenticated:
        accID = Account.objects.filter(auth_user=request.user)
        try:
            posts = Post.objects.get(id=postId)
            comments = Comment.objects.filter(post=posts)

            comments_data = []
            for comment in comments:
                dateTime = time_ago(comment.dateTime)
                comments_data.append({
                    'postID': comment.post.id,
                    'content': comment.content,
                    'dateTime':  dateTime,
                    'profile_photo': comment.account.profile_photo,
                    'firstname': comment.account.firstname,
                    'lastname': comment.account.lastname
                })

            response_data = {
                'status': 'success',
                'message': 'Successful',
                'comments': comments_data,
            }

            return JsonResponse(response_data, encoder=DjangoJSONEncoder)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    else:
        return JsonResponse({"status": "error", "message": "User is not authenticated"})

@csrf_exempt
def sendComment(request):
    if request.user.is_authenticated:
        accID = Account.objects.get(auth_user=request.user)

        try:
            data = json.loads(request.body)
            accIDUser = data.get("accID")
            comment = data.get("comment")
            dateTime = data.get("dateTime")
            postIDUser = data.get("postID")

            postID = Post.objects.get(id=postIDUser)
            accIDUser2 = Account.objects.get(id=accIDUser)

            newComment = Comment.objects.create(
                content = comment,
                dateTime = dateTime,
                post = postID,
                account = accIDUser2
            )

            response = {
                'status': "success",
                'comment': newComment.content,
                'dateTime': newComment.dateTime,
                'post': newComment.post.id,
                'account': newComment.account.id
            }

            return JsonResponse(response, encoder=DjangoJSONEncoder)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    else:
        return JsonResponse({"status": "error", "message": "User is not authenticated"})



def showFriends(request):
    if request.user.is_authenticated:
        try:
            accID = Account.objects.get(auth_user=request.user)
            friends = Friend.objects.filter((Q(friend=accID) | Q(user=accID)) & Q(status="Friends"))
            #this is a query
            #kung mag query ka need paka mag loop then just append kay d pwde nga sa query ka mo kuha ug info
            #Q means "WHERE IN" in SQL
            #this is a query
            #kung mag query ka, need paka mag loop, append daun kay d pwde nga sa query ka mo kuha ug info

            friendsInfo = []
            for friend in friends:
                if friend.user == accID:
                    friend_account = friend.friend
                else:
                    friend_account = friend.user

                friendsInfo.append({
                    'firstname': friend_account.firstname,
                    'lastname': friend_account.lastname,
                    'profile_photo': friend_account.profile_photo,
                    'date_became_friends': friend.date_became_friends,
                    'id': friend_account.id
                })

                friendsInfo.sort(key=lambda x: x['date_became_friends'], reverse=True)
            context = {
                'friendsInfo': friendsInfo
            }

            return context
        except Account.DoesNotExist:
            return None
    else:
        return None


def showRandomUsers_Friends(request, id):
    if request.user.is_authenticated:
        try:
            accID = Account.objects.get(auth_user=id)
            friends = Friend.objects.filter((Q(friend=accID) | Q(user=accID)) & Q(status="Friends")).order_by('date_became_friends').reverse()[:6]
            totalfriends = Friend.objects.filter((Q(friend=accID) | Q(user=accID)) & Q(status="Friends")).count()


            friendsInfo = []
            for friend in friends:
                if friend.user == accID:
                    friend_account = friend.friend
                else:
                    friend_account = friend.user

                friendsInfo.append({
                    'firstname': friend_account.firstname,
                    'lastname': friend_account.lastname,
                    'profile_photo': friend_account.profile_photo,
                    'date_became_friends': friend.date_became_friends,
                    'id': friend_account.id
                })

            context = {
                'totalfriends': totalfriends,
                'friendsInfo': friendsInfo
            }

            return context
        except Account.DoesNotExist:
            return None
    else:
        accID = Account.objects.get(auth_user=id)
        friends = Friend.objects.filter((Q(friend=accID) | Q(user=accID)) & Q(status="Friends")).order_by('date_became_friends').reverse()[:6]
        totalfriends = Friend.objects.filter((Q(friend=accID) | Q(user=accID)) & Q(status="Friends")).count()

        friendsInfo = []
        for friend in friends:
            if friend.user == accID:
                friend_account = friend.friend
            else:
                friend_account = friend.user

            friendsInfo.append({
                'firstname': friend_account.firstname,
                'lastname': friend_account.lastname,
                'profile_photo': friend_account.profile_photo,
                'date_became_friends': friend.date_became_friends,
                'id': friend_account.id
            })

        context = {
            'totalfriends': totalfriends,
            'friendsInfo': friendsInfo
        }
        return context



def showTags(request):
    if request.user.is_authenticated:
        try:
            #annotate function provided by Django's ORM to add a new field num_posts to each tag object
            tags_with_count = Tag.objects.annotate(num_posts=Count('post'))

            distinct_tags = {}
            for tag in tags_with_count:
                distinct_tags[tag.tag] = {
                    'tag_object': tag,
                    'post_count': tag.num_posts
                }


            return list(distinct_tags.values())
        except Tag.DoesNotExist:
            return None
    else:
        return None


def randomTags(request, id):
    if request.user.is_authenticated:
        accountInfo = getAccountInfo(request)
        showfriends = showFriends(request)
        hashtags = showTags(request)
        notif_data, unread_notifications_count = fetchNotif(request)
        search = searchResults(request)

        tag = get_object_or_404(Tag, id=id)
        posts = tag.post.all()
        posts = posts.order_by('-dateTime')

        posts_with_photos = {}
        for post in posts:
            post_photos = Photo.objects.filter(post=post)
            posts_with_photos[post] = post_photos

        for post in posts:
            post.time_ago = time_ago(post.dateTime)

        for post in posts:
            post.tags.set(Tag.objects.filter(post=post))

        for post in posts:
            post.comment_count = Comment.objects.filter(post=post).count()

        context = {
            'tag': tag,
            'posts': posts,
            'posts_with_photos': posts_with_photos,
            'accountInfo': accountInfo,
            'friends': showfriends,
            'hashtags': hashtags,
            'notifications': notif_data,
            'unread_count': unread_notifications_count,
            'search_results': search.get('results', [])
            }
        return render(request, 'tags.html', context)
    else:
        return redirect('dashboard')


def randomPosts(request, id):
    if request.user.is_authenticated:
        accountInfo = getAccountInfo(request)
        showfriends = showFriends(request)
        hashtags = showTags(request)
        notif_data, unread_notifications_count = fetchNotif(request)
        search = searchResults(request)

        post = get_object_or_404(Post, id=id)
        post.time_ago = time_ago(post.dateTime)
        post.comment_count = Comment.objects.filter(post=post).count()
        post_photos = Photo.objects.filter(post=post)
        tags = post.tags.all()

        context = {
            'post': post,
            'post_photos': post_photos,
            'tags': tags,
            'accountInfo': accountInfo,
            'friends': showfriends,
            'hashtags': hashtags,
            'notifications': notif_data,
            'unread_count': unread_notifications_count,
            'search_results': search.get('results', [])
        }
        return render(request, 'post-results.html', context)
    else:
        return redirect('dashboard')

@csrf_exempt
def sendLike(request):

    if request.user.is_authenticated:
        accID = Account.objects.get(auth_user=request.user)
        if request.method == 'POST':
            data = json.loads(request.body)
            accID_json = data.get("accID")
            postID_json = data.get("postID")

            accID_db = get_object_or_404(Account, id=accID.id)
            postID_db = get_object_or_404(Post, id=postID_json)

            if not Glow.objects.filter(account=accID_db, post=postID_db).exists():
                Glow.objects.create(
                    account=accID_db,
                    post=postID_db,
                )
                return JsonResponse({"status": "success", "message": "Successfully liked."})
            else:
                return JsonResponse({"status": "success", "message": "Already liked."})
        else:
            return JsonResponse({"status": "error", "message": "Invalid method."})
    else:
        return JsonResponse({"status": "error", "message": "Authentication required."}, status=401)


@csrf_exempt
def sendUnlike(request):
    if request.user.is_authenticated:
        accID = Account.objects.get(auth_user=request.user)
        if request.method == 'POST':
            data = json.loads(request.body)
            accID_json = data.get("accID")
            postID_json = data.get("postID")

            accID_db = get_object_or_404(Account, id=accID.id)
            postID_db = get_object_or_404(Post, id=postID_json)

            glow_entry = Glow.objects.filter(account=accID_db, post=postID_db)
            if glow_entry.exists():
                glow_entry.delete()
                return JsonResponse({"status": "success", "message": "Successfully unliked."})
            else:
                return JsonResponse({"status": "error", "message": "No like found to remove."})
        else:
            return JsonResponse({"status": "error", "message": "Invalid method."})
    else:
        return JsonResponse({"status": "error", "message": "Authentication required."}, status=401)

@csrf_exempt
def getLikes(request, postId):
    if request.user.is_authenticated:
        try:
            post = Post.objects.get(id=postId)
            glow_count = Glow.objects.filter(post=post).count()
            response_data = {
                'post_id': postId,
                'glow_count': glow_count
            }
            return JsonResponse(response_data)
        except Post.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Post does not exist"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    else:
        return JsonResponse({"status": "error", "message": "User is not authenticated"})


@csrf_exempt
def editProfile(request, id):
    if request.user.is_authenticated:
        if request.method == 'POST':
            try:
                data = json.loads(request.body)
                firstname = data.get("firstname")
                lastname = data.get("lastname")
                username = data.get("username")
                birthday = data.get("birthday")
                bio = data.get("bio")
                cover_photo = data.get("cover_photo")
                profile_photo = data.get("profile_photo")

                user = Account.objects.get(id=id)
                auth_user = User.objects.get(id=user.auth_user_id)

                user.firstname = firstname
                user.lastname = lastname
                auth_user.username = username
                parsed_birthday = datetime.strptime(birthday, "%Y-%m-%d").date()
                user.Birthday = parsed_birthday
                user.bio = bio

                if cover_photo:
                    cover_photo_name = cover_photo.get("name")
                    cphoto_base64_data = cover_photo.get("origurl").split(",")[1]
                    if cphoto_base64_data:
                        image_data = base64.b64decode(cphoto_base64_data)
                        content_file = ContentFile(image_data, name=cover_photo_name)
                        imgkit = ImagekitClient(content_file)
                        upload_result = imgkit.upload_media_file()
                        if upload_result.get("url"):
                            cphoto_link = upload_result["url"]
                            user.cover_photo = cphoto_link
                        else:
                            return JsonResponse({"status": "error", "message": "Failed to upload cover photo"})
                    else:
                        return JsonResponse({"status": "error", "message": "Invalid cover photo data"})

                if profile_photo:
                    profile_photo_name = profile_photo.get("name")
                    pphoto_base64_data = profile_photo.get("origurl").split(",")[1]
                    if pphoto_base64_data:
                        image_data = base64.b64decode(pphoto_base64_data)
                        content_file = ContentFile(image_data, name=profile_photo_name)
                        imgkit = ImagekitClient(content_file)
                        upload_result = imgkit.upload_media_file()
                        if upload_result.get("url"):
                            photo_link = upload_result["url"]
                            user.profile_photo = photo_link
                        else:
                            return JsonResponse({"status": "error", "message": "Failed to upload profile photo"})
                    else:
                        return JsonResponse({"status": "error", "message": "Invalid profile photo data"})

                user.save()
                auth_user.save()

                return JsonResponse({"status": "success", "message": "Successfully updated profile!"})
            except Exception as e:
                return JsonResponse({"status": "error", "message": str(e)})
        else:
            return JsonResponse({"status": "error", "message": "Only POST method is accepted"})
    else:
        return JsonResponse({"status": "error", "message": "User is not authenticated"})


def searchResults(request):
    query = request.GET.get('query', '')
    if query:
        accounts = Account.objects.filter(
            Q(firstname__icontains=query) | Q(lastname__icontains=query)
        )
        posts = Post.objects.filter(
            Q(tags__tag__icontains=query)
        ).distinct()

        results = []

        for account in accounts:
            results.append({
                'type': 'account',
                'id': account.id,
                'firstname': account.firstname,
                'lastname': account.lastname,
                'profile': account.profile_photo,
            })

        for post in posts:
            results.append({
                'type': 'post',
                'id': post.id,
                'caption': post.caption,
                'account': f"{post.account.firstname} {post.account.lastname}",
                'profile': post.account.profile_photo,
            })

            for tag in post.tags.all():
                results.append({
                    'type': 'tag',
                    'id': tag.id,
                    'tag': tag.tag,
                    'post_id': post.id,
                })

        if results:
            response_data = {
                'status': 'success',
                'message': 'Success',
                'results': results,
            }
        else:
            response_data = {"status": "error", "message": "No results found"}

        return JsonResponse(response_data, encoder=DjangoJSONEncoder)
    else:
        response_data = {"status": "error", "message": "No query provided"}
        return JsonResponse(response_data)



class CustomPasswordResetView(PasswordResetView):
    template_name = 'account/password_reset.html'

    def post(self, request, *args, **kwargs):
        email = request.POST.get('email')

        User = get_user_model()
        if not User.objects.filter(email=email).exists():
            messages.error(request, "This email is not associated with any account.")
            return self.get(request, *args, **kwargs)

        return super().post(request, *args, **kwargs)

class CustomPasswordResetDoneView(PasswordResetDoneView):
    template_name = 'account/password_reset_done.html'

class CustomPasswordResetFromKeyView(PasswordResetFromKeyView):
    template_name = 'account/password_reset_from_key.html'

class CustomPasswordResetFromKeyDoneView(PasswordResetFromKeyDoneView):
    template_name = 'account/password_reset_from_key_done.html'


def generate_session_id():
    return secrets.token_hex(16)


def game_list(request):
    games = [
        {"id": "1215", "name": "DG Club", "image": "images/games/DGM_DG_CLUB.jpg", "game_type": "slots", "provider": "1"},
        {"id": "1358", "name": "Eggsplosion", "image": "images/games/DGM_EGGSPLOSION.jpg", "game_type": "slots", "provider": "1"},
        {"id": "1192", "name": "Shinobi Wars", "image": "images/games/DGM_SHINOBI_WARS.jpg", "game_type": "slots", "provider": "1"},
        {"id": "1193", "name": "Saiyan Warriors", "image": "images/games/DGM_SAIYAN_WARRIORS.jpg", "game_type": "slots", "provider": "1"},
        {"id": "1234", "name": "Demon Train Scratch Card", "image": "images/games/DGM_DEMON_TRAIN_SCRATCH_CARD.jpg", "game_type": "table_games", "provider": "1"},
        {"id": "1121", "name": "Mines 88", "image": "images/games/1121.jpg", "game_type": "", "provider": "2"},
        {"id": "1328", "name": "Hi-Lo 98", "image": "images/games/HSG_HI_LO_98.jpg", "game_type": "", "provider": "2"},
        {"id": "1067", "name": "Wanted Dead or a Wild 96", "image": "images/games/1067.jpg", "game_type": "", "provider": "2"},
        {"id": "1001", "name": "SCRATCH! Platinum", "image": "images/games/1001.jpg", "game_type": "", "provider": "2"},
        {"id": "1321", "name": "Wheel 99", "image": "images/games/HSG_WHEEL_99.jpg", "game_type": "", "provider": "2"},
        {"id": "1446", "name": "Baccarat 98", "image": "images/games/HSG_BACCARAT_98.jpg", "game_type": "", "provider": "2"},
    ]
    return render(request, 'game_list.html', {'games': games})



def game_launch(request):
    if request.method == 'GET':
        api_key = request.GET.get('api_key', 'rMrNJRwYKow1ot13')
        session_id = generate_session_id()
        provider = request.GET.get('provider')  # This might be None
        game_type = request.GET.get('game_type', 'slots')
        game_id = request.GET.get('game_id')
        platform = request.GET.get('platform', 'desktop')
        language = request.GET.get('language', 'en')
        amount_type = request.GET.get('amount_type', 'fun')
        lobby_url = request.GET.get('lobby_url', '')
        deposit_url = request.GET.get('deposit_url', '')
        game_name = request.GET.get('game_name')

        context = {
            "id": request.GET.get('context_id', '0'),
            "username": request.GET.get('context_username', 'fun_player'),
            "country": request.GET.get('context_country', 'PH'),
            "currency": request.GET.get('context_currency', 'PHP')
        }

        headers = {
            "Content-Type": "application/json"
        }

        api_url = ""
        payload = {}
        launch_url = ""  # Initialize launch_url to avoid UnboundLocalError
        if provider == "1":
            api_url = "https://staging-api.dragongaming.com/v1/games/game-launch/"
            payload = {
                "api_key": api_key,
                "session_id": session_id,
                "provider": "dragongaming",
                "game_type": game_type,
                "game_id": game_id,
                "platform": platform,
                "language": language,
                "amount_type": amount_type,
                "lobby_url": lobby_url,
                "deposit_url": deposit_url,
                "context": context
            }
            response = requests.post(api_url, headers=headers, json=payload)
            response_data = response.json()
            launch_url = response_data.get("result", {}).get("launch_url", "")
            print(f"Provider 1 Response Data: {response_data}")

        # Handle Provider 2
        elif provider == "2":
            api_url = "https://static-stg.hacksawgaming.com/launcher/static-launcher.html?"
            partner = "tigergames_stagev2"
            launch_url = api_url + "language=" + language + "&channel=" + platform + "&gameid=" + game_id + "&mode=demo&token=" + session_id + "&lobbyurl=" + lobby_url + "&currency=PHP"  + "&partner=" + partner
            print(f"Provider 2 URL: {launch_url, game_name}")

        # Handle Invalid Provider
        else:
            return JsonResponse({"error": "Invalid provider"}, status=404)

        print(f"Final launch_url: {launch_url}")  # Print after assignment
        return render(request, 'game_launch.html', {'launch_url': launch_url, 'game_name' : game_name})

    return JsonResponse({"error": "Method not allowed"}, status=405)

def chat_page(request):
    return render(request, 'chat.html')


@csrf_exempt
def chat_with_gemini(request):
    if request.method == "POST":
        user_message = request.POST.get('message', '')

        if not user_message:
            return JsonResponse({'error': 'No message provided'}, status=400)


        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAjDzsgtZTFb-Lf-UqYAyD7v3VYeWsOx6A"
        headers = {
            'Content-Type': 'application/json'
        }

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": user_message}
                    ]
                }
            ]
        }

        try:

            response = requests.post(url, json=payload, headers=headers)
            response_data = response.json()
            gemini_response = (
                response_data.get('candidates', [{}])[0]
                .get('content', {})
                .get('parts', [{}])[0]
                .get('text', 'Sorry, Please Contact Glow Developer.')
            )

            return JsonResponse({'message': gemini_response})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

