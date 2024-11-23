from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from ..models import Post, Glow, Photo, Account
from django.db.models import Count, Exists, OuterRef
from .serializer import PostSerializer
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from django.utils import timezone

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



class SignupView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to access this API

    def post(self, request, *args, **kwargs):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password1 = data.get('password')
        password2 = data.get('confirm_password')

        if password1 != password2:
            return Response({"message": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"message": "Username is already taken."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"message": "Email is already in use."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password1,
        )
        user = authenticate(username=username, password=password1)
        if user:
            login(request, user)
            Account.objects.create(auth_user=user, is_online=True, last_activity=timezone.now())
            return Response({"message": "Signup successful!"}, status=status.HTTP_201_CREATED)
        
        return Response({"message": "Authentication failed."}, status=status.HTTP_400_BAD_REQUEST)

from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
from django.utils.timezone import now

@csrf_exempt
@api_view(['POST'])
def loginApi(request):
    """
    Login API endpoint for validating users.
    """
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return Response(
                {"status": "error", "message": "Email and Password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(email=email, password=password)
        if user:
            login(request, user)

            # Update Account model or create if it doesn't exist
            account, _ = Account.objects.get_or_create(auth_user=user)
            account.is_online = True
            account.last_activity = now()
            account.save()

            return Response(
                {
                    "status": "success",
                    "message": "Login successful",
                    "user": {
                        "email": user.email,
                        "username": user.username,
                        # Add any additional user details you wish to include
                    },
                },
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"status": "error", "message": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )
    except Exception as e:
        return Response(
            {"status": "error", "message": f"An error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

