'use strict'

const  {Types}  = require("mongoose")
const keytokenModel = require("../models/keytoken.model")

class  KeyTokenService {
    
    static createKeyToken =  async ({userID, publicKey, privateKey, refreshToken }) => {
        try {
            // //  LV 0
            // const publicKeyString = publicKey.toString()
            // const tokens = await keytokenModel.create({
            //     user:userID,
            //     publicKey, //: publicKeyString
            //     privateKey,
            // })

            // return tokens ? tokens.publicKey : null;

            //  LV 1
            const filter = { user: userID}, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = { upsert: true, new: true}
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey :  null;
        } catch (error) {
            return error;
        }
    }

    static findByUserID = async (userID) =>{
        return await keytokenModel.findOne({ user: userID })
    }
    static removeTokenById = async (id) => {
        const result = await keytokenModel.deleteOne({_id: id})
        return result;
    }
    static findByRefreshTokenUsed = async (refreshToken) =>{
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne( {refreshToken})
    }
    static deleteKeyByID = async (userID) =>{
        return await keytokenModel.deleteOne({user: userID})
    }

}

module.exports = KeyTokenService;