const express = require('express')
const { Op } = require('sequelize');
const Reservation = require('../models/reservation')
const Park = require('../models/park')
const authentication = require('../middleware/auth')
const router = new express.Router()

router.post('/user/reservation/change_used', async (request, response) => {
    const { reservation_ID, arrive_time } = request.body
    try {
        const reservation = await Reservation.findOne({ where: { reservation_ID: reservation_ID } })
        if (reservation == null) {
            throw new Error("Reservation not exist")
        }
        reservation.update({
            used: 1,
            arrive_time: new Date(arrive_time)
        })
        const park = await Park.findOne({ where: { parking_number: reservation.parking_number } })
        park.status = 1 //修改车位状态
        await park.save()
        reservation.save()
        response.send('using')
    }
    catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/reservation/modify_reservation', async (request, response) => {
    const { reservation_ID, car_number } = request.body
    try {
        const reservation = await Reservation.findOne({ where: { reservation_ID: reservation_ID } })
        if (reservation == null) {
            throw new Error("Reservation not exist")
        }
        reservation.update({
            car_number: car_number
        })
        reservation.save()
        response.send('success modify')
    }
    catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/appoint', authentication, async (request, response) => {
    let { car_number, parking_number, begin_time, end_time, reservation_ID, r_date } = request.body
    const { user_ID } = request.user
    try {
        r_date = new Date(r_date)
        begin_time = new Date(begin_time)
        end_time = new Date(end_time)
        let reservation = null
        let available = await Reservation.isAvailable(parking_number, begin_time, end_time, reservation_ID)
        if (available) {
            if (reservation_ID == undefined) { //添加预约
                reservation = await Reservation.create({ user_ID, car_number, parking_number, r_date, begin_time, end_time })
            } else { //修改预约
                reservation = await Reservation.findByPk(reservation_ID)
                reservation.parking_number = parking_number
                reservation.begin_time = begin_time
                reservation.end_time = end_time
                reservation.r_date = r_date
                await reservation.save()
            }
        } else {
            throw new Error("Time is not available")
        }
        response.send({ state: true, reservation })
    } catch (error) {
        response.status(400).send({ state: false })
    }
})

router.post('/user/reservation', async (request, response) => {
    try {
        const parks_per_floor = process.env.PARKS_PER_FLOOR
        const floor_level = request.body.floor_level - 1 //request的楼层从1开始
        const begin_time = Date.parse(request.body.begin_time)
        const end_time = Date.parse(request.body.end_time)
        const begin = floor_level * parks_per_floor + 1 // 起始车位号
        const end = (floor_level + 1) * parks_per_floor // 楼层结束车位号
        let parks_array = new Array(parks_per_floor)
        for (let i = 0; i < parks_per_floor; ++i) {
            parks_array[i] = { parking_number: begin + i, status: 0, reservation_num: 0 }
        }
        reservs = await Reservation.findAll({ where: { parking_number: { [Op.gte]: begin, [Op.lte]: end } } }) //选取对应楼层预约记录
        let index = 0
        reservs.forEach(element => {
            if (end_time <= element.begin_time.getTime() || begin_time >= element.end_time.getTime()) { }
            else {
                index = (element.parking_number - 1) % parks_per_floor
                parks_array[index].status = 1 //如果有查询时间段的预约记录，记录车位状态为不可用
                parks_array[index].reservation_num++
            }
        });
        response.send(parks_array)
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/park/repark', authentication, async (request, response) => {
    try {
        const reservation = await Reservation.findByPk(request.body.reservation_ID)
        if (reservation == null) {
            throw new Error('Reservation not found')
        }
        let avaliable = false
        const total_parks = process.env.TOTAL_PARKS
        for (let i = 1; i <= total_parks; ++i) {
            if (i == reservation.parking_number) { continue }
            avaliable = await Reservation.isAvailable(i, reservation.begin_time, reservation.end_time)
            if (avaliable) { //已找到新的同时段可用车位，调整预约车位
                reservation.parking_number = i
                await reservation.save()
                break
            }
        }
        if (!avaliable) { throw new Error('Sorry, there is no avaiable place') } // 没有相同时段可用车位
        response.send({ parking_number: reservation.parking_number })
    } catch (error) {
        response.status(400).send(error.message)
    }
})

router.post('/user/park/parkWithoutAppoint', authentication, async (request, response) => {
    try {
        let { car_number, begin_time, end_time } = request.body
        const user = request.user
        begin_time = new Date(begin_time)
        end_time = new Date(end_time)
        const r_date = new Date(begin_time.toDateString())
        let parking_number = null
        let avaliable = false
        const total_parks = process.env.TOTAL_PARKS
        for (let i = 1; i <= total_parks; ++i) {
            avaliable = await Reservation.isAvailable(i, begin_time, end_time)
            if (avaliable) { //找到车位，创建预约
                parking_number = i
                await Reservation.create({ user_ID: user.user_ID, car_number, parking_number, r_date, begin_time, end_time })
                break
            }
        }
        if (!avaliable) { throw new Error('Sorry, there is no avaiable place') } // 没有相同时段可用车位
        response.send({ parking_number })
    } catch (error) {
        response.status(400).send(error.message)
    }

})

module.exports = router