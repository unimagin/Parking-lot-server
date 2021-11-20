const { DataTypes, Deferrable } = require('sequelize')
const sequelize = require('../db/mysql')
const User = require('./user')
const Car = require('./car')

const Park = sequelize.define('Park', {
    park_number: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
})

Park.belongsTo(User, {
    foreignKey: {
        name: 'user_ID',
        allowNull: false
    },
    onDelete: 'RESTRICT'
})

Park.belongsTo(Car, {
    foreignKey: {
        name: 'car_number',
        allowNull: false
    },
    onDelete: 'RESTRICT'
})

module.exports = Park