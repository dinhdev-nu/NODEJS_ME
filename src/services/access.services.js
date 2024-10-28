'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { ConflictRequestError, BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.respon")
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADIMIN: "ADMIN",
}
class AccessServices {

    static handleRefreshToken = async (refreshToken) => {
        // check token user...
        const foundTokenUsed = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        // nếu có người sư dụng lại
        if(foundTokenUsed){
            // decode xem ai dang su dung refreshToken
            const { userID, email } = await verifyJWT(refreshToken, foundTokenUsed.privateKey)
            console.log({ userID, email })
            // xóa tất cả token trong keyStore 
            await KeyTokenService.deleteKeyByID(userID)
            throw new ForbiddenError("Something Wrong Happend! Pls relogin ")
        }
        // nếu không...
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if(!holderToken)
            throw new AuthFailureError("Shop not registered!! ")
        const { userID, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        const foundShop = await findByEmail({email}) 
        if(!foundShop)
           throw new AuthFailureError("Shop not registered!! ")
        //create a new pair of Token
        const tokens = await createTokenPair({userID, email}, holderToken.publicKey, holderToken.privateKey)
        // update token
        holderToken.refreshToken = tokens.refreshToken
        holderToken.refreshTokensUsed.push(refreshToken)
        await holderToken.save()

        return {
            user: { userID, email },
            tokens,
        }
    }

    static loguot = async (keyStore) => {
        const delKey =  await KeyTokenService.removeTokenById(keyStore._id)
        console.log( {delKey})
        return delKey 
    }

    static login = async ({ email, password, refreshToken = null}) => {
        // step 1: check email
        const foundShop = await findByEmail({email})
        if(!foundShop)
            throw new BadRequestError("Error: Shop not registered")

        // step 2: match password
        const macth = bcrypt.compare( password, foundShop.password)  
        if(!macth)
            throw new AuthFailureError("Authentication error")

        // step 3 :create AT and RT and save: viet lai 2 lan thi sai ham...
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        
        // step4 : generate tokens
        const tokens = await createTokenPair({userID: foundShop._id, email}, publicKey, privateKey)
        await KeyTokenService.createKeyToken({
           refreshToken: tokens.refreshToken,
           privateKey, publicKey, userID: foundShop._id      
        })
        // step 5: getdata return login
        return {
            shop: getInfoData({fileds: ["_id", "name", "email"], object: foundShop}),
            tokens
        }
    }
     
    // Đăng kí tk mới...
    static signup = async ({ name, email, password }) => {
        // try {
            // Check tk đã có chưa...
            const holderShop = await shopModel.findOne({ email }).lean()
            if(holderShop)
                throw new BadRequestError("Error: Shop already registered!!!")

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
                // lv bình thường
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                console.log({ privateKey, publicKey})
                

                const keyStore = await KeyTokenService.createKeyToken({
                    userID: newShop._id,
                    publicKey, 
                    privateKey
                })

                if(!keyStore){
                    throw new BadRequestError("Error: KeyStore Erro!!!")
                }
                
                // Created a pair of token
                const tokens = await createTokenPair({userID: newShop._id, email}, publicKey, privateKey)
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fileds: ["_id", "name", "email"], object: newShop}),
                        tokens
                    }
                    
                }

            }
            // Trả về thông tin shop mới tạo và token (hoặc privateKey/publicKey)
            return {
                code: 200,
                metadata: null,
            }
    }
}

module.exports = AccessServices 