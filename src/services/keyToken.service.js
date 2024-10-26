'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    
    static createKeyToken = async ({userID, publicKey, privateKey }) => {
        try {
            //  LV 0
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
            const tokens = await keytokenModel.findByIdAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey :  null;
        } catch (error) {
            return error;
        }
    }

}

module.exports = KeyTokenService;