'use strict'

const { defaultTo } = require("lodash")
const mongoose = require("mongoose") 

const DOCUMENT_NAME = "Inventory"
const COLECTION_NAME = "Inventories"

// Quản lý keys
const InventorySchema = new mongoose.Schema({
    inventory_productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    inventory_location:{
        type: String,
        default: 'unknow'
    },
    inventory_stock:{
        type: Number,
        required: true
    },
    inventory_shopId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Shop'
    },
    inventory_reservations: {
        type: Array,
        default: []
    }
},{
    timestamps: true,
    collection: COLECTION_NAME,
})

module.exports = mongoose.model(DOCUMENT_NAME, InventorySchema)

