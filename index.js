const express = require('express');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.get('/', (req, res) => {
    res.send("Server is Running! Use /download?url=YOUR_URL");
});

app.get('/download', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "URL missing" });

    try {
        const info = await ytdl.getInfo(videoUrl);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });

        if (format && format.url) {
            res.json({ downloadLink: format.url, title: info.videoDetails.title });
        } else {
            res.status(404).json({ error: "Link nahi mili" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = app;
