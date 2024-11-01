'use strict'

const { BadRequestError } = require("../core/error.respon")
const { product, clothing, electronic } = require("../models/product.model")

class ProductFactory {
    static async createProduct( type, data ){
        switch (type) {
            case "Clothing":
                return new Clothing(data).createProduct()
            case "Electronics":
                return new Electronics(data).createProduct()
            default: 
                throw new BadRequestError(`Invalid Product Type!! ${type}`)
        }
    }
} 


// tạo 1 db chung ở db product
class Product {  
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes}){
        
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(product_id){
        return await product.create({
            ...this,
            _id: product_id
        })
    }

}

// class con rieng trong db khac
class Clothing extends Product{
    
    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothing)
            throw new BadRequestError("Create new Clothing error!")

        const newProduct  = await super.createProduct(newClothing._id)
        if(!newProduct)
            throw new BadRequestError("Create new Product error!")
        return newProduct
    }
}

class Electronics extends Product{
    
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic)
            throw new BadRequestError("Create new Electronic error!")

        const newProduct  = await super.createProduct(newElectronic._id)
        if(!newProduct)
            throw new BadRequestError("Create new Product error!")

        return newProduct
    }
}


module.exports = ProductFactory