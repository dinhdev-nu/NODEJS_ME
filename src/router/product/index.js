'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/acsyncHandle')
const { authentication, authenticationv1 } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')
const router = express.Router()

router.use(authenticationv1)
router.post('', asyncHandler(productController.createProduct))

module.exports = router