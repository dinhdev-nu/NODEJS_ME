'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/acsyncHandle')
const { authenticationv1 } = require('../../auth/authUtils')
const checkoutController = require('../../controllers/checkout.controller')
const router = express.Router()

// user het khong authen
router.post('/review', asyncHandler(checkoutController.checkoutReview))

module.exports = router
