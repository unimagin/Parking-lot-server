const { Sequelize, DataTypes, Model, Op } = require('sequelize')
const sequelize = require('../db/mysql')
const User = require('./user')
const Car = require('./car')

class Reservation extends Model {
    static async isAvailable(parking_number, begin_time, end_time, reservation_ID = undefined) {
        begin_time = new Date(begin_time)
        end_time = new Date(end_time)
        begin_time = Date.parse(begin_time)
        end_time = Date.parse(end_time)
        let reservation = null
        if (reservation_ID != undefined && (reservation = await Reservation.findByPk(reservation_ID)) == null) {
            return false; //如果选择修改，但ID不存在，返回false
        }
        const reservs = reservation == null ? //如果是修改预约，则判断时间冲突前需要去掉自己
            await Reservation.findAll({ where: { parking_number } }) :
            await Reservation.findAll({ where: { parking_number, reservation_ID: { [Op.ne]: reservation_ID } } })
        let available = true
        for (let i = 0; i < reservs.length; ++i) {
            if (!(reservs[i].end_time.getTime() <= begin_time || reservs[i].begin_time.getTime() >= end_time)) {
                available = false
                break
            }
        }
        return available
    }
}

Reservation.init({
    reservation_ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    r_date: {
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
    arrive_time: {
        type: DataTypes.DATE
    },
    used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'Reservation'
})

Reservation.belongsTo(User, {
    foreignKey: {
        name: 'user_ID',
        allowNull: false
    },
    onDelete: 'RESTRICT'
})

Reservation.belongsTo(Car, {
    foreignKey: {
        name: 'car_number',
        allowNull: false
    },
    onDelete: 'RESTRICT'
})

module.exports = Reservation