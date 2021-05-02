const fs = require('fs');
const mv = require('mv');
const ytdl = require('ytdl-core');
const express = require('express')
const app = express()
const cors = require('cors');
const port = 8080

app.use(cors());

app.get('/save', (req, res, next) => {
    try {
        console.log('downloading video', req.query.id, decodeURIComponent(req.query.title));
        
        let id = req.query.id;
        let title = decodeURIComponent(req.query.title);

        if (!id || !title) {
            throw new Error("Invalid params");
        }

        // remove invalid chars from title
        let videoName = title + '.mp4';
        videoName = videoName.replace(/[/\\?%*:|"<>]/g, '-');

        let videoUrl = `https://www.youtube.com/watch?v=${id}`;

        // download video
        let stream = ytdl(videoUrl).pipe(fs.createWriteStream(videoName));
        stream.on('finish', function () {

            // on finish move to H:\
            console.log('finish');
            mv(videoName, 'H:\\' + videoName, (err) => { if (err) console.log(err); });
            return res.send('ok')
        });

    } catch (error) {
        console.log(error);
        next()
    }

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
