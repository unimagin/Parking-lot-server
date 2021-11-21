const express = require('express')
const Reservation = require('../models/reservation')
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


module.exports = router