const { Model, Sequelize, DataTypes } = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const sequelize = require('../db/mysql')

class User extends Model {
    async generateAuthToken () {
        const user = this
        const token = jwt.sign({ user_ID: user.user_ID }, process.env.JWT_SECRET)
        user.token = token
        await user.save()
        return token
    }

    static async findByCredentials (phone, password) {
        const user = await User.findOne({ where: { phone: phone } })
        if (!user) {
            throw new Error('User does not exist')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error('Username and password mismatch!')
        }
        return user
    }

    static async updateByPhone (user_data) {
        const user = await User.findOne({ where: { phone: user_data.phone } })
        if (user == null) {
            throw new Error("Edition failed!")
        }
        user.update({
            email: user_data.email,
            bank_number: user_data.bank_number
        })
        user.save()
        return user
    }

    static async updateImageByPhone (phone, filename) {
        const user = await User.findOne({ where: { phone: phone } })
        if (user == null) {
            throw new Error("Imaged failed!")
        }
        user.update({
            imageUrl: "http://82.156.168.246:3001/" + filename
        })
        user.save()
        return user
    }
}

User.init({
    user_ID: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bank_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    kind: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    balance: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0
    }
}, {
    sequelize
})

module.exports = User