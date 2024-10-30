'use strict'


const {SuccessResponse } = require("../core/succesd.respon");
const ProductServise = require("../services/product.service");


class ProductController {

    createProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductServise.createProduct(req.body.product_type, req.body)
        }).send(res)
    }
}

module.exports = new ProductController()