const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db/mysql')
const User = require('./user')
const Car = require('./car')

class Contract extends Model {
}

Contract.init({
    time: {
        type: DataTypes.DATEONLY,
        allowNull: false
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
    money: {
        type: DataTypes.DOUBLE
    }
}, {
    sequelize,
    modelName: 'Contract'
})

Contract.belongsTo(User, {
    foreignKey: {
        name: 'user_ID',
        allowNull: false
    },
    onDelete: 'RESTRICT'
})

Contract.belongsTo(Car, {
    foreignKey: {
        name: 'car_number',
        allowNull: false
    },
    onDelete: 'RESTRICT'
})

module.exports = Contract