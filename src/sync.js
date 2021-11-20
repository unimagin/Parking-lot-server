const sequelize = require('./db/mysql')
const Car = require('./models/car')
const User = require('./models/user')
const UserCar = require('./models/usercar')

// synchronize models
async function sync() {
    await sequelize.query('SET FOREIGN_KEY_CHECKS=0')
    await sequelize.sync({ force: true })
    await sequelize.query('SET FOREIGN_KEY_CHECKS=1')
    console.log("所有模型均已成功同步.") 
}
sync()
