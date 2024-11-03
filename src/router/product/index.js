'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/acsyncHandle')
const { authentication, authenticationv1 } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')
const router = express.Router()

router.get('/search/:keysearch', asyncHandler(productController.getListSearchProduct))
router.get('/:product_id', asyncHandler(productController.findProduct))
router.get('', asyncHandler(productController.findAllProducts))

router.use(authenticationv1)

router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

//query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/publish/all', asyncHandler(productController.getPublishsForShop))

module.exports = router