'use strict'

const { BadRequestError } = require("../core/error.respon")
const inventoryModel = require("../models/inventory.model")
const { findProduct } = require("../models/repositories/product.repo")

class InventorieService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = 'TT Huế',
    }) {
        const product = await findProduct(productId)
        if(!product)
            throw new BadRequestError('Product doesnt exists!')
        const query = {
            inventory_productId: productId,
            inventory_shopId: shopId
        }
        const updateSet = {
            $inc: {
                inventory_stock: stock
            },
            $set: {
                inventory_location : location
            }
        }
        const options = { upsert: true, new: true}
        return await inventoryModel.findByIdAndUpdate(query, updateSet, options)
    }
}

module.exports = {
    InventorieService
}

