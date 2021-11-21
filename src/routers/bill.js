const express = require('express')
const Bill = require('../models/bill')
const Reservation = require('../models/reservation')
const router = new express.Router()

function dateTranse (mydate) {
  const d_arr = mydate.split('T')[0].split('-')
  const t = mydate.split('T')[1].split('.')[0]
  const str = d_arr[1] + " " + d_arr[2] + "," + d_arr[0] + " " + t
  const r_date = new Date(str)
  return r_date
}

router.post('/bill/generate_bill', async (request, response) => {
  const reservation = request.body
  try {
    const begin_time = dateTranse(reservation.begin_time)
    const end_time = dateTranse(reservation.end_time)
    const leave_time = new Date()
    const date = reservation.begin_time.split('T')[0]
    const arrive_time = dateTranse(date + "T" + reservation.arrive_time + ".")
    let status = -1, money = 0
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
        arrive_time: arrive_time,
        leave_time: leave_time,
        begin_time: reservation.begin_time,
        end_time: reservation.end_time,
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

module.exports = router