from django.urls import path
from .views import SearchNewsView, FetchNewsView, GenerateVideoView, ViewVideoView, ProcessSelectedNewsView

urlpatterns = [
    path('', SearchNewsView.as_view(), name='search_news'),
    path('fetch_news/', FetchNewsView.as_view(), name='fetch_news'),
    path('generate_video/', GenerateVideoView.as_view(), name='generate_video'),
    path('view_video/<str:video_id>/', ViewVideoView.as_view(), name='view_video'),
    path('process_selected_news/', ProcessSelectedNewsView.as_view(), name='process_selected_news'),
]