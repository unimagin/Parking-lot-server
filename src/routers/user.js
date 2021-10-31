const express = require('express')
const { use } = require('../app')
const User = require('../models/user')
const router = new express.Router()

router.post('/user/register', async (request, response) => {
    const body = request.body
    try {
        const user = await User.create(body)
        response.status(200).send(user)
    } catch(error) {
        response.status(400).send(error)
    }
})

router.post('/user/login', async (request, response) => {
    try {
        const user = await User.findOne({ where: {email: request.body.email} })
        if (user == null) {
            throw new Error('User not found')
        }
        else if (user.passwd != request.body.passwd) {
            throw new Error('Password mismatch')
        }
        response.send('Successfully logged in.')
    } catch (error) {
        response.status(400).send(error)
    }
})

module.exports = router