'use strict'

const mongoose = require("mongoose") 

const DOCUMENT_NAME = "Order"
const COLECTION_NAME = "Orders"

const orderSchema = new mongoose.Schema({
    order_userId: {
        type: Number, required: true
    },
    order_checkout: {
        type: Object, default: {}
    },
    order_shipping: {
        type: Object, default: {}
    },
    order_payment: {
        type: Object, default: {}
    },
    order_products: {
        type: Array, default: true
    },
    order_trackingNumber: {
        type: String, default: '#0000113112024'
    },
    order_status: {
        type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'
    }
}, {
    collection: COLECTION_NAME,
    timestamps: true
})

module.exports = {
    order: mongoose.model(DOCUMENT_NAME, orderSchema)
}