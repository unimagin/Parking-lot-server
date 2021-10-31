const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('parking_lot', 'root', 'root', {
    host: process.env.HOST,
    port: '3306',
    dialect: 'mysql'
})
    
module.exports = sequelize