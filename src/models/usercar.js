const { DataTypes } = require('sequelize')
const sequelize = require('../db/mysql')
const User = require('./user')
const Car = require('./car')

const UserCar = sequelize.define('UserCar', {
    remark: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
})

// 在user和car之间建立多对多关系
User.belongsToMany(Car, {
    foreignKey: {
        name: 'user_ID',
        allowNull: false
    },
    through: 'UserCar'
})

Car.belongsToMany(User, {
    foreignKey: {
        name: 'car_number',
        allowNull: false
    },
    through: 'UserCar'
})

module.exports = UserCar