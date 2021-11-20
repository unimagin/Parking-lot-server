const express = require('express')
const Car = require('../models/car')
const UserCar = require('../models/usercar')
const authentication = require('../middleware/auth')
const router = new express.Router()

router.post('/user/add_car', authentication, async (request, response) => {
    const { car_number, remark } = request.body
    const user = request.user
    try {
        let car = await Car.findByPk(car_number)
        if (car == null) {
            car = await Car.create({car_number, remark})
        }
        await UserCar.create({user_ID: user.user_ID, car_number})
        response.status(200).send(car)
    } catch(error) {
        response.status(400).send(error)
    }
});

router.post('/user/update_car', async (request, response) => {
    const { car_number, remark } = request.body
    try {
        const car = await Car.findByPk(car_number)
        if (car == null) {
            throw new Error('Car does not exists')
        }
        if (remark != undefined) {
            car.remark = remark
            await car.save()
        }
        response.status(200).send(car)
    } catch(error) {
        response.status(400).send(error)
    }
});

module.exports = router