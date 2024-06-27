from django.urls import path
from . import views

urlpatterns = [
    path('',views.home, name='home'),
    path('add-new-card/',views.add_new_card,name='add-new-card'),
    path('list-cards/', views.list_cards,name='list-cards')
] 
