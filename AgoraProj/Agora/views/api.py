from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from ..models import Post, Glow, Photo
from django.db.models import Count, Exists, OuterRef
from .serializer import PostSerializer

class getrandomPosts(APIView):
    def get(self, request):
        try:
            posts_query = Post.objects.annotate(
                tag_count=Count('tags'),
                comment_count=Count('comment'),
                glows_count=Count('glow'),
            ).select_related('account', 'account__auth_user')

            if request.user.is_authenticated:
                posts_query = posts_query.annotate(
                    has_liked=Exists(Glow.objects.filter(post=OuterRef('pk'), account__auth_user=request.user))
                )
            else:
                posts_query = posts_query.annotate(
                    has_liked=Exists(Glow.objects.filter(post=OuterRef('pk'), account=None))
                )

            posts_query = posts_query.order_by('-dateTime')

            paginator = PageNumberPagination()
            paginator.page_size = 7
            paginated_posts = paginator.paginate_queryset(posts_query, request)

            # Serialize posts data
            serializer = PostSerializer(paginated_posts, many=True, context={'request': request})

            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            print(f"Error fetching posts: {e}")
            return Response({'status': 'error', 'message': str(e)}, status=500)


