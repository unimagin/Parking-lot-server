const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authentication = async (request, response, next) => {
    try {
        const token = request.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ where: {user_ID: decoded.user_ID, token: token}})
        if (!user) {
            throw new Error()
        }
        request.token = token
        request.user = user
        next()
    } catch (error) {
        response.status(401).send({error: 'Unauthenticated source'})
    }
}

module.exports = authentication
