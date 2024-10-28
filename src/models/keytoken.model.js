'use strict'

const mongoose = require("mongoose") 

const DOCUMENT_NAME = "Key"
const COLECTION_NAME = "Keys"


// Tạo Keys
const keyTokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shops'
    },
    privateKey:{
        type:String,
        required: true,
    },
    publicKey:{
        type:String,
        required: true,
    },
    refreshTokensUsed:{
        type: Array,
        default: [],
    },
    refreshToken:{
        type: String,
        required: true,
    },

},{
    collection: COLECTION_NAME,
    timestamps: true,
})

module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema)