from django.shortcuts import render

def settingsPage(request):
    return render(request, 'settings.html')