'use strict'

const { SuccessResponse } = require("../core/succesd.respon");
const DiscountService = require("../services/discount.service");



class DiscountController {

    createDiscountCode = async (req, res, next) =>{
        new SuccessResponse({
            message: 'Successful Code Generations !',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userID
            })
        }).send(res)
    }

    getAllDiscountCodes = async (req, res, next) =>{
        new SuccessResponse({
            message: 'Successful Code Found !',
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userID
            })
        }).send(res)
    }
    getDiscountAmount = async (req, res, next) =>{
        new SuccessResponse({
            message: 'Successful Code Found !',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }
    getAllDiscountCodeWithProduct = async (req, res, next) =>{
        new SuccessResponse({
            message: 'Successful Code Found !',
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query,
            })
        }).send(res)
    }
}

module.exports = new DiscountController();