import os
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AgoraProj.settings')

from imagekitio import ImageKit

imagekit = ImageKit(
    private_key=settings.IMAGEKIT_PRIVATE_KEY,
    public_key=settings.IMAGEKIT_PUBLIC_KEY,
    url_endpoint=settings.IMAGEKIT_URL_ENDPOINT
)
