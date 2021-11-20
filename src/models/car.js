const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/mysql')

const Car = sequelize.define('Car', {
    car_number: {
        type: DataTypes.STRING,
        primaryKey: true
    }
}, {

})

module.exports = Car