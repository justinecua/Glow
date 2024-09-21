import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Account
from imagekitio import ImageKit
import os
from ..helpers import ImagekitClient

# ImageKit setup
imagekit = ImageKit(
    public_key=os.getenv('IMAGEKIT_PUBLIC_KEY'),
    private_key=os.getenv('IMAGEKIT_PRIVATE_KEY'),
    url_endpoint=os.getenv('IMAGEKIT_URL_ENDPOINT')
)

@csrf_exempt
def sendNewCover(request):
    if request.method == 'POST':
        try:
            accID = request.POST.get("accID")
            content_file = request.FILES.get("cover_photo")

            acc = Account.objects.get(id=accID)

            imgkit = ImagekitClient(content_file)
            Photoresult = imgkit.upload_media_file()
            photo_link = Photoresult["url"]
            photo_link_id = Photoresult["fileId"]


            if acc.cover_photo_id_imagekit:
                imagekit.delete_file(file_id=acc.cover_photo_id_imagekit)

            acc.cover_photo = photo_link
            acc.cover_photo_id_imagekit = photo_link_id
            acc.save()

            return JsonResponse({
                "status": "success",
                "message": "Cover Photo Updated Successfully",
                "redirect": f"/myprofile/{acc.id}"
            }, status=200)

        except Account.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Account not found."}, status=404)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method."}, status=400)
