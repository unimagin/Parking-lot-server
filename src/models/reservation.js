const { Sequelize, DataTypes, Deferrable } = require('sequelize')
const sequelize = require('../db/mysql')
const User = require('./user')
const Car = require('./car')

const Reservation = sequelize.define('Reservation', {
    reservation_ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    car_number: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        references: {
            model: Car,
            key: car_number,
            deferrable: Deferrable.INITIALLY_IMMEDIATE
        }
    },
    user_ID: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
            model: User,
            key: user_ID,
            deferrable: Deferrable.INITIALLY_IMMEDIATE
        }
    },
    reservation_time: {
        type: DataTypes.DATE
    },
    used: {
        type: DataTypes.DATE
    }
}, {
    modelName: 'reservation'
})

module.exports = Reservation