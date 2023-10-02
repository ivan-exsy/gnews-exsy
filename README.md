# gnews-exsy

Running Demo - http://35.209.85.185:8000/

Details at google doc - https://docs.google.com/document/d/1oBi_7jqnfmV7eYb0MxDNL0mzy9lIwfLG1bYO4JKrZwg/edit


Selecting News & Extracting the content
Source of news
Google News (open to other news aggregators)
- Filter by period (one week)
- Filter by topic (US immigration)
- Filter by tags (tbd)

Selection of top news for the period (3-5 news for further processing)
- Use the aggregator’s algorithm (Sort from the most to the least important)
- Show top 15 news in the control panel
- Date // Source // Header of the article // First paragraph Or summary (if available) // url

Summarization of the content of selected articles (3-4 hours)
- The content of the news is send to OpenAI
- Summarized with gpt-3.5-turbo:
- Prompt to the OpenAI:
- “Summarize the main points of the article in 33 words or less: [article text]”
- Separate queries to OpenAI for each article

Preview of the summary in the web interface - as a video script (4 hours)
- For each news: Heading / Summary
- Ability to manually change / update the text
- Button >> generate video with D-ID

Video clip generation (5 hours)
Script is sent to D-ID for video generation
Convert using Clips endpoint
Video downloads to local machine
