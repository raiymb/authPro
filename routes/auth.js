const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); 
const router = express.Router();


router.get('/register', (req, res) => {
    res.render('register');
  });
  
  router.post('/register', async (req, res) => {
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

  
  router.get('/login', (req, res) => {
    res.render('login');
  });
  
  router.post('/login', async (req, res) => {
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

  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error while logging out:', err);
        res.status(500).send('Error logging out');
      } else {
        res.redirect('/login'); 
      }
    });
  });

  
module.exports = router;