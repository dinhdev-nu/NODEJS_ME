'use strict'

const { findCartById } = require("../models/repositories/cart.repo")
const { BadRequestError} = require('../core/error.respon')
const { checkProductByServer } = require("../models/repositories/product.repo")
const { product } = require("../models/product.model")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.service")
const { order } = require("../models/order.model")
class CheckoutService{

    static async CheckoutReview({
        cartId, userId, shop_order_ids = []
    }) { 
        // check cartId exists! (ton tai)
        const foundCart = await findCartById(cartId)
        if(!foundCart)
            throw new BadRequestError('Cart doesnt exists!')

        const checkoutOrder = {
            totalPrice: 0,
            feeShip: 0, // fee: phi ship
            totalDiscount: 0,
            totalCheckout: 0
        }
        const shop_order_ids_new = []

        // totalBill
        for(let i = 0; i< shop_order_ids.length; i++){
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i] 
            // check  product available
            const checkProductServer = await checkProductByServer(item_products)
            if(!checkProductServer[0])
                throw new BadRequestError('Order Wrong!')
            const checkoutPrice = checkProductServer.reduce( (acc, product) =>{
                return acc = (product.quantity * product.price)
            }, 0 )

            // totalMoney truoc khi su ly
            checkoutOrder.totalPrice += checkoutPrice
            const itemCheckout = { 
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }
            // new shop_discount > 0, kiem tra hop le ko (valid)
            if(shop_discounts.length > 0){
                // gia su co 1 discount 
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                }) 
                // totalDiscount
                checkoutOrder.totalDiscount +=  discount
                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            // tong thanh toan cuoi cung
            checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }
        return {
           shop_order_ids,
           shop_order_ids_new,
           checkoutOrder 
        }
    }
    
    // order
    static async orderByUser({
        shop_order_ids,
        cartId, userId,
        user_address = {}, 
        user_payment = {}
    }) {
        const {shop_order_ids_new, checkoutOrder} = await CheckoutService.CheckoutReview({
            cartId, userId, shop_order_ids, 
        })
        
        // check lai 1 lam nua xem vuot ton kho khong
        // get new product array
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const {productId, quantity} = products[i];
            const keyLock = await acquireLock({productId, quantity, cartId})
            acquireProduct.push(keyLock ? true : false)
            if(keyLock){
                await releaseLock(keyLock)
            }
        }
        // check new co 1 san phan trong kho het hang 
        if(acquireProduct.includes(false))
            throw new BadRequestError('1 so san pham da dc update!')
        
        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkoutOrder,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        // truong hop new oder success thif remove product trong cart
        if(newOrder){
            // remove 
        }

        return newOrder
    }
    /*
        Thieu
        1. query orders [users]
        2. query a  order  by Id [users]
        3. cancel order by user [users]
        4. updaet oder status [Shop | Admin]
    */
   static async getOrdersByUser ({}){}
   static async getOneOrderByUser ({}){}
   static async cancelOrderByUser ({}){}
   static async updaetOderStatus ({}){}
}

module.exports = CheckoutService