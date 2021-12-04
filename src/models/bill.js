const { DataTypes, Deferrable } = require('sequelize')
const sequelize = require('../db/mysql')
const User = require('./user')
const Car = require('./car')

const Bill = sequelize.define('Bill', {
    bill_ID: {
        type: DataTypes.UUID,
        defaultValue: sequelize.Sequelize.UUIDV4,
        primaryKey: true
    },
    car_number: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        references: {
            model: Car,
            key: 'car_number',
            deferrable: Deferrable.INITIALLY_IMMEDIATE
        }
    },
    user_ID: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
            model: User,
            key: 'user_ID',
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
        type: DataTypes.INTEGER,
        allowNull: true
    },
    r_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    begin_time: {
        type: DataTypes.DATE
    },
    arrive_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    leave_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    end_time: {
        type: DataTypes.DATE,
    }
}, {
})

module.exports = Bill