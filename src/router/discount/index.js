'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/acsyncHandle')
const { authentication, authenticationv1 } = require('../../auth/authUtils')
const discountController = require('../../controllers/discount.controller')
const router = express.Router()

// get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodeWithProduct))

router.use(authenticationv1)

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodes))

module.exports = router