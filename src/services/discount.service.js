'use strict'

const {
    BadRequestError,
    NotFoundError
}  = require('../core/error.respon')
const { findAllProducts } = require('../models/repositories/product.repo')
const discountModel = require('../models/discount.model')
const { findAllDiscountCodeUnSelect, checkDiscountExists } = require('../models/repositories/discount.repo')

class DiscountService {
    static async createDiscountCode(payload){
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, max_uses_per_user
        } = payload
        if(new Date() < new Date(start_date) || new Date() > new Date(end_date)){
            throw new BadRequestError('Discount code code has expried!')
        } 
        if(new Date(start_date) >=  new Date(end_date)){
            throw new BadRequestError(' Start date must be before end date !')
        } 
        // create index for discount code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: shopId
        }).lean()
        if(foundDiscount  && foundDiscount.discount_is_active === true){
            throw new BadRequestError('Discount exists!')
        }
        const newDiscount = await discountModel.create({
            discount_name : name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_shopId: shopId,
            discount_min_order_value: min_order_value,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all'? [] : product_ids
        })
        return newDiscount
    }
    static async updateDiscountCode(){

    }
    // get all discount code available with product
    static async getAllDiscountCodeWithProduct({
        code, shopId, userId, limit, page
    }){
        //create index for discount code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: shopId
        }).lean()
        if(!foundDiscount  || !foundDiscount.discount_is_active){
            throw new NotFoundError('Discount not exists!')
        }
        const {discount_applies_to, discount_product_ids} = foundDiscount
        let products
        if(discount_applies_to === 'all'){
            products = await findAllProducts({
                filter: {
                    product_shop: shopId,
                    isPublish: true
                }, 
                limit: +limit, // Number(limit)
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if(discount_applies_to === 'specific'){
            products = await findAllProducts({
                filter: {
                    _id: {$in: discount_product_ids}, // _id = 1 trong [ discount_product_ids]
                    isPublish: true
                }, 
                limit: +limit, // Number(limit)
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }

    // get all discount code of shop by shopid
    static async getAllDiscountCodeByShop({
        limit, page, shopId
    }){
        const discounts = await findAllDiscountCodeUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: shopId,
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discountModel
        })
        return discounts
    }
    // apply discount code for product
    static async getDiscountAmount({codeId, userId, shopId, products}){
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: shopId
            }
        })
        if(!foundDiscount)
            throw new NotFoundError('Discount doesnt exitst!')
        const {
            discount_is_active,
            discount_max_uses, 
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_users_used,
            discount_max_uses_per_user,
            discount_value, discount_type
        } = foundDiscount
        if(!discount_is_active)
            throw new NotFoundError('discount expried!')
        if(!discount_max_uses)
            throw new NotFoundError('discount are out!')
        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)){
            throw new NotFoundError('discount has expried')
        }
        let totalOrder = 10
        console.log(totalOrder)
        if(discount_min_order_value > 0){
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            if(totalOrder < discount_min_order_value){
                throw new NotFoundError(`Discount requites a minium order value of ${discount_min_order_value}`)
            }
        }
        if(discount_max_uses_per_user > 0){
            const useUserDiscount = discount_users_used.find(user => user.userId === userId)
            if(useUserDiscount){
            }
        }

        // kiem tra discount nayf laf fixed_amiunt khong
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    // day la xoa luon trong tt thi nen bỏ vào 1 datb xóa khác
    // kiểm tra đang dược sd ở đâu không có thì báo chưa xóa đc
    static async deleteDiscountCode({ shopId, codeId }){
        const deteled = await discountModel.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: shopId
        })
        return deteled
    }

    // hủy or update nếu disount bị lỗi gì đó
    static async cancelDiscountCode({ codeId, shopId, userId }){
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: shopId
            }
        })
        if(!foundDiscount)
            throw new NotFoundError('Discount doesnt exitst!')
        const result = discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses : 1,
                discount_uses_count: -1
            }
        })
        return result
    }
}

module.exports = DiscountService