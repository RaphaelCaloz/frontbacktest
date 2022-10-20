const express = require('express')
const path = require('path')
const request = require('request')

const app = express()
const port = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'build')))

// all backend api code here
app.get('/api/xkcd/:comicId', (req, res) => {
    // If comicId is valid, get that comic's data
    request(`https://xkcd.com/${req.params.comicId}/info.0.json`, { json: true }, (err, response, body) => {
        if (err) { return console.log(err) }
        res.json(body)
    })
})

app.get('/api/xkcd', (req, res) => {
    request(`https://xkcd.com/info.0.json`, { json: true }, (err, response, body) => {
        if (err) { return console.log(err) }
        res.json(body)
    })
})

app.get('/api', (req, res) => {
    res.json({
        message: 'This is the api endpoint'
    })
})

// Default routes
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(port, _ => {
    console.log(`Server started on port ${port}.`)
})