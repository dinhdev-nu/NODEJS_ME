'use strict'

const { cart } = require("../models/cart.model")
const { createUserCart, updateUserCartQuanity } = require("../models/repositories/cart.repo")
const { findProduct } = require("../models/repositories/product.repo")
const { NotFoundError }  = require('../core/error.respon')

class CartService {

    static async addToCart({ userId, product = {} }){
        const userCart = await cart.findOne({
            cart_userId: userId
        })
        // if NO then create a cart for user
        if(!userCart){
            return await createUserCart({userId, product})
        }
        // neu co cart ma ko co product 
        if(!userCart.cart_count_product.length){
            userCart.cart_products = [product]
            return await userCart.save()
        }
        
        // cart exists thi + 1 cart_proudtc quannity
        return await updateUserCartQuanity({userId, product})
    }

    static async addToCartV2({userId, shop_order_ids}){
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        // check product
        const foundProduct = await findProduct({product_id: productId})
        if(!foundProduct)
            throw new NotFoundError('Product Do Not Exists1!')
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
            throw new NotFoundError('Product Do Not Exists2!')
        if(quantity === 0){
            // delete...
        }
        return await updateUserCartQuanity({
            userId, 
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }
    static async deleteItemCart({ userId, productId}){
        const query = {
            cart_userId: userId, cart_state: 'active'
        }
        const updateSet= {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }
        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart
    }
    static async getListCart({ userId }) {
        return await cart.findOne({
            cart_userId: +userId,   
        }).lean()
    }
}

module.exports = CartService