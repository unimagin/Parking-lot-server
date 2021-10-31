const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const router = new express.Router()

router.post('/user/register', async (request, response) => {
    const body = request.body
    try {
        body.password = await bcrypt.hash(body.password, 8)
        const user = await User.create(body)
        const token = user.generateAuthToken()
        response.status(200).send({user, token})
    } catch(error) {
        response.status(400).send(error)
    }
})

router.post('/user/login', async (request, response) => {
    try {
        const {phone, password} = request.body
        const user = await User.findByCredentials(phone, password)
        if (user == null) {
            throw new Error('User not found')
        }
        const token = await user.generateAuthToken()
        response.send({user, token})
    } catch (error) {
        response.status(400).send(error)
    }
})

module.exports = router