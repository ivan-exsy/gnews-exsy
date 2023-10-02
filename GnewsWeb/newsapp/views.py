import json

import openai
import requests
from django.shortcuts import render

# Create your views here.
# newsapp/views.py

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from gnews import GNews
from gnews.utils.constants import AVAILABLE_LANGUAGES, AVAILABLE_COUNTRIES

google_news = GNews()


def search_news(request):
    return render(request, 'newsapp/search_news.html')


def fetch_news(request):
    keyword = request.GET.get('keyword', 'US immigration')

    google_news.max_results = 5
    news = google_news.get_news(keyword)
    return JsonResponse(news, safe=False)


def generate_summary(article_text):
    desired_script_length = 20
    api_key = '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'
    # Specify the model to use (GPT-3.5-turbo is recommended for most use cases)
    model = "text-davinci-003"

    # Set the parameters for the API call
    response = openai.Completion.create(
        engine=model,
        prompt=f"Summarize the following article:\n{article_text}\n\n summary, which will a video script that's around {desired_script_length} seconds long. :",
        max_tokens=150,  # Adjust max_tokens based on your desired summary length
        api_key=api_key,
    )

    # Extract and return the generated summary
    summary = response.choices[0].text.strip()
    return summary


@csrf_exempt
def generate_video(request):
    import requests
    token = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik53ek53TmV1R3ptcFZTQjNVZ0J4ZyJ9.eyJodHRwczovL2QtaWQuY29tL2ZlYXR1cmVzIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9jeF9sb2dpY19pZCI6IiIsImh0dHBzOi8vZC1pZC5jb20vY2hhdF9zdHJpcGVfc3Vic2NyaXB0aW9uX2lkIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9zdHJpcGVfY3VzdG9tZXJfaWQiOiIiLCJpc3MiOiJodHRwczovL2F1dGguZC1pZC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTQ4NDQ3MzgxMzA0ODk3ODM2MTUiLCJhdWQiOlsiaHR0cHM6Ly9kLWlkLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9kLWlkLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2OTU2NTAzMzMsImV4cCI6MTY5NTczNjczMywiYXpwIjoiR3pyTkkxT3JlOUZNM0VlRFJmM20zejNUU3cwSmxSWXEiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIHJlYWQ6Y3VycmVudF91c2VyIHVwZGF0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgb2ZmbGluZV9hY2Nlc3MifQ.EJA0yWfSbdPHYmSNtw2B1fPotY6AGRUtHMA2nhjax4D0vLfjvrsdunDm4rhESalteNkUgEj64OU_mo20MzHB78kDVZj0opNhiNZTO2f89xx0M-4X4MBekDzyLS9P_WufS4AeT1YW3cXWy9tXzkVyqXhpf4PeoutN98mseWH5m-wuMp1OEnqq4yJlEk6Z8BWz1T4m8t-Hz5kIclXitESBwXH4x9FMmMg--_t9HYYP4eBbygIGB2O9WxtEUU_vBe4iTNJDTCV3hPH_WMFs5P1Tc9vPNqANv11R8hyJrgFb9YtdKQJHKyomBGheaRp760zAbE6iyrNYRQagRMfcN8bF9w"
    fina_script = request.body.decode('utf-8')
    url = "https://api.d-id.com/talks"

    payload = {
        "script": {
            "type": "text",
            "subtitles": "false",
            "provider": {
                "type": "microsoft",
                "voice_id": "en-US-JennyNeural"
            },
            "ssml": "false",
            "input": fina_script},
        "config": {
            "fluent": "false",
            "pad_audio": "0.0"
        },
        "source_url": "https://create-images-results.d-id.com/api_docs/assets/noelle.jpeg"
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": token
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        # Return the response as JSON
        return JsonResponse(response.json())
    else:
        # Return an error response
        return JsonResponse({"error": "Video generation failed"}, status=500)


@csrf_exempt  # Only for example, consider a more secure implementation
def process_selected_news(request):
    if request.method == "POST":

        data = json.loads(request.body)
        articles = []
        video_script_len = f"Video Script (Around {len(data) * 20} Seconds)"
        for item in data:
            from newspaper import Article
            article = Article(item['url'])
            try:
                article.download()
                article.parse()
                articles.append(generate_summary(article_text=article.text))
            except:
                try:
                    url = requests.head(item['url']).headers['location']
                    article = Article(url)
                    article.download()
                    article.parse()
                    articles.append(generate_summary(article_text=article.text))
                except:
                    articles.append("unable to scrap data for " + item['url'])
        summary = "\n\n".join(articles)
        return JsonResponse({"summary": summary, "video_script_len": video_script_len})