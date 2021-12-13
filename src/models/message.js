const { DataTypes } = require('sequelize')
const sequelize = require('../db/mysql')
const User = require('./user')

const Message = sequelize.define('Message', {
  message_ID: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: sequelize.Sequelize.UUIDV4
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  info: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
})

Message.belongsTo(User, {
  foreignKey: {
    name: 'user_ID',
    allowNull: false
  },
  onDelete: 'RESTRICT'
})

module.exports = Message