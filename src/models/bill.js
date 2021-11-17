const { DataTypes, Deferrable } = require('sequelize')
const sequelize = require('../db/mysql')
const User = require('./user')
const Car = require('./car')

const Bill = sequelize.define('Bill', {
    bill_ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize.UUIDV4
    },
    car_number: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        references: {
            model: Car,
            key: Car.car_number,
            deferrable: Deferrable.INITIALLY_IMMEDIATE
        }
    },
    user_ID: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
            model: User,
            key: User.user_ID,
            deferrable: Deferrable.INITIALLY_IMMEDIATE
        }
    },
    money: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER
    },
    isPaid: {
        type: DataTypes.INTEGER
    },
    arrive_time: {
        type: DataTypes.DATE
    },
    leave_time: {
        type: DataTypes.DATE
    }
}, {
    modelName: 'bills'
})

module.exports = Bill