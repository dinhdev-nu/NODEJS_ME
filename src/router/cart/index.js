'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/acsyncHandle')
const { authenticationv1 } = require('../../auth/authUtils')
const cartController = require('../../controllers/cart.controller')
const router = express.Router()

// user het khong authen
router.post('', asyncHandler(cartController.addToCart))
router.get('', asyncHandler(cartController.getListCart))
router.delete('', asyncHandler(cartController.deleteItemCart))
router.post('/update', asyncHandler(cartController.updateCart))

module.exports = router
