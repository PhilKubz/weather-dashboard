const API_Key =  "2bbcb13c772b86880faaf56560555d8f";

const Weather_API_URL = "http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=" + API_Key;


// Weather API Functions

fetch(WEATHER_API_URL)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });



// City Form Functions

function fillCity(cityName) {
    document.getElementById('city-input').value = cityName;
    document.getElementById('city-form').submit();
  }

/* Future Use
weatherItem.innerHTML = `
<div class="WeatherListBox">
<p>${cityName}</p>
<p>Date: ${date}</p>
<p>Temperature: ${temperature}F</p>
<p>Wind speed: ${wind} m/s</p>
<p>Humidity: ${humidity}%</p>
</div>
`;

*/
