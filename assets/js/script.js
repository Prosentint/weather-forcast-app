// waits for the page to finish loading
document.addEventListener("DOMContentLoaded", function () {
    // sets html search elements to variables
    const cityInput = document.getElementById("cityInput");
    const searchButton = document.getElementById("searchButton");
    const searchHistory = document.getElementById("searchHistory");
    // sets html Weather box elements to variables
    const cityNameEl = document.getElementById("cityName");
    const tempEl = document.getElementById("temperature");
    const windSpdEl = document.getElementById("windSpeed");
    const humidityEl = document.getElementById("humidity");

    // Api key to be used on api calls
    const apiKey = '59534706ff7d6c24cea616e99e0f0fd7';

    let searchHistoryList = [];
    
    // Listener for search button
    searchButton.addEventListener("click", function () {
        // gets what was typed in search bar
        const cityName = cityInput.value.trim();
        // makes url using input city name and api key
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
        // api call
        fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length > 0) {
                // Checks if it has been searched for
                if (!searchHistoryList.includes(data[0].name)){
                    searchHistoryList.push(data[0].name);
                    // adds search to search history
                    addToSearchHistory(data[0].name);
                    cityInput.value = "";
                }
                // Set the lat and lon variables for later
                let lat = data[0].lat;
                let lon = data[0].lon;
                setCurrentCity(lat, lon, data[0].name);
            }
            });
    });

    // Adds a click event listener to each li in search history
    searchHistory.addEventListener("click", function (event) {
        if (event.target.tagName === "LI") {
            const cityName = event.target.textContent;
            cityInput.value = cityName;
            // Trigger a click on the search button to load the selected city's data
            searchButton.click();
        }
});

    // Sets weather box info to selected city
    function setCurrentCity(lat, lon, name){
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data.list[0].main);
            // Sets weather box text
            cityNameEl.textContent = name;
            tempEl.textContent = data.list[0].main.temp;
            windSpdEl.textContent = data.list[0].wind.speed;
            humidityEl.textContent = data.list[0].main.humidity;

            // Call the function to update the 5-day forecast
            updateFiveDayForecast(lat, lon);
        });
    }

    // Creates and appends an item to search history
    function addToSearchHistory(cityName) {
        const li = document.createElement("li");
                li.textContent = cityName;
                searchHistory.appendChild(li);
    }

    // Function to update the 5-day forecast
    function updateFiveDayForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const forecastBoxes = document.querySelectorAll(".forecast-box");

            // Loop through the forecast boxes and update them with data
            for (let i = 0; i < forecastBoxes.length; i++) {
                console.log(i);
                const forecastBox = forecastBoxes[i];
                const forecastData = data.list[i * 8]; // Get data for every 8th element (1 per day)

                // Extract date and format it
                const date = new Date(forecastData.dt * 1000); // Convert timestamp to date
                const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                // Update the forecast box content
                forecastBox.innerHTML = `
                    <h4>${formattedDate}</h4>
                    <div id="icon"><img id="wicon" src= 'https://openweathermap.org/img/w/${forecastData.weather[0].icon}.png' alt="Weather icon"></div>
                    <p>Temp: ${forecastData.main.temp}°C</p>
                    <p>Wind: ${forecastData.wind.speed} m/s</p>
                    <p>Humidity: ${forecastData.main.humidity}%</p>
                `;
            }
        });
}

});
