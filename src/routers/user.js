const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Bill = require('../models/bill')
const router = new express.Router()

router.post('/user/register', async (request, response) => {
    const body = request.body
    try {
        body.password = await bcrypt.hash(body.password, 8)
        const user = await User.create(body)
        const token = await user.generateAuthToken()
        response.status(200).send({ user, token })
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/login', async (request, response) => {
    try {
        const { phone, password } = request.body
        const user = await User.findByCredentials(phone, password)
        if (user == null) {
            throw new Error('User not found')
        }
        const token = await user.generateAuthToken()
        response.send({ user, token })
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/edit', async (request, response) => {
    const body = request.body
    try {
        const user = await User.updateByPhone(body)
        if (user == null) {
            throw new Error("Edition failed!")
        }
        response.send({ email: user.email, bank_number: user.bank_number })
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/finished_reservation', async (request, response) => {
    try {
        const user_ID = request.body.user_ID
        const bills = await Bill.findAll({ where: { user_ID: user_ID } })
        if (bills == null) {
            response.send('xxx')
        }
        else {
            response.send({ bills })
        }
    }
    catch (error) {
        response.status(400).send(error)
    }
})


module.exports = router