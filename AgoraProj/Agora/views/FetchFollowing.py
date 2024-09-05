from ..models import *
from django.core.paginator import *
from django.http import JsonResponse
from datetime import datetime
import pytz



from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import JsonResponse
from django.db.models import Q

def FetchFollowing(request):
    if request.user.is_authenticated:
        try:
            user_account = Account.objects.get(auth_user=request.user)

            friends = Friend.objects.filter(
                Q(user=user_account, status='Friends') |
                Q(friend=user_account, status='Friends')
            )
            friend_accounts = set(friends.values_list('friend_id', flat=True)) | set(friends.values_list('user_id', flat=True))

            posts = Post.objects.filter(account__in=friend_accounts).order_by('-dateTime')
            
            paginator = Paginator(posts, 5)
            page_number = request.GET.get('page')
            try:
                posts_with_accounts = paginator.page(page_number)
            except PageNotAnInteger:
                posts_with_accounts = paginator.page(1)
            except EmptyPage:
                posts_with_accounts = paginator.page(paginator.num_pages)

            # Prepare data
            posts_data = []
            for post in posts_with_accounts:
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