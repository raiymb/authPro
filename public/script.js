function fetchWeather(city) {
  const apiKey = "00134eee3c7c04bd92ea502db2c9007a";
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(response => {
          const data = response.data;
          displayWeatherData(data);
      })
      .catch(error => {
          console.error("Error fetching data:", error);
      });
}

function displayWeatherData(data) {
  document.getElementById('weatherCity').textContent = `Weather in ${data.name}`;
  document.getElementById('weatherDescription').textContent = `${data.weather[0].description}`;
  document.getElementById('weatherTemperature').textContent = `Temperature: ${data.main.temp}°C`;
  document.getElementById('weatherWind').textContent = `Wind Speed: ${data.wind.speed} m/s`;
  document.getElementById('weatherHumidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('weatherPressure').textContent = `Pressure: ${data.main.pressure} hPa`;
  document.getElementById('weatherPressure').textContent = `Pressure: ${data.main.pressure} hPa`;
  document.getElementById('weatherClouds').textContent = `Cloudiness: ${data.clouds.all}%`;
  document.getElementById('weatherSunrise').textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
  document.getElementById('weatherSunset').textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;

  const currentTemperature = data.main.temp;
  const historicalTemperatures = [currentTemperature - 3, currentTemperature - 1, currentTemperature + 2]; // Example data
  const labels = ['3 days ago', '2 days ago', 'Yesterday', 'Today']; // Corresponding labels

  initWeatherChart({
      labels: labels,
      temperatures: [...historicalTemperatures, currentTemperature] // Combine historical data with today's temperature
  });

  fetchWeatherbitData(data.name);

  fetchAQIData(data.coord.lat, data.coord.lon);

  fetchTomorrowIoData(data.coord.lat, data.coord.lon);

  initMap(data.coord.lat, data.coord.lon);
}


function initWeatherChart(data) {
  const ctx = document.getElementById('weatherChart').getContext('2d');
  const weatherChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: data.labels,
          datasets: [{
              label: 'Temperature (°C)',
              data: data.temperatures,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
          }]
      },
      options: {}
  });
}


function displayWeatherbitData(data) {
document.getElementById('weatherbitTemperature').textContent = `Temperature (Weatherbit): ${data.data[0].temp}°C`;
document.getElementById('weatherbitDescription').textContent = `Description (Weatherbit): ${data.data[0].weather.description}`;

const iconCode = data.data[0].weather.icon;
const iconUrl = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;

document.getElementById('weatherbitIcon').src = iconUrl;
document.getElementById('weatherbitIcon').alt = data.data[0].weather.description;

}

function fetchWeatherbitData(city) {
axios.get(`/weatherbit/${city}`)
  .then(response => {
    const weatherbitData = response.data;
    displayWeatherbitData(weatherbitData);
  })
  .catch(error => {
    console.error("Error fetching Weatherbit data:", error);
  });
}

function fetchAQIData(lat, lon) {
axios.get(`/aqi/${lat}/${lon}`)
  .then(response => {
    const aqiData = response.data;
    displayAQIData(aqiData);
  })
  .catch(error => {
    console.error("Error fetching AQI data:", error);
  });
}

function fetchTomorrowIoData(lat, lon) {
axios.get(`/climacell/${lat}/${lon}`)
.then(response => {
  console.log(response.data);
  displayTomorrowIoData(response.data);
})
  .catch(error => {
    console.error("Error fetching Tomorrow.io data:", error);
  });
}

function fetch14DayWeatherForecast(city) {
axios.get(`/weatherbit/forecast/${city}`)
    .then(response => {
        const forecastData = response.data;
        display14DayWeatherForecast(forecastData);
    })
    .catch(error => {
        console.error("Error fetching 14-day forecast data:", error);
    });
}


function displayTomorrowIoData(data) {
console.log(data);
const temp = data.data.timelines[0].intervals[0].values.temperature;

document.getElementById('tomorrowIoTemperature').textContent = `Temperature (Tomorrow.io): ${temp}°C`;
}


