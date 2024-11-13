'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/acsyncHandle')
const { authenticationv1 } = require('../../auth/authUtils')
const inventoryController = require('../../controllers/inventory.controller')
const router = express.Router()

router.use(authenticationv1)
// user het khong authen
router.post('', asyncHandler(inventoryController.addStock))

module.exports = router
