'use strict'

const { BadRequestError } = require("../core/error.respon")
const { product, clothing, electronic, furniture } = require("../models/product.model")
const { findAllDraftsForShop, 
        publishProductByShop, 
        findAllPublishsForShop, 
        unPublishProductByShop, 
        searchProductByUser, 
        findAllProducts} = require("../models/repositories/product.repo")

class ProductFactoryV2 {

    static productRegistry = {}

    static registerProductType(type, classRef){
        ProductFactoryV2.productRegistry[type] = classRef
    }

    static async createProduct( type, data ){
        const productClass = ProductFactoryV2.productRegistry[type]
        if(!productClass)
            throw new BadRequestError(`Invalid Product Type!! ${type}`)
        return new productClass(data).createProduct()
    }

    // GET query ...
    static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isDraft: true}
        return await findAllDraftsForShop({ query, limit, skip})
    } 
    static async findAllPublishsForShop({product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isPublish: true}
        return await findAllPublishsForShop({ query, limit, skip})
    } 
    static async searchProducts (keySearch){
        return await searchProductByUser(keySearch);
    }
    static async findAllProducts({limit = 50, page = 1, sort = 'ctime', filter = { isPublish: true }}){
        return await findAllProducts({ limit, sort, page ,filter, select: ['product_name', 'product_price', 'product_thumb']})
    }

    // PUT
    static async publishProductByShop({product_shop, product_id}){
        return await publishProductByShop({ product_shop, product_id})
    } 
    static async unPublishProductByShop({product_shop, product_id}){
        return await unPublishProductByShop({ product_shop, product_id})
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
class Furniture extends Product{
    
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture)
            throw new BadRequestError("Create new Clothing error!")

        const newProduct  = await super.createProduct(newFurniture._id)
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

ProductFactoryV2.registerProductType('Electronics', Electronics)
ProductFactoryV2.registerProductType('Clothing', Clothing)
ProductFactoryV2.registerProductType('Furniture', Furniture)

module.exports = ProductFactoryV2