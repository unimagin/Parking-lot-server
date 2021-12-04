const express = require('express')
const Bill = require('../models/bill')
const User = require('../models/user')
const Reservation = require('../models/reservation')
const authentication = require('../middleware/auth')
const router = new express.Router()

router.post('/user/bill/generate_bill', authentication, async (request, response) => {
  const user = request.user
  let violation = user.violation
  const kind = user.kind
  let unit = 0, delay_unit = 0
  switch (kind) {
    case 0:
      unit = 5
      delay_unit = 10
      break
    case 1:
      unit = 2.5
      delay_unit = 5
      break
    case 2:
      unit = 1
      delay_unit = 8
  }
  const reservation = request.body
  try {
    user.update({
      total: user.total + 1
    })
    user.save()
    const begin = new Date(reservation.begin_time)
    const begin_time = begin.getTime()
    const end = new Date(reservation.end_time)
    const end_time = end.getTime()
    const leave = new Date()
    const leave_time = leave.getTime()
    const arrive = new Date(reservation.arrive_time)
    const arrive_time = arrive.getTime()
    const r_date = new Date(reservation.r_date)
    let status = 0, money = Math.ceil((end_time - begin_time) / 3600000.0) * unit
    if (arrive_time > begin_time) {
      status = 1
    }
    if (leave_time > end_time) {
      status = 3
      if (arrive_time > begin_time)
        status = 4
      money += Math.ceil((leave_time - end_time) / 3600000.0) * delay_unit
    }
    if (status != 0) {
      violation += 1
      user.update({
        violation: violation
      })
      user.save()
    }
    await Bill.create(
      {
        car_number: reservation.car_number,
        user_ID: reservation.user_ID,
        arrive_time: arrive,
        leave_time: leave,
        begin_time: begin,
        end_time: end,
        money: money,
        status: status,
        isPaid: 0,
        r_date: r_date
      }
    )
    await Reservation.destroy({
      where: { reservation_ID: reservation.reservation_ID }
    })
    const reservations = await Reservation.findAll({ where: { user_ID: reservation.user_ID } })
    response.send({ reservations, violation })
  } catch (error) {
    response.status(400).send(error)
  }
})

router.post('/user/bill/pay_bill', authentication, async (request, response) => {
  const user = request.user
  const bill_ID = request.body
  try {
    const bill = await Bill.findOne({ where: bill_ID })
    if (bill == null) {
      throw new Error('Bill not exist')
    }
    const balance = user.balance - bill.money
    if (balance < 0) {
      response.send({ fail: true })
    }
    else {
      bill.update({
        isPaid: 1
      })
      bill.save()
      user.update({
        balance: balance
      })
      user.save()
      response.send({ fail: false, balance: user.balance })
    }
  }
  catch (error) {
    response.status(400).send(error)
  }
})


module.exports = router