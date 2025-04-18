from django.urls import path
from . import views

urlpatterns = [
    path('',views.home, name='home'),
    path('add-new-card/',views.add_new_card,name='add-new-card'),
    path('list-cards/', views.list_cards,name='list-cards'),
    path('edit-card/<int:card_id>/', views.edit_card,name='edit-card'),
    path('delete-card/<int:card_id>/', views.delete_card,name='delete-card'),
    path('learn-cards/', views.review_cards,name='learn-cards'),
    path('increment-session/', views.increment_session,name='increment-session'),
    path('learn-next-card/', views.review_next_card,name='learn-cards'),
    path('learn-feedback/<int:card_id>/', views.review_cards_feedback,name='learn-feeback')
]