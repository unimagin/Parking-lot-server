const { DataTypes, Deferrable } = require('sequelize')
const sequelize = require('../db/mysql')
const User = require('./user')
const Car = require('./car')

const Park = sequelize.define('Park', {
    park_ID: {
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
    status: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    modelName: 'park'
})

module.exports = Park