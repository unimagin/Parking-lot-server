const express = require('express')
const router = new express.Router()
const {exec} = require('child_process');

router.get('/autoDeploy', async (request, response) => {
    try {
        exec("/home/nkcs/autoDeploy.sh");
        response.status(200).send({messgae: "正在自动部署"})
    } catch (error) {
        response.status(400).send(error)
    }
})