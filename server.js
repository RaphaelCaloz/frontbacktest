const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'build')))

// all your api code here
app.get('/api', (req, res) => {
    res.json({
        message: 'This is the api endpoint'
    })
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(port, _ => {
    console.log(`Server started on port ${port}.`)
})