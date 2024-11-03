'use strict'

const { getSelectData, unGetSelectData } = require("../../utils")
const { product } = require("../product.model")

// GET query
const findAllDraftsForShop = async( { query, limit, skip} ) => {
    return await queryProduct({ query, limit, skip})
}
const findAllPublishsForShop = async( { query, limit, skip} ) => {
    return await queryProduct({ query, limit, skip})
}
const searchProductByUser = async(keywork) => {
    const regaxSearch = new RegExp(keywork)
    const result = await product.find(
        {
            isDraft: false,
            $text: { $search: regaxSearch}
        },
        { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).lean()
    return result
}
const findAllProducts = async ({limit, page, sort, filter, select}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return products
}
const findProduct = async ({product_id, unSelect}) => {
    return await product.findById(product_id)
        .select(unGetSelectData(unSelect))
        .lean()
}

// PUT 
const publishProductByShop = async( {product_shop, product_id} ) => {

    const foundShop = await product.findOne({
        product_shop, 
        _id: product_id
    })
    if(!foundShop)
        return null
    foundShop.isDraft = false
    foundShop.isPublish = true
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}
const unPublishProductByShop = async( {product_shop, product_id} ) => {

    const foundShop = await product.findOne({
        product_shop, 
        _id: product_id
    })
    if(!foundShop)
        return null
    foundShop.isDraft = true
    foundShop.isPublish = false
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}


// query chung
const queryProduct  = async ({ query, limit, skip}) => {
    return await product.find( query )
        .populate('product_shop', 'name email -_id')
        .sort({updateAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}
module.exports = {
    findAllDraftsForShop, 
    publishProductByShop,
    findAllPublishsForShop,
    unPublishProductByShop, 
    searchProductByUser,
    findAllProducts,
    findProduct
}