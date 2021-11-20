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
            car = await Car.create({car_number})
        }
        await UserCar.create({ user_ID: user.user_ID, car_number, remark })
        response.status(200).send(car)
    } catch(error) {
        response.status(400).send(error)
    }
})

router.post('/user/update_car', authentication, async (request, response) => {
    const { car_number, remark } = request.body
    const user = request.user
    try {
        const usercar = await UserCar.findOne({ where: { user_ID: user.user_ID, car_number } })
        if (usercar == null) {
            throw new Error('Car not found')
        }
        if (remark != undefined) {
            usercar.remark = remark
            await usercar.save()
        }
        response.status(200).send(usercar)
    } catch(error) {
        response.status(400).send(error)
    }
})

router.post('/user/look_cars', authentication, async (request, response) => {
    const user = request.user
    try {
        let cars = await UserCar.findAll({ where: {user_ID: user.user_ID}})
        cars = cars.map(({car_number, remark}) => {
            return {car_number, remark}
        })
        response.send(cars)
    } catch(error) {
        response.status(400).send(error)
    }
})

module.exports = router