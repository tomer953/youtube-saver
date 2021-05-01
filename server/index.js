const express = require('express')
const app = express()
const cors = require('cors');
const port = 8080

app.use(cors());

app.get('/save', (req, res) => {
    console.log('downloading video', req.query.id, decodeURIComponent(req.query.title))
    setTimeout(() => res.send('Saved'), 1500);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})