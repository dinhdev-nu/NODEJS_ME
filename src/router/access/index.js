'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../helpers/acsyncHandle')
const { authentication, authenticationv1 } = require('../../auth/authUtils')
const router = express.Router()

router.post('/shop/signup', asyncHandler(accessController.signup))
router.post('/shop/login', asyncHandler(accessController.login))

// Authentication 
router.use(authenticationv1)

router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))



module.exports = router