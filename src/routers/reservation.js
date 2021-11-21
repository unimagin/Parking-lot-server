const express = require('express')
const Reservation = require('../models/reservation')
const authentication = require('../middleware/auth')
const router = new express.Router()

router.post('/reservation/change_used', async (request, response) => {
  const { row, now } = request.body
  const reservation_ID = row.reservation_ID
  const arrive_time = now
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
    response.status(200).send('using')
  }
  catch (error) {
    response.status(400).send(error)
  }
})

router.post('/user/appoint', authentication, async (request, response) => {
  let {car_number, parking_number, begin_time, end_time} = request.body
  const {user_ID} = request.user
  try {
      begin_time = new Date(begin_time)
      end_time = new Date(end_time)
      begin_timestamp = Date.parse(begin_time)
      end_timestamp = Date.parse(end_time)
      let reservs = await Reservation.findAll({where: {parking_number}})
      reservs = reservs.map((x) => {
          x.begin_timestamp = Date.parse(x.begin_time)
          x.end_timestamp = Date.parse(x.end_time)
          return x
      })
      reservs = reservs.sort((x1, x2) => {
          return x1.begin_timestamp - x2.begin_timestamp
      })
      
      let left = 0, right = reservs.length - 1, mid, avaliable = true
      while (left <= right) {
        mid = Math.floor((left + right)/2)
        if (reservs[mid].end_timestamp <= begin_timestamp) {
          left = mid + 1
        }
        else if (reservs[mid].begin_timestamp >= end_timestamp) {
          right = mid - 1
        }
        else {
          avaliable = false
          break
        }
      }
      if (!avaliable) {
        throw new Error('Appointment failed. Time is not availble')
      }
      await Reservation.create({user_ID, car_number, parking_number, begin_time, end_time})
      response.send({state:true})
  } catch(error) {
      response.status(400).send({state: false})
  }
})

module.exports = router