function display14DayWeatherForecast(data) {
const forecastTableBody = document.getElementById('forecastTableBody');
forecastTableBody.innerHTML = '';

data.data.forEach((dayData, index) => {
  if (index === 0 || index === 1) {
    return;
  }

  const date = dayData.valid_date;
  const highTemp = dayData.max_temp;
  const lowTemp = dayData.min_temp;
  const windSpeed = dayData.wind_spd;
  const humidity = dayData.rh;
  const weatherConditionCode = dayData.weather.code;

  const row = document.createElement('tr');

  const dateCell = document.createElement('td');
  dateCell.textContent = date;

  const tempCell = document.createElement('td');
  tempCell.textContent = `${highTemp}°C / ${lowTemp}°C`;

  const windCell = document.createElement('td');
  windCell.textContent = `${windSpeed} m/s`;

  const humidityCell = document.createElement('td');
  humidityCell.textContent = `${humidity}%`;

  const weatherIconCell = document.createElement('td');
  const weatherIcon = document.createElement('img');
  const iconBaseUrl = 'https://www.weatherbit.io/static/img/icons/';
  const iconUrl = `${iconBaseUrl}${dayData.weather.icon}.png`;

  weatherIcon.src = iconUrl;
  weatherIcon.alt = 'Weather Icon';
  weatherIcon.className = 'weather-icon';
  
  weatherIconCell.appendChild(weatherIcon);

  row.appendChild(dateCell);
  row.appendChild(tempCell);
  row.appendChild(windCell);
  row.appendChild(humidityCell);
  row.appendChild(weatherIconCell);

  forecastTableBody.appendChild(row);
});
}

function initMap(lat, lon) {
const map = L.map('map').setView([lat, lon], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);
L.marker([lat, lon]).addTo(map)
  .bindPopup('Location of the searched city')
  .openPopup();
}

function displayWeatherIcons(forecastData) {
forecastData.forEach(day => {
    const weatherConditionCode = day.weatherConditionCode;
    const iconBaseUrl = 'https://www.weatherbit.io/static/img/icons/';
    const iconUrl = `${iconBaseUrl}${weatherConditionCode}.png`;

    document.getElementById(`weatherIcon${day.id}`).src = iconUrl;
});
}

document.getElementById('weatherForm').addEventListener('submit', function(event) {
event.preventDefault();
const city = document.getElementById('cityName').value;
axios.post('/search-weather', { cityName: city })
  .then(response => {
  })
  .catch(error => {
    console.error("Error submitting weather search:", error);
  });
});

document.getElementById('weatherForm').addEventListener('submit', function (event) {
event.preventDefault();
const city = document.getElementById('cityName').value;
fetchWeather(city); 
fetch14DayWeatherForecast(city);
fetchWikipediaInfo(city); 
fetchCityNews(city);
});

function fetchWikipediaInfo(city) {
fetch(`/city/${city}`)
.then(response => response.json())
.then(data => {
    if (data) {
        document.getElementById('wikipediaTitle').textContent = data.title || 'City Information';
        document.getElementById('wikipediaExtract').textContent = data.extract || 'No description available.';
    }
})
.catch(error => {
    console.error('Error fetching Wikipedia data:', error);
    document.getElementById('wikipediaTitle').textContent = 'City Information';
    document.getElementById('wikipediaExtract').textContent = 'Failed to fetch description.';
});
}

function fetchWeather(city) {
  const apiKey = "00134eee3c7c04bd92ea502db2c9007a";
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(response => {
          const data = response.data;
          displayWeatherData(data);
      })
      .catch(error => {
          console.error("Error fetching data:", error);
      });
}

// Fetch city news - function from the first code snippet
function fetchCityNews(city) {
axios.get(`/news/${city}`)
    .then(response => {
        const newsData = response.data;
        allArticles = newsData.articles; 
        currentPage = 1;
        displayCityNews();
    })
    .catch(error => {
        console.error("Error fetching news:", error);
    });
}

let currentPage = 1;
const articlesPerPage = 3;
let allArticles = []; 

