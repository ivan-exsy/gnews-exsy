# forms.py

from django import forms
from .models import NewsArticle
from gnews import GNews

class NewsArticleAdminForm(forms.ModelForm):
    class Meta:
        model = NewsArticle
        fields = '__all__'

    def save(self, commit=True):
        instance = super().save(commit=False)

        # Customize gnews parameters as needed
        google_news = GNews()
        google_news.max_results = 1
        google_news.language = 'english'

        # Fetch news from GNews based on the title
        news_results = google_news.get_news(instance.title)

        if news_results:
            # Update instance fields with fetched data
            result = news_results[0]
            instance.content = result['description']
            instance.source = result['publisher']
            instance.publication_date = result['published date']
            instance.url = result['url']

        if commit:
            instance.save()

        return instance