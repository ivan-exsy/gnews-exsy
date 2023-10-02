# newsapp/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.search_news, name='search_news'),
    path('process_selected_news/', views.process_selected_news, name='process_selected_news'),

    path('fetch_news/', views.fetch_news, name='fetch_news'),
    path('generate_video/', views.generate_video, name='generate_video'),
]