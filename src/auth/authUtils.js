'use strict'
 
const jwt = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/acsyncHandle')
const { AuthFailureError, NotFoundError } = require('../core/error.respon')
const { findByUserID } = require('../services/keyToken.service')
const { token } = require('morgan')

const HEADER = {
    API_KEY: 'x-api-key', // API key: key nay cap quyen
    CLIENT_ID: 'x-client-id', // id shop
    REFRESHTOKEN: 'x-rtoken-id',
    AUTHORIZATION: 'athorization' //  accessToken  cua login
}

// Tạo jwt token...
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {

        // Truy cập tài nguyên
        const acceessToken = jwt.sign(payload, publicKey, {
            expiresIn: "2 days"
        })

        // Lưu đăng nhập
        const refreshToken = jwt.sign(payload, privateKey, {
            expiresIn: "7 days"
        })

        // Xac minh Token...
        jwt.verify( acceessToken, publicKey, (err, decode) => {
            if(err)
                console.log(`Err Verify::`,err)
            else
                console.log(`Decode Verify::`,decode)
        })
        return { acceessToken, refreshToken}
         
    } catch (error) {
        
    }
}
const authenticationv1 = asyncHandler(async (req, res, next) => {
    const userID = req.headers[HEADER.CLIENT_ID]
    if(!userID)
        throw new AuthFailureError('Invalid request!!')
    //2 : get accesToken
    const keyStore = await findByUserID(userID)  
    if(!keyStore)
        throw new NotFoundError('Not Found KeyStore!!')
    //3: verifyToken
    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = jwt.verify(refreshToken, keyStore.privateKey)
            if(userID !== decodeUser.userID)
              throw new AuthFailureError('Invalid UserID!!')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }
    const acceessToken = req.headers[HEADER.AUTHORIZATION]
    if(!acceessToken)
        throw new AuthFailureError('Invalid request!!')
    try {
        const decodeUser = jwt.verify(acceessToken, keyStore.publicKey)

        //4: check user in dtb
        if(userID !== decodeUser.userID)
          throw new AuthFailureError('Invalid UserID!!')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
    
})

// const authentication = asyncHandler(async (req, res, next) => {
//     /*
//         5: check keyStore with this userID
//         6 : ok ALL => return(next)
//     */
//    // 1 : check userID missing
//     const userID = req.headers[HEADER.CLIENT_ID]
//     if(!userID)
//         throw new AuthFailureError('Invalid request!!')
//     //2 : get accesToken
//     const keyStore = await findByUserID(userID)
//     if(!keyStore)
//         throw new NotFoundError('Not Found KeyStore!!')
//     //3: verifyToken
//     const acceessToken = req.headers[HEADER.AUTHORIZATION]
//     if(!acceessToken)
//         throw new AuthFailureError('Invalid request!!')
//     try {
//         const decodeUser = jwt.verify(acceessToken, keyStore.publicKey)

//         //4: check user in dtb
//         if(userID !== decodeUser.userID)
//           throw new AuthFailureError('Invalid UserID!!')
//         req.keyStore = keyStore
//         return next()
//     } catch (error) {
//         throw error
//     }
    
// })

const verifyJWT = async ( token, keySecret) => {
    return await jwt.verify( token, keySecret)
}

module.exports = {
    createTokenPair,
    // authentication,
    authenticationv1,
    verifyJWT
}