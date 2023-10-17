import os
from datetime import date

from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from gnews import GNews
from newspaper import Article
import requests
import json

from GnewsWeb.settings import D_ID_API_KEY, AVATAR_URL, VOICE_ID, MAX_RESULT
from newsapp.helpers import generate_summary

google_news = GNews()


class SearchNewsView(View):
    def get(self, request):
        return render(request, 'newsapp/search_news.html')


class FetchNewsView(View):
    def get(self, request):
        keyword = request.GET.get('keyword', 'US immigration')
        start_date_str = request.GET.get('start_date', '2020-01-01')
        end_date_str = request.GET.get('end_date', '2020-03-01')

        try:
            # Parse start_date and end_date as date objects
            start_date = date.fromisoformat(start_date_str)
            end_date = date.fromisoformat(end_date_str)

            # Set the start_date and end_date for google_news
            google_news.start_date = (start_date.year, start_date.month, start_date.day)
            google_news.end_date = (end_date.year, end_date.month, end_date.day)
        except ValueError:
            # Handle invalid date formats here if needed
            pass
        google_news.max_results = int(MAX_RESULT)
        news = google_news.get_news(keyword)
        return JsonResponse(news, safe=False)


class GenerateVideoView(View):
    @csrf_exempt
    def post(self, request):
        fina_script = request.body.decode('utf-8')
        url = "https://api.d-id.com/talks"

        payload = {
            "script": {
                "type": "text",
                "subtitles": "false",
                "provider": {
                    "type": "microsoft",
                    "voice_id": VOICE_ID
                },
                "ssml": "false",
                "input": fina_script
            },
            "config": {
                "fluent": "false",
                "pad_audio": "0.0"
            },
            "source_url": AVATAR_URL
        }

        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": "Basic " + D_ID_API_KEY
        }

        response = requests.post(url, json=payload, headers=headers)

        if response.status_code == 200 or response.status_code == 201:
            return JsonResponse(response.json())
        else:
            return JsonResponse({"error": "Video generation failed"}, status=500)


class ViewVideoView(View):
    @csrf_exempt
    def get(self, request, video_id):
        api_url = f"https://api.d-id.com/talks/{video_id}"

        headers = {
            "accept": "application/json",
            "authorization": "Basic " + D_ID_API_KEY,
        }

        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            video_data = response.json()
            return JsonResponse(video_data)
        else:
            return render(request, 'newsapp/error.html', {'message': 'Video not found'})


class ProcessSelectedNewsView(View):
    @csrf_exempt
    def post(self, request):
        if request.method == "POST":
            data = json.loads(request.body)
            articles = []
            video_len = 1
            for item in data:
                article = Article(item['url'])
                try:
                    article.download()
                    article.parse()
                    summary = item.get('title') + '\n' + generate_summary(article.text)
                    video_len = video_len + len(data) * 20
                    articles.append(summary)
                except:
                    try:
                        # Second try to get article
                        url = requests.head(item['url']).headers['location']
                        article = Article(url)
                        article.download()
                        article.parse()
                        summary = item.get('title') + '\n' + generate_summary(article.text)
                        video_len = video_len + len(data) * 20
                        articles.append(summary)
                    except:
                        articles.append("unable to scrape data for " + item['description'])

            summary = "\n\n".join(articles)
            video_script_len = f"Video Script (Around {video_len - 1} Seconds)"
            return JsonResponse({"summary": summary, "video_script_len": video_script_len})