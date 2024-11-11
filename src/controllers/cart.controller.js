'use strict'

const { SuccessResponse } = require("../core/succesd.respon")
const CartService = require("../services/cart.service")


class CartController {

    // them cart cho user 
    addToCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create new Cart success!',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }
    // uodate cart + - cho user
    updateCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create new CartV2 success!',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }
    //delete cart
    deleteItemCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete Cart success!',
            metadata: await CartService.deleteItemCart(req.body)
        }).send(res)
    }
    // getListCart
    getListCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'getListCart  success!',
            metadata: await CartService.getListCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController