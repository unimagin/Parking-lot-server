const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Bill = require('../models/bill')
const Reservation = require('../models/reservation')
const router = new express.Router()
router.get('/data/user_kind', async (request, response) => {
    try {
        const normal = await User.findAll({where: {kind: 0}})
        const vip = await User.findAll({where: {kind: 1}})
        const contract = await User.findAll({where: {kind: 2}})
        const tmp = await User.findAll({where: {kind: 3}})
        response.send({normal: normal.length, vip: vip.length, contract: contract.length, tmp: tmp.length})
    } catch (error) {
        response.status(400).send(error)
    }
})

router.get('/data/user_data', async (request, response) => {
    try {
        const users = await User.findAll()
        response.send({users})
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/data/bill_data', async (request, response) => {
    category = request.body.category
    let totals = [], reals = []
    try {
        for (var i = 0; i < category.length; i++) {
            date = new Date(category[i]);
            let cancels = await Bill.findAll({where: {r_date: date, status: 2}})
            if (cancels == null) {
                cancels = 0
            } else {
                cancels = cancels.length
            }
            let total = await Bill.findAll({where: {r_date: date}})
            if (total == null) {
                total = 0
            } else {
                total = total.length
            }
            const real = total - cancels
            totals.push(total)
            reals.push(real)
        }
        response.send({totals, reals})
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/admin/add_blacklist', async (request, response) => {
    const users = request.body.users
    try {
        for (let i = 0; i < users.length; i++) {
            console.log(users[i].phone)
            User.addBlackList(users[i].phone);
        }
        response.status(200).send()
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/admin/move_blacklist', async (request, response) => {
    const users = request.body.users
    try {
        for (let i = 0; i < users.length; i++) {
            console.log(users[i].phone)
            User.moveBlackList(users[i].phone);
        }
        response.status(200).send()
    } catch (error) {
        response.status(400).send(error)
    }
})

module.exports = router