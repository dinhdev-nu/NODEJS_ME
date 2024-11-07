'use strict'

const mongoose = require("mongoose") 

const DOCUMENT_NAME = "Discount"
const COLECTION_NAME = "Discounts"

// Quản lý keys
const DiscountSchema = new mongoose.Schema({
    discount_name :{ type: String, required: true},
    discount_description:{ type: String, required: true },
    discount_type:{ type: String, default: 'fixed_amount' },
    discount_value: { type: Number, required: true },
    discount_name: { type: String,  required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_use: { type: Number, required: true },
    discount_uses_count: { type: Number, required: true },
    discount_users_used: { type: Array, default: [] },
    discount_limit_use_peruser:{ type: Number, required: true },
    discount_start_date: { type: Number, required: true },
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] }
},{
    timestamps: true,
    collection: COLECTION_NAME,
})

module.exports = mongoose.model(DOCUMENT_NAME, DiscountSchema)

