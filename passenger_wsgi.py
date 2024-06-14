import os
import sys

# Add the directory containing your Django project to Python path
sys.path.insert(0, '/home/glowspac/repositories/Glow/AgoraProj')

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ['DJANGO_SETTINGS_MODULE'] = 'AgoraProj.settings'

# Import the Django application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
