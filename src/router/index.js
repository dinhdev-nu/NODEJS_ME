'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkApiAuth')
const router = express.Router()

// check API key
router.use(apiKey)

// check permission
router.use(permission('0000'))

router.use('/v1/api/product', require('./product'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api', require('./access'))


module.exports = router