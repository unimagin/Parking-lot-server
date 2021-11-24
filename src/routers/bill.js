const express = require('express')
const Bill = require('../models/bill')
const Reservation = require('../models/reservation')
const router = new express.Router()

router.post('/user/bill/generate_bill', async (request, response) => {
  const reservation = request.body
  try {
    const begin = new Date(reservation.begin_time)
    const begin_time = begin.getTime()
    const end = new Date(reservation.end_time)
    const end_time = end.getTime()
    const leave = new Date()
    const leave_time = leave.getTime()
    const arrive = new Date(reservation.arrive_time)
    const arrive_time = arrive.getTime()
    let status = 0, money = 0
    if (arrive_time > begin_time) {
      status = 1
    }
    if (leave_time > end_time) {
      status = 3
    }
    if (arrive_time > begin_time && leave_time > end_time) {
      status = 4
    }
    await Bill.create(
      {
        car_number: reservation.car_number,
        user_ID: reservation.user_ID,
        arrive_time: arrive,
        leave_time: leave,
        begin_time: begin,
        end_time: end,
        money: 1,
        status: status,
        isPaid: 0
      }
    )
    await Reservation.destroy({
      where: { reservation_ID: reservation.reservation_ID }
    })
    response.send('success generate')
  } catch (error) {
    response.status(400).send(error)
  }
})

router.post('/user/bill/pay_bill', async (request, response) => {
  const bill_ID = request.body
  try {
    const bill = await Bill.findOne({ where: bill_ID })
    if (bill == null) {
      throw new Error('Bill not exist')
    }
    bill.update({
      isPaid: 1
    })
    bill.save()
    response.send('pay success')
  }
  catch (error) {
    response.status(400).send(error)
  }
})

module.exports = router