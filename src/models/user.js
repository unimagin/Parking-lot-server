const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/mysql')

const User = sequelize.define('User', {
    user_ID: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bank_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    passwd: {
        type: DataTypes.STRING,
        allowNull: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'users'
})

module.exports = User