function displayCityNews() {
const startIndex = (currentPage - 1) * articlesPerPage;
const endIndex = startIndex + articlesPerPage;
const slicedArticles = allArticles.slice(startIndex, endIndex);

const newsContainer = document.getElementById('newsContainer');
newsContainer.innerHTML = ''; 

slicedArticles.forEach(articles => {
    const articleElement = document.createElement('div');
    articleElement.className = 'news-article';
    articleElement.innerHTML = `
        <div class="news-image-container">
            <img src="${articles.image}" alt="${articles.title}" onerror="this.onerror=null;this.src='default-image-path.jpg';">
        </div>
        <h3><a href="${articles.url}" target="_blank">${articles.title}</a></h3>
        <p>${articles.description}</p>
    `;
    newsContainer.appendChild(articleElement);
});

updatePaginationControls(allArticles.length);
}

function updatePaginationControls(totalArticles) {
const totalPages = Math.ceil(totalArticles / articlesPerPage);
const paginationContainer = document.getElementById('paginationContainer');
paginationContainer.innerHTML = ''; 

for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.innerText = i;
    pageButton.onclick = function() {
        currentPage = i;
        displayCityNews();
    };
    paginationContainer.appendChild(pageButton);
}
}

function fetchNasaAPOD() {
  axios.get('/nasa')
    .then(response => {
      const apodData = response.data;
      displayNasaAPOD(apodData);
    })
    .catch(error => {
      console.error("Error fetching NASA APOD:", error);
    });
}

function displayNasaAPOD(data) {
  document.getElementById('apodTitle').textContent = data.title;
  document.getElementById('apodImage').src = data.url;
  document.getElementById('apodExplanation').textContent = data.explanation;
}

document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting traditionally
  const symbol = document.querySelector('input[name="symbol"]').value;
  fetchCryptoInfo(symbol); // Call the function to fetch and update the info
});

function fetchCryptoInfo(symbol) {
  axios.get(`/crypto/${symbol}`)
      .then(response => {
          const cryptoData = response.data.cryptoData;
          // Update page content
          displayCryptoInfo(symbol, cryptoData.DISPLAY[symbol].USD);
          // Update the chart
          updateChart(cryptoData.RAW[symbol].USD, symbol);
      })
      .catch(error => {
          console.error("Error fetching cryptocurrency information:", error);
      });
}

function displayCryptoInfo(symbol, data) {
  document.getElementById('cryptoPrice').textContent = `Price: ${data.PRICE}`;
  document.getElementById('cryptoChange24h').textContent = `24h Change: ${data.CHANGE24HOUR}`;
  document.getElementById('cryptoMarketCap').textContent = `Market Cap: ${data.MKTCAP}`;
  document.getElementById('cryptoSymbol').textContent = symbol;
  document.getElementById('chartSymbol').textContent = symbol;
  // Update the heading to reflect the searched cryptocurrency
  document.querySelector('h1').textContent = `Cryptocurrency Information for ${symbol}`;
}

// Function to update the chart with new data
function updateChart(priceData, symbol) {
  const timestamps = Object.keys(priceData).map(timestamp => new Date(timestamp * 1000));
  const prices = Object.values(priceData).map(entry => entry.PRICE);

  // Get the canvas element
  const ctx = document.getElementById('cryptoChart').getContext('2d');

  // Create the chart
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timestamps,
      datasets: [{
        label: 'Price (USD)',
        data: prices,
        borderColor: 'blue',
        fill: false
      }]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Price (USD)'
          }
        }
      }
    }
  });
}
function switchLanguage(language) {
  if (language === 'en') {
      document.getElementById('en-content').style.display = 'block';
      document.getElementById('ru-content').style.display = 'none';
      localStorage.setItem('language', 'en');
  } else if (language === 'ru') {
      document.getElementById('en-content').style.display = 'none';
      document.getElementById('ru-content').style.display = 'block';
      localStorage.setItem('language', 'ru');
  }
}

window.onload = function() {
  var language = localStorage.getItem('language');
  if (language === 'ru') {
      switchLanguage('ru');
  } else {
      switchLanguage('en'); 
  }
}