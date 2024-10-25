'use strict'

const apikeyModel = require("../models/apikey.model")
const crypto = require('crypto')
const findById = async (key) =>{
    try {
        const objKey  = await apikeyModel.findOne({ key, status: true}).lean()
        return objKey
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    findById  
}