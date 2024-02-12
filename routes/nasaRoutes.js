const express = require('express');
const axios = require('axios');
const router = express.Router();
const ApiLog = require('../models/ApiLog');

const fetchNasaAPOD = async () => {
    const apiKey = "VqTQkFa5c25k7pkDZleVIacN6gQcT8ux5BRdhMnF";
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching NASA APOD:', error);
        throw error;
    }
};

router.get('/', async (req, res) => {
    try {
        const apodData = await fetchNasaAPOD();

        await new ApiLog({
            username: req.session.user ? req.session.user.username : 'anonymous',
            apiType: 'nasa',
            requestDetails: {},
            responseDetails: apodData,
            timestamp: new Date()
        }).save();

        res.render('apod', { apodData: apodData });
    } catch (error) {
        console.error('Error fetching NASA APOD:', error);
        res.status(500).send('Error fetching NASA APOD.');
    }
});


module.exports = router;
