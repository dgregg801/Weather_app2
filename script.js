
let currentWeather = null



const weatherForm = document.getElementById('weatherForm');
const locationInput = document.getElementById('locationInput');
const weatherInfo = document.getElementById('weatherInfo');

weatherForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const location = locationInput.value;
    if (location) {
        getGeoCodingInfo(location);
    }
});

function getGeoCodingInfo(location) {
    const apiKey = '944b444c9a6e0d95a21d8a65f8008860';
    const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;
    
    fetch(geoApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                getWeatherData(lat, lon, apiKey);
            } else {
                console.error('Location not found.');
                weatherInfo.textContent = 'Location not found.';
            }
        })
        .catch(error => {
            console.error('Error fetching location data:', error);
            weatherInfo.textContent = 'Error fetching location data.';
        });
}

function getWeatherData(lat, lon, apiKey) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

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
        <p>Temperature: ${weatherData.temperature}°F</p>
        <p>Description: ${weatherData.description}</p>
    `;
}

class SelectedAreas {
  constructor() {
      this.areas = [];
  }

  addArea(area, type) {
      const existingArea = this.areas.find(item => item.area === area);
      if (!existingArea) {
          this.areas.push({ area, type, lastUpdated: null });
          this.fetchWeatherData(area);
      }
  }

  removeArea(area) {
      const index = this.areas.findIndex(item => item.area === area);
      if (index !== -1) {
          this.areas.splice(index, 1);
      }
  }

  fetchWeatherData(area) {
      // Fetch weather data and update lastUpdated timestamp
      // ... (Use a similar approach as before with fetch)
      // Once you have the data, update the lastUpdated timestamp
      const areaItem = this.areas.find(item => item.area === area);
      areaItem.lastUpdated = new Date();
  }
}

//select 3 buttons separately call add event listener on each
//give them callback functions
//save area button call selectedAreas
//"new york" currentWeather .area  dot notation
//




const selectedAreas = new SelectedAreas();

// Add an area as "home"  
selectedAreas.addArea('New York', 'home');

// Add an area as "saved"
selectedAreas.addArea('Los Angeles', 'saved');

// Remove an area
selectedAreas.removeArea('New York');

// Refetch weather information for selected areas
function refetchSelectedAreasWeather() {
  for (const areaItem of selectedAreas.areas) {
      selectedAreas.fetchWeatherData(areaItem.area);
  }
}

// Example of how to use the timestamp for last update
const newYorkArea = selectedAreas.areas.find(item => item.area === 'New York');
if (newYorkArea) {
  console.log(`Last updated for New York: ${newYorkArea.lastUpdated}`);
}

// You can call refetchSelectedAreasWeather when needed to update weather data for selected areas.
