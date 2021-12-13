const sequelize = require('./db/mysql')
const Car = require('./models/car')
const User = require('./models/user')
const UserCar = require('./models/usercar')
const Reservation = require('./models/reservation')
const Bill = require('./models/bill')
const Park = require('./models/park')
const Message = require('./models/message')

async function init () {
    console.log("正在初始化车位...")
    for (let floor = 1; floor <= process.env.FLOOR_NUM; ++floor) {
        for (let j = 0; j < process.env.PARKS_PER_FLOOR; ++j) {
            await Park.create({ floor_level: floor })
        }
    }
    console.log("车位初始化完成")
}

// synchronize models
async function sync () {
    await sequelize.query('SET FOREIGN_KEY_CHECKS=0')
    await sequelize.sync({ force: true })
    await sequelize.query('SET FOREIGN_KEY_CHECKS=1')
    console.log("所有模型均已成功同步.")
    await init()
}

sync()
