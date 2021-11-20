const express = require('express')
const Reservation = require('../models/reservation')
const router = new express.Router()

router.post('/reservation/change_used', async (request, response) => {
  const reservation_ID = request.body.reservation_ID
  try {
    const reservation = await Reservation.findOne({ where: { reservation_ID: reservation_ID } })
    if (reservation == null) {
      throw new Error("Reservation not exist")
    }
    reservation.update({
      used: 1
    })
    reservation.save()
    response.status(200).send('using')
  }
  catch (error) {
    response.status(400).send(error)
  }
})

module.exports = router