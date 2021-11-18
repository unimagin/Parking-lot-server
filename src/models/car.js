const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/mysql')

const Car = sequelize.define('Car', {
    car_number: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    remark: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    modelName: 'car'
})

module.exports = Car