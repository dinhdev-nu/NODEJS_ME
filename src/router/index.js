'use strict'

const express = require('express')
const router = express.Router()

router.use('/v1/api', require('./access'))
// router.post('/', (req, res) => {
//     const message = "Hello World !!"

//     res.status(200).json({
//         mess: message
//     })
// })


module.exports = router