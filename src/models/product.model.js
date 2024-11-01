'use strict'

const  mongoose  = require("mongoose")
const DOCUMENT_NAME = "Product"
const COLECTION_NAME = "Products"

const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String},
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true , enum: ["Electronics", "Clothing"]},
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: mongoose.Schema.Types.Mixed, required: true }
}, {
    collection:  COLECTION_NAME,
    timestamps: true
})

const clothingSchema  = new mongoose.Schema({
    brand: { type: String, required: true},
    size: { type: String},
    material: { type: String},
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop"}
}, {
    collection: "clothes",
    timestamps: true 
})

const electronicsSchema  = new mongoose.Schema({
    manufacturer: { type: String, required: true},
    model: { type: String},
    color: { type: String},
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop"}
}, {
    collection: "electronics",
    timestamps: true 
})

module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    clothing: mongoose.model('Clothing', clothingSchema),
    electronic: mongoose.model('Electronics', electronicsSchema)
}