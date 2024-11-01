'use strict'


const {SuccessResponse } = require("../core/succesd.respon");
const { product } = require("../models/product.model");
const ProductServise = require("../services/product.service");


class ProductController {

    createProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductServise.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userID,
            }
            )
        }).send(res)
    }
}

module.exports = new ProductController()