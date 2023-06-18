const API_KEY = "2bbcb13c772b86880faaf56560555d8f";

// Weather API Functions
function fetchWeatherData(city) {
  const weatherAPIURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

  fetch(weatherAPIURL)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      fetchForecastData(data.coord.lat, data.coord.lon);
      storeSearchHistory(city);
    })
    .catch(error => {
      console.error(error);
    });
}

function fetchForecastData(lat, lon) {
  const forecastAPIURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(forecastAPIURL)
    .then(response => response.json())
    .then(data => {
      displayForecast(data.list);
    })
    .catch(error => {
      console.error(error);
    });
}


function displayCurrentWeather(weatherData) {
  const currentWeatherContainer = document.getElementById('current-weather');
  currentWeatherContainer.innerHTML = '';

  const cityName = weatherData.name;
  const date = new Date().toLocaleDateString();
  const icon = weatherData.weather[0].icon;
  const temperatureCelsius = Math.round(weatherData.main.temp - 273.15);
  const temperatureFahrenheit = Math.round((temperatureCelsius * 9) / 5 + 32);
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;

  const iconURL = `http://openweathermap.org/img/w/${icon}.png`;

  const currentWeatherHTML = `
    <h2>${cityName} (${date})</h2>
    <img src="${iconURL}" alt="Weather Icon">
    <p>Temperature: ${temperatureCelsius}°C / ${temperatureFahrenheit}°F</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
  `;

  currentWeatherContainer.innerHTML = currentWeatherHTML;
}

function displayForecast(forecastData) {
  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = '';

  const currentDate = new Date();
  const nextFiveDays = [];

  forecastData.forEach(forecast => {
    const forecastDate = new Date(forecast.dt_txt);
    if (forecastDate.getDate() > currentDate.getDate()) {
      nextFiveDays.push(forecast);
    }
  });

  nextFiveDays.slice(0, 5).forEach(forecast => {
    const date = new Date(forecast.dt_txt).toLocaleDateString();
    const icon = forecast.weather[0].icon;
    const temperatureCelsius = Math.round(forecast.main.temp - 273.15);
    const temperatureFahrenheit = Math.round((temperatureCelsius * 9) / 5 + 32);
    const humidity = forecast.main.humidity;
    const windSpeed = forecast.wind.speed;

    const iconURL = `http://openweathermap.org/img/w/${icon}.png`;

    const forecastItemHTML = `
      <div class="weather-item">
        <h3>${date}</h3>
        <img src="${iconURL}" alt="Weather Icon">
        <p>Temperature: ${temperatureCelsius}°C / ${temperatureFahrenheit}°F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      </div>
    `;

    forecastContainer.innerHTML += forecastItemHTML;
  });
}


function storeSearchHistory(city) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // Avoid duplicates in search history
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }

  displaySearchHistory(searchHistory);
}

function displaySearchHistory(searchHistory) {
  const searchHistoryList = document.getElementById('search-history-list');
  searchHistoryList.innerHTML = '';

  searchHistory.forEach(city => {
    const searchHistoryItem = document.createElement('button');
    searchHistoryItem.className = 'search-history-button';
    searchHistoryItem.textContent = city;
    searchHistoryItem.addEventListener('click', () => {
      fetchWeatherData(city);
    });

    searchHistoryList.appendChild(searchHistoryItem);
  });
}

function fillCity(city) {
  const cityInput = document.getElementById('city-input');
  cityInput.value = city;
}

// Event Listeners
document.getElementById('city-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const cityInput = document.getElementById('city-input');
  const city = cityInput.value;
  fetchWeatherData(city);
});

// Initial Load
const lastSearchedCity = localStorage.getItem('lastSearchedCity');
if (lastSearchedCity) {
  fetchWeatherData(lastSearchedCity);
}

const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
displaySearchHistory(searchHistory);