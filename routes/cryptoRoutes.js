const express = require('express');
const axios = require('axios');
const router = express.Router();
const ApiLog = require('../models/ApiLog');

const fetchCryptoInfo = async (symbol) => {
    const api = "6702e62fa2d94c86d0a9ed8a4e9bcbe350ff9f78577d893f040a3fe3234b40ac"; 
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${api}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching cryptocurrency information:', error);
        throw error;
    }
};

router.get('/crypto', async (req, res) => {
    const symbol = req.query.symbol ? req.query.symbol.toUpperCase() : 'BTC';
    try {
        const cryptoData = await fetchCryptoInfo(symbol);
        await new ApiLog({
            username: req.session.user ? req.session.user.username : 'anonymous',
            apiType: 'crypto',
            requestDetails: { symbol },
            responseDetails: cryptoData,
            timestamp: new Date()
        }).save();

        if (req.accepts('html')) {
            res.render('crypto', { cryptoData: cryptoData, symbol: symbol });
        } else if (req.accepts('json')) {
            res.json({ cryptoData: cryptoData, symbol: symbol });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching cryptocurrency information.');
    }
});


module.exports = router;
