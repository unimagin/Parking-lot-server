const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Bill = require('../models/bill')
const Reservation = require('../models/reservation')
const router = new express.Router()
const multer = require('multer');
const fs = require('fs')
const authentication = require('../middleware/auth')
const Message = require('../models/message')
const Contract = require('../models/contract')
// const imageStorageLocation = '/Users/mainjay/Downloads'
const imageStorageLocation = '/usr/share/nginx/image' //服务器图片存储位置，提交取消注释时修改此处即可
var upload = multer({dest: imageStorageLocation})//设置存储位置

router.post('/register', async (request, response) => {
    const body = request.body
    try {
        body.password = await bcrypt.hash(body.password, 8)
        const user = await User.create(body)
        const token = await user.generateAuthToken()
        response.status(200).send({user, token})
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/login', async (request, response) => {
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

router.post('/user/edit', async (request, response) => {
    const body = request.body
    try {
        const user = await User.updateByPhone(body)
        if (user == null) {
            throw new Error("Edition failed!")
        }
        response.send({email: user.email, bank_number: user.bank_number})
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/finished_reservation', async (request, response) => {
    try {
        const user_ID = request.body.user_ID
        const bills = await Bill.findAll({where: {user_ID: user_ID}})
        if (bills == null) {
            response.send([])
        } else {
            response.send({bills})
        }
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/look_reservation', async (request, response) => {
    const user_ID = request.body.user_ID
    try {
        const reservations = await Reservation.findAll({where: {user_ID: user_ID}})
        if (reservations == null) {
            response.send([])
        } else {
            response.send({reservations})
        }
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/cancel_reservation', authentication, async (request, response) => {
    const reservation = request.body
    const user = request.user
    try {
        await Reservation.destroy({
            where: {reservation_ID: reservation.reservation_ID}
        })
        await Bill.create(
            {
                car_number: reservation.car_number,
                user_ID: reservation.user_ID,
                arrive_time: null,
                begin_time: new Date(reservation.begin_time),
                end_time: new Date(reservation.end_time),
                leave_time: null,
                r_date: reservation.r_date,
                money: null,
                status: 2,
                isPaid: null
            }
        )
        user.update({
            cancel: user.cancel + 1,
            total: user.total + 1
        })
        user.save()
        const reservations = await Reservation.findAll({where: {user_ID: reservation.user_ID}})
        response.send({reservations})
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/image/upload', upload.single('avatar'), async (request, response) => {
    const phone = request.body.filename
    fs.readFile(request.file.path, async (err, data) => {
        //如果读取失败
        if (err) {
            return response.send('上传失败')
        }
        let time = Date.parse(new Date()).toString() + Math.ceil(Math.random() * 2021).toString()
        let extname = request.file.mimetype.split('/')[1]
        let filename = time + '.' + extname
        const user = await User.updateImageByPhone(phone, filename)
        if (user == null) {
            throw new Error("Saved failed!")
        }
        fs.writeFile((imageStorageLocation + '/' + filename), data, (err) => {
            if (err) {
                return response.status(400).send('写入失败')
            }
            response.status(200).send({user: user})
        });
    });
})

router.post('/user/add_balance', authentication, async (request, response) => {
    const {user_ID} = request.user
    const money = request.body.money
    try {
        const user = await User.findOne({where: {user_ID}})
        const balance = parseFloat(user.balance) + parseFloat(money)
        user.update({
            balance: balance
        })
        user.save()
        response.send({balance: user.balance})
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/buy_VIP', authentication, async (request, response) => {
    const {user_ID} = request.user
    const money = request.body.money
    try {
        const user = await User.findOne({where: {user_ID}})
        if (user.balance < money) {
            throw new Error('余额不足')
        }
        const balance = parseFloat(user.balance) - parseFloat(money)
        user.update({
            balance: balance,
            kind: 1
        })
        user.save()
        response.status(200).send({balance: user.balance, kind: user.kind})
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/get_unreadnum', authentication, async (request, response) => {
    const user = request.user
    try {
        const messages = await Message.findAll({where: {user_ID: user.user_ID, status: 0}})
        response.send({unreadNum: messages.length})
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/look_message', authentication, async (request, response) => {
    const user = request.user
    try {
        const messages = await Message.findAll({where: {user_ID: user.user_ID}})
        response.send(messages)
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/change_msgstatus', async (request, response) => {
    const message_ID = request.body.message_ID
    try {
        const message = await Message.findOne({where: {message_ID: message_ID}})
        message.status = 1
        await message.save()
        response.send('change to read')
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/add_message', authentication, async (request, response) => {
    const user = request.user
    const reservation = request.body.reservation
    const type = request.body.type
    const begin_time = new Date(reservation.begin_time).toLocaleString()
    const end_time = new Date(reservation.end_time).toLocaleString()
    var info = '距离' + begin_time + '到' + end_time
    const time = new Date(request.body.time)
    try {
        const tmp = await Reservation.findOne({where: {reservation_ID: reservation.reservation_ID}})
        if (type == 0) {
            info += '预约的车位离开始还有5分钟，请尽快到达！'
            tmp.msg_begin = 1
        } else if (type == 1) {
            info += '预约的车位离结束还有5分钟，请尽快离开！'
            tmp.msg_end = 1
        }
        await Message.create({
            info: info,
            time: time,
            user_ID: user.user_ID
        })
        await tmp.save()
        response.send('add_message successfully')
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/viewData', authentication, async (request, response) => {
    const {user_ID, total, violation} = request.user
    try {
        const reserves = await Bill.findAll({where: {user_ID}})
        let times = [0, 0, 0, 0, 0, 0]
        reserves.forEach(reserve => {
            ++times[Math.floor(reserve.begin_time.getTime() % 86400 / 14400)]
        })
        response.send({total, violation, times})
    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/user/buy_contract', authentication, async (request, response) => {
    const user = request.user
    try {
        let {car_number, time, begin_time, end_time, parking_number, money} = request.body
        console.log(money);
        console.log(user.money)
        if (user.balance < parseFloat(money)) {
            throw new Error('not enough money');
        }
        user.kind = 2
        user.balance = user.balance - parseFloat(money);
        await user.save()
        const contract = await Contract.create({
            user_ID: user.user_ID,
            car_number,
            time,
            begin_time,
            end_time,
            parking_number,
        })
        response.send(user)
    } catch (error) {
        response.status(400).send()
    }
})

module.exports = router