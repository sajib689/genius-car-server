const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000;
app.use(cors())
app.use(express.json())
const services = require('./services.json')
app.get('/', (req, res) => {
    res.send('Welcome the server is response')
})
app.get('/services', (req, res) => {
    res.send(services)
})
app.listen(port, () => {
    console.log(`The response port ${port}`)
})