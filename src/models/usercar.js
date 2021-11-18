const { DataTypes } = require('sequelize')
const sequelize = require('../db/mysql')
const User = require('./user')
const Car = require('./car')

// 在user和car之间建立多对多关系
User.belongsToMany(Car, {
    foreignKey: {
        name: 'user_ID',
        type: DataTypes.UUID,
        allowNull: false
    },
    through: 'UserCar'
})

Car.belongsToMany(User, {
    foreignKey: {
        name: 'car_number',
        type: DataTypes.STRING,
        allowNull: false
    },
    through: 'UserCar'
})

module.exports = sequelize.models.UserCar