const countries = {
    'Australia': 'AU',
    'Botswana': 'BW',
    'Canada': 'CA',
    'Ethiopia': 'ET',
    'Ghana': 'GH',
    'India': 'IN',
    'Indonesia': 'ID',
    'Ireland': 'IE',
    'Israel': 'IL',
    'Kenya': 'KE',
    'Latvia': 'LV',
    'Malaysia': 'MY',
    'Namibia': 'NA',
    'New Zealand': 'NZ',
    'Nigeria': 'NG',
    'Pakistan': 'PK',
    'Philippines': 'PH',
    'Singapore': 'SG',
    'South Africa': 'ZA',
    'Tanzania': 'TZ',
    'Uganda': 'UG',
    'United Kingdom': 'GB',
    'United States': 'US',
    'Zimbabwe': 'ZW',
    'Czech Republic': 'CZ',
    'Germany': 'DE',
    'Austria': 'AT',
    'Switzerland': 'CH',
    'Argentina': 'AR',
    'Chile': 'CL',
    'Colombia': 'CO',
    'Cuba': 'CU',
    'Mexico': 'MX',
    'Peru': 'PE',
    'Venezuela': 'VE',
    'Belgium': 'BE',
    'France': 'FR',
    'Morocco': 'MA',
    'Senegal': 'SN',
    'Italy': 'IT',
    'Lithuania': 'LT',
    'Hungary': 'HU',
    'Netherlands': 'NL',
    'Norway': 'NO',
    'Poland': 'PL',
    'Brazil': 'BR',
    'Portugal': 'PT',
    'Romania': 'RO',
    'Slovakia': 'SK',
    'Slovenia': 'SI',
    'Sweden': 'SE',
    'Vietnam': 'VN',
    'Turkey': 'TR',
    'Greece': 'GR',
    'Bulgaria': 'BG',
    'Russia': 'RU',
    'Ukraine': 'UA',
    'Serbia': 'RS',
    'United Arab Emirates': 'AE',
    'Saudi Arabia': 'SA',
    'Lebanon': 'LB',
    'Egypt': 'EG',
    'Bangladesh': 'BD',
    'Thailand': 'TH',
    'China': 'CN',
    'Taiwan': 'TW',
    'Hong Kong': 'HK',
    'Japan': 'JP',
    'Republic of Korea': 'KR'
};

const languages = {
    'English': 'en',
    'Indonesian': 'id',
    'Czech': 'cs',
    'German': 'de',
    'Spanish': 'es-419',
    'French': 'fr',
    'Italian': 'it',
    'Latvian': 'lv',
    'Lithuanian': 'lt',
    'Hungarian': 'hu',
    'Dutch': 'nl',
    'Norwegian': 'no',
    'Polish': 'pl',
    'Portuguese (Brasil)': 'pt-419',
    'Portuguese (Portugal)': 'pt-150',
    'Romanian': 'ro',
    'Slovak': 'sk',
    'Slovenian': 'sl',
    'Swedish': 'sv',
    'Vietnamese': 'vi',
    'Turkish': 'tr',
    'Greek': 'el',
    'Bulgarian': 'bg',
    'Russian': 'ru',
    'Serbian': 'sr',
    'Ukrainian': 'uk',
    'Hebrew': 'he',
    'Arabic': 'ar',
    'Marathi': 'mr',
    'Hindi': 'hi',
    'Bengali': 'bn',
    'Tamil': 'ta',
    'Telugu': 'te',
    'Malyalam': 'ml',
    'Thai': 'th',
    'Chinese (Simplified)': 'zh-Hans',
    'Chinese (Traditional)': 'zh-Hant',
    'Japanese': 'ja',
    'Korean': 'ko'
};


