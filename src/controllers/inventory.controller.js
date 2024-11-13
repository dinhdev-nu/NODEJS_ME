'use strict'

const { SuccessResponse } = require("../core/succesd.respon")
const { InventorieService } = require("../services/inventory.sevice")


class InventorieController {

    addStock = async (req, res , next) => {
        new SuccessResponse({
            message: 'Create inventory succescc',
            metadata:  await InventorieService.addStockToInventory(req.body)
        })
    }
    
}

module.exports = new InventorieController