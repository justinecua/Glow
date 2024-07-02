from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.models import User
from .models import Account, Audience, Post, Photo, Video, Tag, Friend, Notification, Comment, Glow
from .helpers import ImagekitClient
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from datetime import datetime
from django.views import View
import requests
import base64
import json
import html
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

def home(request):
    return render(request, 'index.html')

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


def validatelogin(request):
    if request.method == 'POST':
        email = request.POST.get('login')
        password = request.POST.get('password')
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard') 
        else:
            messages.error(request, 'Incorrect email or password')
            return redirect('login')
    return render(request, 'account/login.html')

def check_user(request):
    if request.user.is_authenticated:
        user_exists = User.objects.filter(id=request.user.id).exists()
        account_exists = Account.objects.filter(auth_user_id=request.user.id).exists()
        is_new_user = not (user_exists and account_exists)

        return is_new_user
    else:
        return False

def signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

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
                        return redirect('dashboard')
                    else:
                        messages.error(request, "Authentication failed.")
                else:
                    messages.error(request, "Email is already in use.")
            else:
                messages.error(request, "Username is already taken.")
        else:
            messages.error(request, "Passwords do not match. Please type again.")
    
    return render(request, 'account/signup.html')

@csrf_exempt
def UploadProfile(request):
    if request.method == 'POST':
        form_data = json.loads(request.POST['data'])
        profile = request.FILES.get('default_profile_url')

        firstname = form_data.get('firstname')
        lastname = form_data.get('lastname')
        gender = form_data.get('gender')
        birthday = form_data.get('birthday')

        auth_user_id = request.user.id  

        if profile and profile.name != '../static/images/default-avatar-profile-picture-male-icon.png':
            imgkit = ImagekitClient(profile)
            result = imgkit.upload_media_file()
            profile_url = result["url"]
        else:
            profile_url = '../static/images/default-avatar-profile-picture-male-icon.png'

        Account.objects.create(
            firstname=firstname,
            lastname=lastname,
            gender=gender,
            profile_photo=profile_url,
            Birthday=birthday,
            auth_user_id=auth_user_id
        )

        return JsonResponse({"status": "success", "message": "Profile Updated successfully"})
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

Counter = 0

async def count_new_posts(post_id, uploader_id):
    global Counter
    Counter += 1

    ably = AblyRealtime("ru_QJA.LX6KeA:6pykpDiiF8i68udlvvVQ6_xn6zlL7CLBUfdFZCSbm4k")
    await ably.connection.once_async('connected')
    print('Connected')

    channel = ably.channels.get('posts')

    await channel.publish(
        'post', {
            'New_Posts': Counter,
            'Uploader_Id': uploader_id
        }    
    )

    await ably.close()
    print('Closed the connection.')
 


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

            Photo.objects.create(
                link=photo_link,  
                post=new_post,
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
        print("current Time:", currentTime)
        print("post Date:", postDate)
        
        asyncio.run(count_new_posts(new_post.id, request.user.id))   

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
        return JsonResponse({'status': 'error', 'message': 'User not authenticated'})
    

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


def UserProfile(request):
    accountInfo = getAccountInfo(request)
    audience = getAudience(request)
    notif_data, unread_notifications_count = fetchNotif(request)
    showfriends = showFriends(request)
    hashtags = showTags(request)

    posts_with_photos = {}
    posts = Post.objects.filter(account=accountInfo) 
    for post in posts:
        photos = Photo.objects.filter(post=post)
        glows = Glow.objects.filter(post=post)
        comments = Comment.objects.filter(post=post)
        posts_with_photos[post] = {
            'photos': photos,
            'time_ago': time_ago(post.dateTime),
            'glows_count': glows.count(),
            'comments_count': comments.count(),
        }

    context = {
        'accountInfo': accountInfo,
        'audienceInfo': audience,
        'notifications': notif_data,
        'unread_count': unread_notifications_count,
        'friends': showfriends,
        'hashtags': hashtags,
        'posts': {'posts_with_photos': posts_with_photos},
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

        friendship_is_pending = Friend.objects.filter(user=accID, friend=otherAccount, status='pending').exists() or \
                                Friend.objects.filter(user=otherAccount, friend=accID, status='pending').exists()
        
        friendship_is_friends = Friend.objects.filter(user=accID, friend=otherAccount, status='Friends').exists() or \
                                Friend.objects.filter(user=otherAccount, friend=accID, status='Friends').exists()
        notif_data, unread_notifications_count = fetchNotif(request)
        accountInfo = getAccountInfo(request)
        showfriends = showFriends(request)
        hashtags = showTags(request)
        search = searchResults(request)
        context = {
            'randomaccount': otherAccount,
            'friendship_is_pending': friendship_is_pending,
            'friendship_is_friends': friendship_is_friends,
            'unread_count': unread_notifications_count,
            'notifications': notif_data,
            'accountInfo': accountInfo,  
            'friends': showfriends,
            'hashtags': hashtags,
            'search_results': search.get('results', [])
        }

        return render(request, 'random-profile.html', context)
    else:
        return redirect('login')  




    
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
    if request.user.is_authenticated:
        accID = Account.objects.get(auth_user=request.user)
        try:
            post = Post.objects.get(id=id)
            photos = Photo.objects.filter(post=post)
            accountInfo = post.account

            post_data = {
                'id': post.id,
                'caption': post.caption,
                'dateTime': post.dateTime
            }

            account_data = {
                'firstname': accountInfo.firstname,
                'lastname': accountInfo.lastname,
                'profile_photo': accountInfo.profile_photo + '/tr:q-100,tr:w-42,h-42'
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
                'accountInfo': account_data
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

        if request.method == 'POST':
            data = json.loads(request.body)
            accIDUser = data.get("accID")
            comment = data.get("comment")
            dateTime = data.get("dateTime")
            postIDUser = data.get("postID")
            
            postID = Post.objects.get(id=postIDUser)
            accIDUser2 = Account.objects.get(id=accIDUser)

            Comment.objects.create(
                content = comment,
                dateTime = dateTime,
                post = postID,
                account = accIDUser2
            )

            return JsonResponse({"status": "success", "message": "Successfull"})
        else:
            return JsonResponse({"status": "error"})
    else:
            return None
    
@csrf_exempt
def FetchCommentsAsync(request, postId): 
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


def showFriends(request):
    if request.user.is_authenticated:
        try:
            accID = Account.objects.get(auth_user=request.user)
            friends = Friend.objects.filter((Q(friend=accID) | Q(user=accID)) & Q(status="Friends"))
            #this is a query
            #kung mag query ka need paka mag loop then just append kay d pwde nga sa query ka mo kuha ug info

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

from allauth.account.views import PasswordResetView, PasswordResetDoneView, PasswordResetFromKeyView, PasswordResetFromKeyDoneView

from django.contrib.auth import get_user_model
from django.contrib import messages

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
