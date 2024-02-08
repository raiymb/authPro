const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const axios = require('axios');
const session = require('express-session');
const { default: mongoose } = require('mongoose');
const app = express();
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');
const pageRoutes = require('./routes/pages');
const cityInfoRoute = require('./routes/cityInfoRoute');
const uri = "mongodb+srv://admin:admin@raiymbekcluster.ls69hzs.mongodb.net/authUserWeather?retryWrites=true&w=majority";

mongoose
  .connect(uri)
  .then(() => {
    console.info("Connected to the DB");
  })
  .catch((e) => {
    console.log("Error: ", e);
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(session({
    secret: 'egojajojefofj12398u1ej1io',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }));
  
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  
  app.use(authRoutes);
  app.use(weatherRoutes);
  app.use(pageRoutes);
  app.use('/city',cityInfoRoute);
  
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
