const express = require('express')

const Car = require('../models/car')
const Connection = require("../models/connect_car_and_user")
const {where} = require("sequelize");
const router = new express.Router()

router.post('/user/addcar', async (request, response) => {
    console.log("hhhhh");
    const body = request.body
    var car = await Car.findOne({where: {car_number: body.car_number}})
    if (car == null) {
        car = await Car.create(body.car_number);
    }
    const connection = await Connection.findOne({where: {car_ID: car.car_ID, user_ID: body.user.user_ID}});
    if (connection != null) {
        throw new Error("already exist")
    } else {
        const newConnection = {
            car_ID: car.car_ID,
            user_ID: body.user.user_ID,
            remark: body.remark,
        }
        const newConnect = await Connection.create(newConnection);
        if (newConnect) {
            var carArray = await Connection.findAll({
                attributes: ['car_ID', 'remark'],
                where: {user_ID: body.user.user_ID}
            })
            console.log(carArray);
            for (let i = 0; i < carArray.length; i++) {
                carArray[i].car_number = await Car.findOne(
                    {attributes: ['car_number'],
                        where: {car_ID: carArray[i].car_ID}});
            }
            // var cars=await Connection.findOne
            response.status(200).send({state: true})
        }
    }
});
module.exports = router