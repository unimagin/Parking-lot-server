const { DataTypes } = require('sequelize')
const sequelize = require('../db/mysql')

const Park = sequelize.define('Park', {
    park_number: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    floor_level: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
})

module.exports = Park