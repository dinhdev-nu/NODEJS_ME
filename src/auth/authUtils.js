'use strict'
 
const jwt = require('jsonwebtoken')

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

module.exports = {
    createTokenPair
}