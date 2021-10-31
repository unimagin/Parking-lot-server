const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('parking_lot', 'root', 'root', {
    host: process.env.HOST,
    port: '3306',
    dialect: 'mysql'
})

// async function f1 () {
//     try {
//         await sequelize.authenticate()
//         console.log('Connection has been established successfully.')
//     } catch (error) {
//         console.error('Unable to connect to the database:', error)
//     }
// }
// f1()
    
module.exports = sequelize