from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from django.shortcuts import render

class CustomAdminView(admin.AdminSite):
    site_header = "Custom Admin"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('google_news/', self.admin_view(self.google_news_view), name='google_news'),
        ]
        return custom_urls + urls

    def google_news_view(self, request):
        if request.method == 'POST':
            # Handle form submission here
            period = request.POST.get('period')
            max_results = request.POST.get('max_results')
            country = request.POST.get('country')
            language = request.POST.get('language')
            exclude_websites = request.POST.get('exclude_websites')

            # Perform actions based on the selected filters
            # You can set the filter values accordingly in your business logic.

        else:
            # Render the form
            available_countries = {
                'Australia': 'AU',
                # ... (other countries)
            }
            available_languages = {
                'English': 'en',
                # ... (other languages)
            }

            form = """
            <form method="post">
                {% csrf_token %}
                <label for="period">Select Period options:</label>
                <select name="period">
                    <option value="h">12h</option>
                    <option value="d">7d</option>
                    <option value="m">6m</option>
                    <option value="y">1y</option>
                </select><br><br>

                <label for="max_results">Number of Results:</label>
                <input type="number" name="max_results" value="10"><br><br>

                <label for="country">Country:</label>
                <select name="country">
                    {% for country_name, country_code in available_countries.items %}
                        <option value="{{ country_code }}">{{ country_name }}</option>
                    {% endfor %}
                </select><br><br>

                <label for="language">Language:</label>
                <select name="language">
                    {% for language_name, language_code in available_languages.items %}
                        <option value="{{ language_code }}">{{ language_name }}</option>
                    {% endfor %}
                </select><br><br>

                <label for="exclude_websites">Exclude Websites:</label>
                <input type="text" name="exclude_websites"><br><br>

                <input type="submit" value="Apply Filters">
            </form>
            """

            return HttpResponse(form)

admin.site = CustomAdminView()
admin.autodiscover()