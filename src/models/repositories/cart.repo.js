'use strict'

const { cart } = require("../cart.model")

const createUserCart = async({userId, product}) => {
    const query = { cart_userId: userId, cart_state: 'active'},
    updateOrInsert = {
        $addToSet: {
            cart_products: product
        }
    }, 
    option = { upsert: true, new: true}
    return await cart.findOneAndUpdate(query, updateOrInsert, option)
}
const updateUserCartQuanity = async({userId, product}) => {
    const  {productId, quantity} = product
    const query = { 
        cart_userId: userId, 
        'cart_products.productId': productId,
        cart_state: 'active'
    },
    updateset = {
        $inc: {
            'cart_products.$.quantity': quantity
        }
    }, 
    option = { upsert: true, new: true}
    return await cart.findOneAndUpdate(query, updateset, option)
}
// cart checkout

const findCartById = async (cartId) =>{
    return await cart.findOne({_id: cartId, cart_state: 'active'}).lean()
}


module.exports = {
    createUserCart,
    updateUserCartQuanity,
    findCartById

}