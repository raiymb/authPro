const express = require('express');
const SearchLog = require('../models/Search');
const ApiLog = require('../models/ApiLog');
const router = express.Router();

router.get('/searchlogs', async (req, res) => {
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


router.get('/about', (req, res) => {
    res.render('about');
})

router.get('/searchlogs', async (req, res) => {
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

router.get('/api-logs', async (req, res) => {
  try {
      const logs = await ApiLog.find({}).sort('-timestamp'); 
      res.render('apiLog', { logs: logs });
  } catch (error) {
      console.error('Error fetching API logs:', error);
      res.status(500).send('Error fetching API logs');
  }
});


module.exports = router;