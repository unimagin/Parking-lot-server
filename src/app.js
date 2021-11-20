const express = require('express')
const cors = require('cors')
const userRouter = require('./routers/user')
const parkRouter = require('./routers/park')
const carRouter = require('./routers/car')
const reservationRouter = require('./routers/reservation')

const app = express()

app.use(cors())
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Credentials', true)
    next()
})
app.use(express.json())
app.use(userRouter)
app.use(parkRouter)
app.use(carRouter)
app.use(reservationRouter)

module.exports = app