function populateSelect(selectId, options) {
    const select = document.getElementById(selectId);
    for (const optionText in options) {
        if (options.hasOwnProperty(optionText)) {
            const optionValue = options[optionText];
            const option = new Option(optionText, optionValue);
            select.appendChild(option);
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {
    // Define arrays of countries and languages
    populateSelect('country', countries);
    populateSelect('language', languages);
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const newsList = document.getElementById("newsList");
    const loader = document.getElementById("loader");
    const selectAllCheckbox = document.getElementById("selectAll");
    const processButton = document.getElementById("processButton");
    const generateVideo = document.getElementById("generateVideo");
    loader.style.display = 'none';
    processButton.style.display = 'none'

    var summary = ''

    generateVideo.addEventListener("click", function () {
        // Your existing code for processing selected news...

        // After processing selected news, assume you have the summary in a variable called `summary`.
        // Now, you can send the summary to the Django view for video generation.

        // Display the loader while generating the video
        loader.style.display = "block";

        // Make a POST request to the Django view
        fetch("/generate_video/", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain", // Set the content type to plain text
            },
            body: summary, // Send the summary as the request body
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response from the server (e.g., display the video or processing status)
                console.log("Video generation response:", data);

                // Hide the loader after generating the video
                loader.style.display = "none";
                
                // Assuming the video URL is available in the response, you can display it or handle it accordingly
                if (data.video_url) {
                    // Display the video or perform any required actions
                    // You can use the data.video_url to embed or play the video
                }
            })
            .catch((error) => {
                console.error("Error generating video:", error);

                // Hide the loader in case of an error
                loader.style.display = "none";
            });
    });

    // Handle "Process" button click
    processButton.addEventListener("click", function () {
        loader.style.display = 'block';
        const selectedNews = [];
        const checkboxes = newsList.querySelectorAll(".news-checkbox");
        checkboxes.forEach((checkbox) => {
            if (checkbox.children[0].checked) {
                selectedNews.push({
                    title: checkbox.children[0].getAttribute("data-title"),
                    publisher: checkbox.children[0].getAttribute("data-publisher"),
                    description: checkbox.children[0].getAttribute("data-description"),
                    url: checkbox.children[0].getAttribute("data-url"),
                });
            }
        });

        // Send selected news to the server for processing
        fetch("/process_selected_news/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedNews),
        })
            .then((response) => response.text()) // Assuming the server returns a text response
            .then((data) => {
                // Handle the response from the server (e.g., display a success message)
                // Display the processed data in the textarea
                newsList.style.display = 'none'

                const textarea = document.getElementById("processedDataTextarea");
                const textareaContainer = document.getElementById("summaryContainer");
                textareaContainer.style.display = 'block'
                textarea.style.display = 'block';
                loader.style.display = "none";
                processButton.style.display = 'none'
                const jsonData = JSON.parse(data)
                debugger;
                const videoLen = document.getElementById("scriptLen");
                videoLen.style.display = 'block'
                videoLen.textContent = jsonData.video_script_len;
                summary = jsonData.summary;
                textarea.value = summary;
            })
            .catch((error) => {
                console.error("Error processing news:", error);
            }).finally(() => {
            // Hide the loader after processing is complete

        });
    });


    searchButton.addEventListener("click", function () {
        const keyword = searchInput.value;
        // const period = document.getElementById("period").value;
        const period = 'B'
        // const source = document.getElementById("source").value;
        const source = 'A'

        // Show the loader while fetching news
        loader.style.display = "block";

        // Make an AJAX request to fetch news
        fetch(`/fetch_news/?keyword=${keyword}&period=${period}&source=${source}`)
            .then((response) => response.json())
            .then((data) => {
                // Clear existing news items
                newsList.innerHTML = "";

                // Hide the loader after fetching news
                loader.style.display = "none";
                processButton.style.display = 'block'
                // Display news items dynamically
                data.forEach((item) => {
                    const li = document.createElement("li");

                    li.classList.add("news-item");
                    li.innerHTML = `
                             <div class="news-checkbox">
        <input type="checkbox" class="form-check-input" data-title="${item.title}" data-publisher="${item.publisher}" data-description="${item.description}" data-url="${item.url}">
    </div>
    
                            <h3 class="news-title">${item.title}</h3>
                            <p class="news-source">Source: ${item.publisher.href}</p>
                            <p class="news-date">Date: ${item['published date']}</p>
                            <p class="news-content">${item.description}</p>
                            <a href="${item.url}" class="btn btn-primary" target="_blank">Read More</a>
                        `;
                    newsList.appendChild(li);
                });
            })
            .catch((error) => {
                console.error("Error fetching news:", error);
            });
    });
});