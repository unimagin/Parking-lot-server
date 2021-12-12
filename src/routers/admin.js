const express = require('express')
const User = require('../models/user')
const Bill = require('../models/bill')
const router = new express.Router()
const path = require('path')
const fs = require('fs')

router.get('/admin/look_price', async (request, response) => {
    const file = path.join(__dirname, 'price.json')
    fs.readFile(file, 'utf-8', (error, data) => {
        if (error) {
            response.status(400).send(error)
        }
        else {
            response.send(data)
        }
    })
})

router.post('/admin/change_price', async (request, response) => {
    const file = path.join(__dirname, 'price.json')
    const kind = request.body.kind
    const change = request.body.price
    if (kind == 'park') {
        const label = change.label
        var index = -1;
        if (label == '普通用户') {
            index = 0
        }
        else if (label == 'VIP') {
            index = 1
        }
        else if (label == '合同用户') {
            index = 2
        }
        fs.readFile(file, 'utf-8', (error, data) => {
            if (error) {
                response.status(400).send(error)
            }
            else {
                data = JSON.parse(data)
                data.parkPrice[index] = change
                data = JSON.stringify(data)
                fs.writeFileSync(file, data)
                response.send('price change success')
            }
        })
    }
    else if (kind == 'user') {
        const label = change.label
        var index = -1;
        if (label == 'VIP') {
            index = 0
        }
        else if (label == '合同用户') {
            index = 1
        }
        fs.readFile(file, 'utf-8', (error, data) => {
            if (error) {
                response.status(400).send(error)
            }
            else {
                data = JSON.parse(data)
                data.userPrice[index] = change
                data = JSON.stringify(data)
                fs.writeFileSync(file, data)
                response.send('price change success')
            }
        })
    }
})

router.get('/data/user_kind', async (request, response) => {
    try {
        const normal = await User.findAll({ where: { kind: 0 } })
        const vip = await User.findAll({ where: { kind: 1 } })
        const contract = await User.findAll({ where: { kind: 2 } })
        const tmp = await User.findAll({ where: { kind: 3 } })
        response.send({ normal: normal.length, vip: vip.length, contract: contract.length, tmp: tmp.length })
    } catch (error) {
        response.status(400).send(error)
    }
})

router.get('/data/user_data', async (request, response) => {
    try {
        const users = await User.findAll()
        response.send({ users })
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
            let cancels = await Bill.findAll({ where: { r_date: date, status: 2 } })
            if (cancels == null) {
                cancels = 0
            } else {
                cancels = cancels.length
            }
            let total = await Bill.findAll({ where: { r_date: date } })
            if (total == null) {
                total = 0
            } else {
                total = total.length
            }
            const real = total - cancels
            totals.push(total)
            reals.push(real)
        }
        response.send({ totals, reals })
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