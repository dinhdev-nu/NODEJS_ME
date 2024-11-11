'use strict'

const mongoose = require("mongoose") 

const DOCUMENT_NAME = "Cart"
const COLECTION_NAME = "Carts"

const cartSchema = new mongoose.Schema({
    cart_state: {
        type: String, required: true,
        enum: ['active', 'complete', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: {
        type: Array, required: true,
        default: []
    },
    cart_count_product: {
        type: Number, default: 0
    },
    cart_userId: {
        type: Number, required: true
    }
}, {
    collection: COLECTION_NAME,
    timestamps: true
})

module.exports = {
    cart: mongoose.model(DOCUMENT_NAME, cartSchema)
}