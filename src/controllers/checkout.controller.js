'use strict'
const { SuccessResponse } = require('../core/succesd.respon')
const CheckoutService = require('../services/checkout.service')

class CheckoutController{
    
    checkoutReview = async(req, res, next) => {
        new SuccessResponse({
            message: 'Checkout successs!',
            metadata: await CheckoutService.CheckoutReview( req.body )
        }).send(res)
    }

}

module.exports = new CheckoutController()