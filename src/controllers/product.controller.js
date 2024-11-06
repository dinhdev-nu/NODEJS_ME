'use strict'


const {SuccessResponse } = require("../core/succesd.respon");
const ProductServise = require("../services/product.service");
const ProductFactoryV2 = require("../services/product.services.xxx");


class ProductController {

    createProduct = async(req, res, next) => {
        // new SuccessResponse({
        //     message: 'Create new Product success!',
        //     metadata: await ProductServise.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userID,
        //     })
        // }).send(res)
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductFactoryV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userID,
            })
        }).send(res)
    }

    // GET query...
    /**
     * @description Get all draft for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return { JSON }
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list getAllDraftsForShop success!',
            metadata: await ProductFactoryV2.findAllDraftsForShop({
                product_shop: req.user.userID
            })
        }).send(res)
    }
    getPublishsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list getPublishsForShop success!',
            metadata: await ProductFactoryV2.findAllPublishsForShop({
                product_shop: req.user.userID
            })

        }).send(res)
    }
    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list findAllProducts success!',
            metadata: await ProductFactoryV2.findAllProducts(req.query)
        }).send(res)
    }
    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list findProduct success!',
            metadata: await ProductFactoryV2.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }
    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list getPublishsForShop success!',
            metadata: await ProductFactoryV2.searchProducts(req.params.keysearch)
        }).send(res)
    }
    //PATCH
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'UpdateProduct success!',
            metadata: await ProductFactoryV2.updateProduct(req.body.product_type, req.params.product_id, {
                ...req.body,
                product_shop: req.user.userID
            })
        }).send(res)
    }

    // PUT
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'PUT publishProductByShop success!',
            metadata: await ProductFactoryV2.publishProductByShop({
                product_shop: req.user.userID,
                product_id: req.params.id
            })
        }).send(res)
    }
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'PUT unPublishProductByShop success!',
            metadata: await ProductFactoryV2.unPublishProductByShop({
                product_shop: req.user.userID,
                product_id: req.params.id
            })
        }).send(res)
    }
}

module.exports = new ProductController()