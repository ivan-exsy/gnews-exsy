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

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if this cookie name matches the one for CSRF token
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


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

var videoId = '';


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
    const getGeneratedVideo = document.getElementById("getGeneratedVideo");
    const videoContainer = document.getElementById("VideoContainer");
    const videoPlayer = document.getElementById("videoPlayer");
    const csrftoken = getCookie('csrftoken'); // Function to get the CSRF token from cookies

    loader.style.display = 'none';
    getGeneratedVideo.style.display = 'none';
    videoContainer.style.display = 'none';
    processButton.style.display = 'none'

    var summary = '';

    function checkVideoStatus(videoId) {

        fetch("/view_video/" + videoId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((videoData) => {
                debugger
                if (videoData.status === "done") {
                    // Video processing is done, you can display the video or perform further actions
                    displayVideo(videoData);
                } else {
                    // Video processing is not yet done, continue polling
                    setTimeout(() => {
                        checkVideoStatus(videoId);
                    }, 5000); // Poll every 5 seconds (adjust as needed)
                }
            })
            .catch((error) => {
                console.error("Error checking video status:", error);
            });
    }

// Function to display the video when processing is complete
    function displayVideo(videoData) {
        // Display video details
        loader.style.display = "none";
        videoContainer.style.display = 'block'
        document.getElementById('summaryContainer').style.display = 'none';
        const videoDetails = document.getElementById("videoDetails");
        videoDetails.innerHTML = `
        <p>Video ID: ${videoData.id}</p>
        <p>Duration: ${videoData.duration} seconds</p>
    `;

        // Check if videoData.result_url is defined before setting the download link
        if (videoData.result_url) {
            const downloadLink = document.createElement("a");
            downloadLink.href = videoData.result_url;
            downloadLink.textContent = "Download Video";
            downloadLink.setAttribute("download", "video.mp4");
            videoDetails.appendChild(downloadLink);
        }

        // Display the video player
        const videoPlayer = document.getElementById("videoPlayer");
        videoPlayer.style.display = "block";
        videoPlayer.src = videoData.result_url;
    }

// Trigger video processing and status checking
    getGeneratedVideo.addEventListener("click", function () {
        loader.style.display = "block";
        fetch("/view_video/" + videoId + "/", {
            method: "GET",
            headers: {
                "Content-Type": "text/plain",
            },
        })
            .then((response) => response.json())
            .then((videoData) => {
                getGeneratedVideo.style.display = "none";
                // Start checking the video status
                checkVideoStatus(videoId);
            })
            .catch((error) => {
                console.error("Error getting video:", error);
                loader.style.display = "none";
            });
    });

    generateVideo.addEventListener("click", function () {
        loader.style.display = "block";
        fetch("/generate_video/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-Type": "text/plain",
            },
            body: document.getElementById('processedDataTextarea').value,
        })
            .then((response) => response.json())
            .then((data) => {
                debugger;
                loader.style.display = "none";
                const videoIdElement = document.getElementById("videoId");
                if (videoIdElement) {
                    videoIdElement.style.display = 'block'
                    videoIdElement.textContent = data.id;
                    
                }
                videoId = data.id;
                getGeneratedVideo.style.display = 'block';
                generateVideo.style.display = 'none';
            })
            .catch((error) => {
                console.error("Error generating video:", error);
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
                "X-CSRFToken": csrftoken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedNews),
        })
            .then((response) => response.text()) // Assuming the server returns a text response
            .then((data) => {
                newsList.style.display = 'none'

                const textarea = document.getElementById("processedDataTextarea");
                const textareaContainer = document.getElementById("summaryContainer");
                textareaContainer.style.display = 'block'
                textarea.style.display = 'block';
                loader.style.display = "none";
                processButton.style.display = 'none'
                const jsonData = JSON.parse(data)
                const videoLen = document.getElementById("scriptLen");
                videoLen.style.display = 'block'
                videoLen.textContent = jsonData.video_script_len;
                summary = jsonData.summary;
                textarea.value = summary;
                const videoIdElement = document.getElementById("videoId");
                if (videoIdElement) {
                    videoIdElement.style.display = '';
                }
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
        $(document).ready(function () {
            // Initialize datepickers
            $('#startDate').datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                startView: 'months', // Show the months view when the date picker opens
                minViewMode: 'months' // Only allow selection of months and years
            });

            $('#endDate').datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                startView: 'months', // Show the months view when the date picker opens
                minViewMode: 'months' // Only allow selection of months and years
            });

            // Calculate the default date range (previous week)
            var today = new Date();
            var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

            // Set default dates in datepickers
            $('#startDate').datepicker('setDate', lastWeek);
            $('#endDate').datepicker('setDate', today);

            // Link the datepickers to create a date range
            $('#startDate').on('changeDate', function (selected) {
                var startDate = new Date(selected.date.valueOf());
                $('#endDate').datepicker('setStartDate', startDate);
            });

            $('#endDate').on('changeDate', function (selected) {
                var endDate = new Date(selected.date.valueOf());
                $('#startDate').datepicker('setEndDate', endDate);
            });

            // Function to get selected start and end dates
            function getSelectedDateRange() {
                var startDate = $('#startDate').datepicker('getFormattedDate');
                var endDate = $('#endDate').datepicker('getFormattedDate');
                return {start: startDate, end: endDate};
            }

            // Validate the date range
            $('#endDate').on('changeDate', function () {
                var dateRange = getSelectedDateRange();
                var startDate = new Date(dateRange.start);
                var endDate = new Date(dateRange.end);
                var today = new Date();

                if (endDate < startDate) {
                    $('#dateRangeError').text('End date cannot be before start date.');
                    $('#endDate').datepicker('setDate', startDate);
                } else if (endDate > today) {
                    $('#dateRangeError').text('End date cannot be in the future.');
                    $('#endDate').datepicker('setDate', today);
                } else {
                    $('#dateRangeError').text('');
                }
            });
        });


        // Show the loader while fetching news
        loader.style.display = "block";
        const startDate = document.getElementById("startDate").value; // Get the selected start date
        const endDate = document.getElementById("endDate").value; 
        // Make an AJAX request to fetch news
        let period = '7d';
        let source = '';
        fetch(`/fetch_news/?keyword=${keyword}&period=${period}&source=${source}&start_date=${startDate}&end_date=${endDate}`)
            .then((response) => response.json())
            .then((data) => {
                // Clear existing news items
                newsList.innerHTML = "";
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
