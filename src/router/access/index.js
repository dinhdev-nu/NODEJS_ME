'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const { asyuncHandler } = require('../../auth/checkApiAuth')
const router = express.Router()

router.post('/shop/signup', asyuncHandler(accessController.signup))

module.exports = router