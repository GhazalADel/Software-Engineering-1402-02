from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *
import json


def home(request):
    return render(request, 'group14/home.html')


@csrf_exempt
def add_new_card(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        front = data["front"]
        is_unique = is_front_unique(front)
        if not is_unique:
            return JsonResponse({'error': 'front value is not unique'})
        back = data["back"]
        # hard code
        user_id = 1
        create_card(front,back,user_id)
        return JsonResponse({'message': 'card created successfully'})
    else:
        return JsonResponse({'error': 'only POST requests are allowed'})


@csrf_exempt
def list_cards(request):
    if request.method == 'GET':
        # hard code
        user_id = 1
        cards = fetch_cards(user_id)
        return JsonResponse(cards, safe=False)
    else:
        return JsonResponse({'error': 'only GET requests are allowed'})
