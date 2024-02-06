const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const axios = require('axios');
const session = require('express-session');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const SearchLog = require('./models/Search');
const app = express();

const uri = "mongodb+srv://admin:admin@raiymbekcluster.ls69hzs.mongodb.net/authUserWeather?retryWrites=true&w=majority";

mongoose
  .connect(uri)
  .then(() => {
    console.info("Connected to the DB");
  })
  .catch((e) => {
    console.log("Error: ", e);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Both fields are required');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    const user = new User({ username, password });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



app.get('/', async (req, res) => {
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


app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/searchlogs', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }

  try {
    const searchLogs = await SearchLog.find({ username: req.session.user.username });

    res.render('searchlogs', { searchLogs: searchLogs });
  } catch (error) {
    console.error('Error fetching search logs:', error);
    res.status(500).send('Error fetching search logs');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.render('login', { message: 'Both fields are required' });
      return;
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.render('login', { message: 'Invalid username or password' });
      return;
    }

    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).render('login', { message: 'Server error' });
  }
});

app.post('/', async (req, res) => {
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

app.get('/climacell/:lat/:lon', async (req, res) => {
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

app.get('/weatherbit/:city', async (req, res) => {
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

app.get('/weatherbit/forecast/:city', async (req, res) => {
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

app.post('/search-weather', async (req, res) => {
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

app.get('/searchlogs', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }

  try {
    const searchLogs = await SearchLog.find({ username: req.session.user.username });

    res.render('searchlogs', { searchLogs: searchLogs });
  } catch (error) {
    console.error('Error fetching search logs:', error);
    res.status(500).send('Error fetching search logs');
  }
});



app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error while logging out:', err);
      res.status(500).send('Error logging out');
    } else {
      res.redirect('/login'); 
    }
  });
});
