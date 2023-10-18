const weatherForm = document.getElementById('weatherForm');
const locationInput = document.getElementById('locationInput');
const weatherInfo = document.getElementById('weatherInfo');

weatherForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const location = locationInput.value;
    if (location) {
        getWeatherData(location);
    }
});

function getWeatherData(location) {
    // Replace 'YOUR_API_KEY' with your actual API key
    const apiKey = '944b444c9a6e0d95a21d8a65f8008860';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const weatherData = processData(data);
            displayWeatherInfo(weatherData);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherInfo.textContent = 'Error fetching weather data.';
        });
}

function processData(data) {
    // Extract the data you need from the API response
    const weatherData = {
        temperature: data.main.temp,
        description: data.weather[0].description,
        city: data.name,
    };

    return weatherData;
}

function displayWeatherInfo(weatherData) {
    weatherInfo.innerHTML = `
        <h2>Weather in ${weatherData.city}</h2>
        <p>Temperature: ${weatherData.temperature}°C</p>
        <p>Description: ${weatherData.description}</p>
    `;
}

  