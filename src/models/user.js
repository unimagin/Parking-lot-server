const { Model, Sequelize, DataTypes } = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const sequelize = require('../db/mysql')

class User extends Model {
    async generateAuthToken() {
        const user = this
        const token = jwt.sign({user_ID: user.user_ID}, process.env.JWT_SECRET)
        user.token = token
        await user.save()
        return token
    }

    static async findByCredentials(phone, password) {
        const user = await User.findOne({where: { phone: phone }})
        if (!user) {
            throw new Error('User does not exist')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error('Username and password mismatch!')
        }
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
        allowNull: true,
        unique: true
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
    }
}, {
    sequelize,
    modelName: 'users'
})

module.exports = User