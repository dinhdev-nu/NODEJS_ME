'use strict'

const mongoose = require("mongoose") 

const DOCUMENT_NAME = "Key"
const COLECTION_NAME = "Keys"

const keyTokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Shops'
    },
    publicKey:{
        type:String,
        require: true,
    },
    refreshToken:{
        type: Array,
        default: [],
    },
},{
    collection: COLECTION_NAME,
    timestamps: true,
})

module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema)