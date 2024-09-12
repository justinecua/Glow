from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from ..models import Account
from imagekitio import ImageKit
from dotenv import load_dotenv
import os

load_dotenv()
imagekit = ImageKit(
    public_key=os.getenv('IMAGEKIT_PUBLIC_KEY'),
    private_key=os.getenv('IMAGEKIT_PRIVATE_KEY'),
    url_endpoint=os.getenv('IMAGEKIT_URL_ENDPOINT')
)

@csrf_exempt
def sendNewProfile(request, id):
    if request.method == 'POST':
        try:
            post = Post.objects.get(id=id)
            photos = Photo.objects.filter(post=post)

            for photo in photos:
                if photo.link_id_imagekit:
                    imagekit.delete_file(file_id=photo.link_id_imagekit)
                photo.delete()

            post.delete()

            return JsonResponse({"status": "success", "message": "Post deleted successfully!"})

        except Post.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Post does not exist."}, status=404)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method."}, status=400)
