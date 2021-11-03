const express = require('express')
const router = new express.Router()

router.post('/user/reservation', async (request, response) => {
    try {
        const base = request.body.floor_level * 50
        let array = new Array(50)
        for (let i = 0; i < 50; ++i) {
            array[i] = {parking_number: base + i, status: i%3+1}
        }
        response.send(array)
    } catch(error) {
        response.status(400).send(error)
    }
})

module.exports = router