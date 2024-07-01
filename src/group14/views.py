from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *
import json
import os

SESSION_FILE_PATH = 'session_data.json'

def save_session_data(cards, num):
    session_data = {
        'cards': cards,
        'num': num
    }
    with open(SESSION_FILE_PATH, 'w') as f:
        json.dump(session_data, f)
    print("Global variables saved to " + SESSION_FILE_PATH)

def load_session_data():
    if not os.path.exists(SESSION_FILE_PATH):
        return [], 0
    with open(SESSION_FILE_PATH, 'r') as f:
        session_data = json.load(f)
        print("Global variables loaded from " + SESSION_FILE_PATH)
        return session_data.get('cards', []), session_data.get('num', 0)

THIS_SESSION_CARDS, THIS_SESSION_NUM = load_session_data()

def home(request):
    return render(request, 'group14/home.html')


@csrf_exempt
def add_new_card(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        front = data["front"]
        is_unique = is_front_unique(front, None)
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
    global THIS_SESSION_NUM
    global THIS_SESSION_CARDS
    print (THIS_SESSION_CARDS)
    print(THIS_SESSION_NUM)
    if request.method == 'GET':
        # hard code
        user_id = 1
        cards = fetch_cards(user_id)
        return JsonResponse(cards, safe=False)
    else:
        return JsonResponse({'error': 'only GET requests are allowed'})

@csrf_exempt
def edit_card(request, card_id):
    if request.method == 'PUT':
        data = json.loads(request.body)
        front = data["front"]
        is_unique = is_front_unique(front, card_id)
        if not is_unique:
            return JsonResponse({'error': 'front value is not unique'})
        back = data["back"]
        update_card(front, back, card_id)
        return JsonResponse({'message': 'card updated successfully'})
    else:
        return JsonResponse({'error': 'only PUT requests are allowed'})
    
@csrf_exempt
def delete_card(request, card_id):
    if request.method == 'DELETE':
        delete_desired_card(card_id)
        return JsonResponse({'message': 'card deleted successfully'})
    else:
        return JsonResponse({'error': 'only DELETE requests are allowed'})
    
@csrf_exempt
def review_cards(request):
    if request.method == 'GET':
        # TODO: This approach is not correct for multi-user scenario.
        global THIS_SESSION_CARDS
        global THIS_SESSION_NUM
        # hard code
        user_id = 1
        THIS_SESSION_CARDS = get_this_session_cards(user_id, THIS_SESSION_NUM)
        save_session_data(THIS_SESSION_CARDS, THIS_SESSION_NUM)
        if THIS_SESSION_CARDS:
            return JsonResponse({'message': 'Ready to start the session.'})
        else:
            return JsonResponse({'message': 'No card to be reviewed. Click to go to the next session.'})
    else:
        return JsonResponse({'error': 'only GET requests are allowed'})
    
@csrf_exempt
def increment_session(request):
    if request.method == 'PUT':
        global THIS_SESSION_CARDS
        global THIS_SESSION_NUM
        THIS_SESSION_NUM += 1
        # hard code
        user_id = 1
        THIS_SESSION_CARDS = get_this_session_cards(user_id, THIS_SESSION_NUM)
        save_session_data(THIS_SESSION_CARDS, THIS_SESSION_NUM)
        # TODO: duplicate code
        if THIS_SESSION_CARDS:
            return JsonResponse({'message': 'Ready to start the session.'})
        else:
            return JsonResponse({'message': 'No card to be reviewed. Click to go to the next session.'})
    else:
        return JsonResponse({'error': 'only PUT requests are allowed'})
    
@csrf_exempt
def review_next_card(request):
    if request.method == 'GET':
        global THIS_SESSION_CARDS
        if THIS_SESSION_CARDS:
            next_card = THIS_SESSION_CARDS[0]
            return JsonResponse(next_card, safe=False)
        else:
            return JsonResponse({'message': 'No card to be reviewed. Click to go to the next session.'})
    else:
        return JsonResponse({'error': 'only GET requests are allowed'})
    
@csrf_exempt
def review_cards_feedback(request, card_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        correct_guess = data["guess"]
        global THIS_SESSION_CARDS
        global THIS_SESSION_NUM
        # hard code
        user_id = 1
        feedback_card(THIS_SESSION_NUM, correct_guess, user_id, card_id)

        if correct_guess:
            for card in THIS_SESSION_CARDS:
                if card['id'] == card_id:
                    THIS_SESSION_CARDS.remove(card)
                    break

        # TODO: it always returns first card, even if the user feedbacks on incorrect, i.e. the user is shown the same card if the feeback is incorrect
        if THIS_SESSION_CARDS:
            next_card = THIS_SESSION_CARDS[0]
            save_session_data(THIS_SESSION_CARDS, THIS_SESSION_NUM)
            return JsonResponse(next_card, safe=False)
        else:
            THIS_SESSION_NUM += 1
            save_session_data(THIS_SESSION_CARDS, THIS_SESSION_NUM)
            return JsonResponse({'message': 'Congrats! You have reviewed all your cards for this session.'})
    else:
        return JsonResponse({'error': 'only POST requests are allowed'})