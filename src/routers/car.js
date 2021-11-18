const express = require('express')
const Car = require('../models/car')
const UserCar = require('../models/usercar')
const router = new express.Router()

router.post('/user/add_car', async (request, response) => {
    const body = request.body
    try {
        const car = await Car.findOne({ where: {car_number: body.car_number}})
        if (car == null) {
            await Car.create({car_number: body.car_number, remark: body.remark})
        }
        await UserCar.create({user_ID: body.user_ID, car_number: body.car_number})
        response.status(200).send(car)
    } catch(error) {
        response.status(400).send(error)
    }
});

router.post('/user/update_car', async (request, response) => {
    const body = request.body
    try {
        const car = await Car.findOne({where: {car_number: body.car_number}})
        if (car == null) {
            throw new Error()
        }
        if (body.remark != undefined) {
            car.remark = body.remark
            await car.save()
        }
        response.status(200).send(car)
    } catch(error) {
        response.status(400).send(error)
    }
});

module.exports = router