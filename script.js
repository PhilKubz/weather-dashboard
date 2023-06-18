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
  const forecastAPIURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${API_KEY}`;

  fetch(forecastAPIURL)
    .then(response => response.json())
    .then(data => {
      displayForecast(data.daily);
    })
    .catch(error => {
      console.error(error);
    });
}

function displayCurrentWeather(data) {
  const currentWeatherContainer = document.getElementById('current-weather');
  currentWeatherContainer.innerHTML = '';

  const cityName = data.name;
  const date = new Date().toLocaleDateString();
  const icon = data.weather[0].icon;
  const temperatureCelsius = Math.round(data.main.temp - 273.15); // Temperature in Celsius
  const temperatureFahrenheit = Math.round((temperatureCelsius * 9) / 5 + 32); // Temperature in Fahrenheit
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  const currentWeatherHTML = `
    <div class="weather-item">
      <h3>${cityName}</h3>
      <p>Date: ${date}</p>
      <p>Temperature: ${temperatureCelsius}°C / ${temperatureFahrenheit}°F</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
    </div>
  `;

  currentWeatherContainer.innerHTML = currentWeatherHTML;
}

function displayForecast(forecastData) {
  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = '';

  forecastData.forEach(day => {
    const date = new Date(day.dt * 1000).toLocaleDateString();
    const icon = day.weather[0].icon;
    const temperatureCelsius = Math.round(day.temp.day - 273.15); // Temperature in Celsius
    const temperatureFahrenheit = Math.round((temperatureCelsius * 9) / 5 + 32); // Temperature in Fahrenheit
    const humidity = day.humidity;
    const windSpeed = day.wind_speed;

    const forecastItemHTML = `
      <div class="weather-item">
        <h3>${date}</h3>
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
