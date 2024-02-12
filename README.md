Heroku link:https://derbes-weather-af918e129cf8.herokuapp.com/login


admin: raiymbek_batyr
password: 12345678


regular user: Raiymbek
password: 123456


admin page have 2 language

api history have ability to download the pdf history


# Derbes Weather

This is a full-featured application built with Node.js and Express, integrating various external APIs to provide weather information, user management, API request logging, and more. It allows users to search for weather data, view city information from Wikipedia, manage user accounts (including registration, login, and administration), and review historical API requests.

## Features

- **User Authentication**: Register, log in, and manage user sessions.
- **Weather Data**: Display current weather, forecasts, and air quality index from multiple sources.
- **City Information**: Fetch and display summaries from Wikipedia for searched cities.
- **API Request Logging**: Log details of external API requests in MongoDB.
- **Admin Panel**: An interface for managing users and viewing API request logs.
- **Dynamic Content**: Client-side JavaScript for dynamic content updates.
- **PDF Reporting**: Generate and download PDF reports of API logs using Puppeteer.
- **Cryptocurrency Data**: Fetch and display cryptocurrency information from Cryptocompare.
- **News Articles**: Display news articles related to city searches using the GNews API.
- **NASA's Astronomy Picture of the Day (APOD)**: Integrate NASA's APOD API for daily space-related images.

## Technologies

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Frontend**: HTML, CSS, JavaScript
- **APIs**: OpenWeatherMap, Weatherbit, Tomorrow.io, Wikipedia, GNews, Cryptocompare, NASA APOD
- **Security**: bcryptjs for password hashing
- **HTTP Requests**: axios
- **PDF Generation**: Puppeteer

## Main Entry

- **Main**: server.js

## Engines

The application is configured to run with specific versions of Node.js and npm:
- **Node.js**: 18.17.1
- **npm**: 9.6.7

Ensure your development environment matches these versions for compatibility.

## Dependencies

The application uses the following npm packages as its dependencies:

- **axios** `^1.6.5`: For making HTTP requests.
- **bcryptjs** `^2.4.3`: For hashing and checking passwords.
- **ejs** `^3.1.9`: As a templating engine.
- **express** `^4.18.2`: For the web server framework.
- **express-session** `^1.18.0`: For session management.
- **https** `^1.0.0`: For HTTPS operations.
- **mongoose** `^8.1.1`: For MongoDB object modeling.
- **path** `^0.12.7`: For handling and transforming file paths.
- **puppeteer** `^22.0.0`: For automated browser tasks, useful for generating PDFs, etc.


## Installation

1. **Clone the repository:**
   git clone -b main https://github.com/raiymb/authPro.git

   npm install

   node server.js

   also this heroku link:https://derbes-weather-af918e129cf8.herokuapp.com/login

   


