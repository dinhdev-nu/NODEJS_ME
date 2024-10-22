'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADIMIN: "ADMIN",
}
class AccessServices {

    // Đăng kí tk mới...
    static signup = async ({ name, email, password }) => {
        try {

            // Check tk đã có chưa...
            const holderShop = await shopModel.findOne({ email }).lean()
            if(holderShop)
                return { 
                    code: "xxxx",
                    message: "Shop already registered!!!"
                }

            // Muốn tạo thì phải bảo mật: Mã hóa mật khẩu = bcrypt
            const passwordHash = await bcrypt.hash(password, 10)

            // Không có thì tạo...
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP]
            })

             // Tạo 1 token cho shop (TK đăng nhập)
            if(newShop){
                // Create privateKey(mk signToken), publicKey(mk verifyToken(xác thực))
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096, 
                    publicKeyEncoding: {
                        type: 'spki', // Định dạng cho public key
                        format: 'pem' // Xuất ra định dạng PEM (chuỗi)
                      },
                      privateKeyEncoding: {
                        type: 'pkcs8', // Định dạng cho private key
                        format: 'pem'  // Xuất ra định dạng PEM (chuỗi)
                      }
                })

                console.log({ privateKey, publicKey })

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userID: newShop._id,
                    publicKey
                })

                if(!publicKeyString){
                    return {
                        nameError: "xxx",
                         message: "publicKeyTring Error"
                    }
                }
                
                const publicKeyObject = crypto.createPublicKey( publicKeyString )
                // Created a pair of token
                const tokens = await createTokenPair({userID: newShop._id, email}, publicKeyString, privateKey)
                console.log(`Created Token Successfull:`, tokens)

                return {
                    code: 200,
                    metadata: {
                        shop: getInfoData({feilds: ["_id", "name", "email"], object: newShop}),
                        tokens
                    }
                }
            }

            // Trả về thông tin shop mới tạo và token (hoặc privateKey/publicKey)
            return {
                code: 200,
                metadata: null,
            }
            

            
        } catch (error) {
            return {
                nameError: "xxx",
                message: error.message,
                status: "error"
            }
        }
    }
}

module.exports = AccessServices 