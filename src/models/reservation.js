const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/mysql')
const User = require('./user')
const Car = require('./car')

const Reservation = sequelize.define('Reservation', {
    reservation_ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    begin_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    parking_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
})

Reservation.belongsTo(User, {
    foreignKey: {
        name: 'user_ID',
        allowNull: false
    },
    onDelete: 'RESTRICT'
})

Reservation.belongsTo(Car, {
    foreignKey: {
        name: 'car_number',
        allowNull: false
    },
    onDelete: 'RESTRICT'
})

module.exports = Reservation