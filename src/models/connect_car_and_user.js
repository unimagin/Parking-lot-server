const {DataTypes, Deferrable} = require('sequelize')
const sequelize = require('../db/mysql')
const User = require('./user')
const Car = require('/car')

const Connection = sequelize.define('Connect', {
    Connection_ID:{
      type:DataTypes.UUID,
      primaryKey: true
    },
    car_ID: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
            model: Car,
            key: car_ID,
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
    //主人对车的备注
    remark:{
        type:DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    }
}, {
    modelName: 'Connect'
})

module.exports = Car