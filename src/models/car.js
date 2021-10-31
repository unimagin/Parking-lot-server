const { DataTypes, Deferrable } = require('sequelize')
const sequelize = require('../db/mysql')
const User = require('./user')

const Car = sequelize.define('Car', {
    car_ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    car_number: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    owner_ID: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
            model: User,
            key: user_ID,
            deferrable: Deferrable.INITIALLY_IMMEDIATE
        }
    }
}, {
    modelName: 'cars'
})

module.exports = Car