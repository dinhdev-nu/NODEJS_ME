'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: "WRITE",
    EDITER: "EDITER",
    ADIN: "ADMIN",
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
            shopSchema.create({
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
                })

                console.log({ privateKey, publicKey })
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