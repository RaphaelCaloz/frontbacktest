const express = require('express')
const path = require('path')
const request = require('request')
const {Client} = require('pg')

const app = express()
const port = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'build')))

// All backend api routes
app.get('/api/xkcd/maxComicId', (req, res) => {
    request(`https://xkcd.com/info.0.json`, { json: true }, (err, response, body) => {
        if (err) { return console.log(err) }
        res.json({
            maxComicId: body.num
        })
    })
})

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

app.get('/api/psql/comicViews/:comicId', (req, res) => {
    const client = new Client({
        //connectionString: 'postgres://weqlqgagxqhbkc:da49d5cd8848c80cc776e18cf267d3735fc9ddd863991a326be455ece7be326c@ec2-44-210-228-110.compute-1.amazonaws.com:5432/d9h93g0deaqdos',
        connectionString: process.env.DATABASE_URL,  // Replace by connectionString for local testing
        ssl: { rejectUnauthorized: false }
    })
    // console.log("#### CLIENT ###")
    // console.log(client)


    // res.json({
    //     connectionString: process.env.DATABASE_URL
    // })


    client.connect()

    // This query should return at most 1 entry, as "comic_num" column values are unique
    client.query(`SELECT comic_views FROM views WHERE comic_num = ${req.params.comicId}`, (err, psqlRes) => {
        if (err) { return console.error(err) }
        // console.log("typeof: ", typeof psqlRes.rows)
        // console.log("len: ", psqlRes.rowCount)
        for (let row of psqlRes.rows) {
            console.log(JSON.stringify(row))
        }
        let numViews = 0
        if (psqlRes.rowCount > 0) {
            numViews = psqlRes.rows[0].comic_views
        }

        res.json({
            comicViews: numViews
        })
    })
})
    // Check if the entry for comicId exists
    // const query = `SELECT comic_views FROM views WHERE comic_num = ${req.params.comicId}`
    // client.query(query, (err, sqlResponse) => {
    //     if (err) { return console.error(err) }
    //     console.log("### SQL RESPONSE ###")
    //     console.log(sqlResponse)
    //     client.end()
    //     res.json({
    //         message: "psql endpoint"
    //     })
    // })


// Default routes. Used to access the frontend.
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(port, _ => {
    console.log(`Server started on port ${port}.`)
})