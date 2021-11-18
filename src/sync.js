const sequelize = require('./db/mysql')
const car = require('./models/car')
const user = require('./models/user')
const usercar = require('./models/usercar')

// synchronize models
async function f() {
    await sequelize.sync({ force: true })
    console.log("所有模型均已成功同步.")
}
f()
