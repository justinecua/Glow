import json
from django.core.files.base import ContentFile
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Account
from imagekitio import ImageKit
import os
from ..helpers import ImagekitClient

# Load ImageKit credentials
imagekit = ImageKit(
    public_key=os.getenv('IMAGEKIT_PUBLIC_KEY'),
    private_key=os.getenv('IMAGEKIT_PRIVATE_KEY'),
    url_endpoint=os.getenv('IMAGEKIT_URL_ENDPOINT')
)

@csrf_exempt
def sendNewProfile(request):
    if request.method == 'POST':
        try:
            accID = request.POST.get("accID")
            content_file = request.FILES.get("profile_photo")

            acc = Account.objects.get(id=accID)

            imgkit = ImagekitClient(content_file)
            Photoresult = imgkit.upload_media_file()
            photo_link = Photoresult["url"]
            photo_link_id = Photoresult["fileId"]

            if acc.profile_photo_id_imagekit:
                imagekit.delete_file(file_id=acc.profile_photo_id_imagekit)

            acc.profile_photo = photo_link
            acc.profile_photo_id_imagekit = photo_link_id
            acc.save()

            return JsonResponse({
                "status": "success",
                "message": "Profile Updated Successfully",
                "redirect": f"/myprofile/{acc.id}"
            }, status=200)

        except Account.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Account not found."}, status=404)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method."}, status=400)
