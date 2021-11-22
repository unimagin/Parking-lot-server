const express = require('express')
const Reservation = require('../models/reservation')
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
      arrive_time: arrive_time
    })
    reservation.save()
    response.send('using')
  }
  catch (error) {
    response.status(400).send(error)
  }
})

router.post('/user/appoint', authentication, async (request, response) => {
  let { car_number, parking_number, begin_time, end_time, reservation_ID } = request.body
  const { user_ID } = request.user
  try {
    begin_time = new Date(begin_time)
    end_time = new Date(end_time)
    begin_timestamp = Date.parse(begin_time)
    end_timestamp = Date.parse(end_time)
    let reservs = await Reservation.findAll({ where: { parking_number } })
    reservs = reservs.map((x) => {
      x.begin_timestamp = Date.parse(x.begin_time)
      x.end_timestamp = Date.parse(x.end_time)
      return x
    })
    let available = true
    for (let i = 0; i < reservs.length; ++i) {
      if (reservs[i].reservation_ID == reservation_ID) { continue }
      else if (reservs[i].end_timestamp <= begin_timestamp || reservs[i].begin_timestamp >= end_timestamp) { continue }
      available = false
      break
    }
    if (!available) {
      throw new Error('Appointment failed. Time is not availble')
    }
    let reservation = null
    if (reservation_ID != undefined) {
      reservation = await Reservation.findByPk(reservation_ID)
    }
    if (reservation == null) { //请求中没有id，或传来不存在的id，新建
      reservation = await Reservation.create({ user_ID, car_number, parking_number, begin_time, end_time })
    }
    else { //修改
      reservation.begin_time = begin_time
      reservation.end_time = end_time
      await reservation.save()
    }
    response.send({ state: true, reservation })
  } catch (error) {
    response.status(400).send({ state: false })
  }
})

module.exports = router