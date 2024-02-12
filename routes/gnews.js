const express = require('express');
const router = express.Router();
const axios = require('axios');

const ApiLog = require('../models/ApiLog');
const api = "4d3ad8034c7570feea6db2e441eb2f0a";

const fetchNews = async (query) => {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&apikey=${api}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
};

router.get('/news/:city', async (req, res) => {
    const city = req.params.city;
    try {
        const newsData = await fetchNews(city);

        await new ApiLog({
            username: req.session.user ? req.session.user.username : 'anonymous',
            apiType: 'gnews',
            requestDetails: { city },
            responseDetails: newsData,
            timestamp: new Date()
        }).save();

        res.json(newsData);
    } catch (error) {
        console.error('Error fetching news data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
