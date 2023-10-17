import openai
from django.http import JsonResponse

from GnewsWeb.settings import OPEN_AI_API_KEY


def generate_summary(article_text):
    desired_script_length = 20
    model = "text-davinci-003"
    api_key = OPEN_AI_API_KEY

    response = openai.Completion.create(
        engine=model,
        prompt=f"Summarize the following article:\n{article_text}\n\n summary, which will be a video script that's around {desired_script_length} seconds long. :",
        max_tokens=150,
        api_key=api_key,
    )

    summary = response.choices[0].text.strip()
    return summary