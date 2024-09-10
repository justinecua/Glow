from ..models import Account  
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def capture_event(request):
    if request.method == 'POST':
        try:
            data_list = json.loads(request.body)
            
            if not isinstance(data_list, list):
                return JsonResponse({'status': 'invalid data format'}, status=400)

            for data in data_list:
                if not isinstance(data, dict):
                    continue
                
                user_id = data.get('user_id')
                event_type = data.get('type')
                status = data.get('status')
                key = data.get('key')
                timestamp = data.get('timestamp')

                if request.user.is_authenticated and request.user.id == int(user_id):
                    print(f"User {user_id} triggered a {event_type} event on key {key} at {timestamp}")

                    try:
                        account = Account.objects.get(auth_user_id=user_id)
                        
                        if event_type == 'status':
                            if status == 'offline':
                                if account.is_online: 
                                    account.is_online = False
                                    account.last_activity = timezone.now()
                                    account.save()
                            elif status == 'online':
                                if not account.is_online:  
                                    account.last_activity = timezone.now()
                                    account.is_online = True
                                    account.save()
                        else:
                            if not account.is_online:
                                account.last_activity = timezone.now()
                                account.is_online = True
                                account.save()
                    
                    except Account.DoesNotExist:
                        print(f"Account with user_id {user_id} does not exist.")
                else:
                    return JsonResponse({'status': 'unauthorized'}, status=403)

            return JsonResponse({'status': 'success'})
        except json.JSONDecodeError:
            return JsonResponse({'status': 'invalid JSON'}, status=400)
    return JsonResponse({'status': 'invalid method'}, status=400)
