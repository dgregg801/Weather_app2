let currentWeather = null;

const weatherForm = document.getElementById("weatherForm");
const locationInput = document.getElementById("locationInput");
const weatherInfo = document.getElementById("weatherInfo");
const saveAreaButton = document.getElementById("saveAreaButton");
const refreshButton = document.getElementById("refreshButton");

refreshButton.addEventListener("click", (e) => {
  refetchSelectedAreasWeather();
});

weatherForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const location = locationInput.value;
  if (location) {
    getGeoCodingInfo(location);
  }
});

function getGeoCodingInfo(location) {
  const apiKey = "944b444c9a6e0d95a21d8a65f8008860";
  const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;

  fetch(geoApiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        getWeatherData(lat, lon, apiKey);
      } else {
        console.error("Location not found.");
        weatherInfo.textContent = "Location not found.";
      }
    })
    .catch((error) => {
      console.error("Error fetching location data:", error);
      weatherInfo.textContent = "Error fetching location data.";
    });
}

function getWeatherData(lat, lon, apiKey) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      currentWeather = processData(data);
      console.log(currentWeather);
      updatePageInfo();
      // displayWeatherInfo(currentWeather);
      console.log(currentWeather);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      weatherInfo.textContent = "Error fetching weather data.";
    });
}

function processData(data) {
  // Extract the data you need from the API response
  const weatherData = {
    temperature: data.main.temp,
    description: data.weather[0].description,
    city: data.name,
    lastUpdated: new Date(),
  };

  return weatherData;
}

function updatePageInfo() {
  weatherInfo.innerHTML = `
        <h2>Weather in ${currentWeather.city}</h2>
        <p>Temperature: ${currentWeather.temperature}°F</p>
        <p>Description: ${currentWeather.description}</p>
        `;
  const savedAreaList = document.getElementById("savedAreaList");
  savedAreaList.innerHTML = "";
  for (let i = 0; i < selectedAreas.areas.length; i++) {
    const savedListItem = document.createElement("li");
    savedListItem.textContent =
      selectedAreas.areas[i].city +
      " " +
      selectedAreas.areas[i].temperature +
      "--" +
      selectedAreas.areas[i].lastUpdated;
    console.log(savedAreaList);
    savedAreaList.appendChild(savedListItem);
    const removeListItem = document.createElement("button");
    removeListItem.textContent = "Remove";
    savedListItem.appendChild(removeListItem);
    removeListItem.addEventListener("click", (e) => {
      selectedAreas.removeArea(selectedAreas.areas[i].city);
      savedListItem.remove();
    });
  }
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
    const existingArea = this.areas.find((item) => item.area === area);
    if (!existingArea) {
      this.areas.push({ ...currentWeather });
      updatePageInfo();
    }
  }

  removeArea(area) {
    const index = this.areas.findIndex((item) => item.city === area);
    if (index !== -1) {
      this.areas.splice(index, 1);
    }
  }

  fetchWeatherData(area) {
    // Fetch weather data and update lastUpdated timestamp
    // ... (Use a similar approach as before with fetch)
    // Once you have the data, update the lastUpdated timestamp
    const areaItem = this.areas.find((item) => item.city === area);
    getGeoCodingInfo(area);
    areaItem.lastUpdated = new Date();
  }
}

function refetchSelectedAreasWeather() {
  const apiKey = "944b444c9a6e0d95a21d8a65f8008860";
  for (const areaItem of selectedAreas.areas) {
    //selectedAreas.fetchWeatherData(areaItem.city);
    const location = areaItem.city;
    const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;
    fetch(geoApiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

          fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
              //Update the existing info in the saved areas
              selectedAreas.areas[areaItem] = {
                ...selectedAreas.areas[areaItem],
                temperature: data.main.temp,
                description: data.weather[0].description,
                lastUpdated: new Date(),
              };
              updatePageInfo();
            })
            .catch((error) => {
              console.error("Error fetching weather data:", error);
              weatherInfo.textContent = "Error fetching weather data.";
            });
        } else {
          console.error("Location not found.");
          weatherInfo.textContent = "Location not found.";
        }
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
        weatherInfo.textContent = "Error fetching location data.";
      });
  }
}

saveAreaButton.addEventListener("click", function () {
  const area = currentWeather.city;
  const type = "saved";
  if (area) {
    selectedAreas.addArea(area, type);
  }
});

const selectedAreas = new SelectedAreas();
