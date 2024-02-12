const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const ApiLog = require('../models/ApiLog');

router.get('/download-api-logs', async (req, res) => {
    try {
        const logs = await ApiLog.find({}).sort('-timestamp');

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Log History</title>
    <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
    </style>
</head>
<body>
    <h2>API Log History</h2>
    <table>
        <thead>
            <tr>
                <th>Username</th>
                <th>API Type</th>
                <th>Request Details</th>
                <th>Response</th>
                <th>Timestamp</th>
            </tr>
        </thead>
        <tbody>
            ${logs.map(log => `
                <tr>
                    <td>${log.username}</td>
                    <td>${log.apiType}</td>
                    <td>${JSON.stringify(log.requestDetails)}</td>
                    <td>${JSON.stringify(log.responseDetails)}</td>
                    <td>${log.timestamp}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`;

        await page.setContent(content);

        const pdf = await page.pdf({ format: 'A4' });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=api_logs.pdf');

        res.send(pdf);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

module.exports = router;
