const express = require('express');
const axios = require('axios');
const router = express.Router();

const fetchCityInfo = async (city) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`;
    try {
        const response = await axios.get(url);
        const { title, extract } = response.data;
        return { title, extract };
    } catch (error) {
        console.error(`Error fetching information for city: ${city}`, error);
        throw error; 
    }
};

router.get('/:city', async (req, res) => {
    try {
        const cityName = req.params.city;
        const cityInfo = await fetchCityInfo(cityName);
        res.json(cityInfo); 
    } catch (error) {
        console.error('Error fetching city information:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
