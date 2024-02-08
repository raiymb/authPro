const express = require('express');
const axios = require('axios');
const SearchLog = require('../models/Search');
const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      try {
        const apiKey = 'eb487c460284448691cbd0930d6d45c8';
        let city = 'Astana'; 
  
        if (req.session.user.lastSearchedCity) {
          city = req.session.user.lastSearchedCity;
        }
  
        const apiUrl = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}&units=metric`;
  
        const response = await axios.get(apiUrl);
        const weatherData = response.data;
  
        res.render('index', { data: weatherData });
      } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error fetching weather data');
      }
    }
  });
  
  router.post('/', async (req, res) => {
      try {
          const cityName = req.body.cityName;
          const apiKey = 'https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric'
  
  
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
          const response = await axios.get(apiUrl);
          const weatherData = response.data;
  
          res.render('index', { data: weatherData });
      } catch (error) {
          console.error('Error fetching weather data:', error);
          res.status(500).send('Error fetching weather data');
      }
  });
  
  router.get('/climacell/:lat/:lon', async (req, res) => {
      const { lat, lon } = req.params;
      const climacellApiKey = "eAug0eZBRrEu5tfx54VMicw8gb6B1KyB";
      try {
        const response = await axios.get(`https://api.tomorrow.io/v4/timelines`, {
          params: {
            location: `${lat},${lon}`,
            fields: ['temperature', 'weatherCode', 'precipitationIntensity'],
            timesteps: ['1h'],
            units: 'metric',
            apikey: climacellApiKey,
          }
        });
        res.json(response.data);
      } catch (error) {
        console.error("Error fetching Tomorrow.io data:", error);
        res.status(500).json({ error: error.message });
      }
    });
  
    router.get('/weatherbit/:city', async (req, res) => {
      const city = req.params.city;
      const weatherbitApiKey = "eb487c460284448691cbd0930d6d45c8";
      try {
        const response = await axios.get(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${weatherbitApiKey}`);
        console.log(response.data);
        res.json(response.data);
      } catch (error) {
        console.error("Error fetching Weatherbit data:", error);
        res.status(500).json({ error: error.message });
      }
    });
  
    router.get('/weatherbit/forecast/:city', async (req, res) => {
      const city = req.params.city;
      const weatherbitApiKey = "eb487c460284448691cbd0930d6d45c8";
      try {
          const response = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${weatherbitApiKey}&days=16`);
          res.json(response.data);
      } catch (error) {
          console.error("Error fetching Weatherbit forecast data:", error);
          res.status(500).json({ error: error.message });
      }
  });
  
  router.post('/search-weather', async (req, res) => {
    if (!req.session.user) {
      res.redirect('/login');
      return;
    }
  
    try {
      const cityName = req.body.cityName;
      const apiKey = 'eb487c460284448691cbd0930d6d45c8';
      const apiUrl = `https://api.weatherbit.io/v2.0/current?city=${cityName}&key=${apiKey}&units=metric`;
      
      const response = await axios.get(apiUrl);
      const weatherData = response.data;
  
      console.log('City Name:', cityName);
      
      const newLog = new SearchLog({
        username: req.session.user.username,
        citySearched: cityName,
        searchTime: new Date(),
        weatherData: weatherData
      });
  
      await newLog.save();
  
      res.render('index', { data: weatherData });
    } catch (error) {
      console.error('Error in search weather:', error);
      res.status(500).send('Error processing your request');
    }
  });

  
module.exports = router;
  
  