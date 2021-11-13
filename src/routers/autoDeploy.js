const express = require('express')
const router = new express.Router()
const {exec} = require('child_process');
const bcrypt = require("bcryptjs");
const User = require("../models/user");

router.get('/autoDeploy', async (request, response) => {
    exec("/home/nkcs/autoDeploy.sh");
    response.status(200).send({messgae: "正在自动部署"})
})

module.exports = router