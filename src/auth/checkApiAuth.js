'use strict'

const { findById } = require("../services/apiKey.service")


const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'athorization'
}

const apiKey = async(req, res, next)  => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()

        if(!key){
            return res.status(403).json({
                message: 'Forbidden Error!!'
            })
        }

        //check objkey
        const objKeys = await findById(key)

        if(!objKeys){
            return res.status(403).json({
                message: 'Forbidden Error!!'
            })
        }
        req.objKey = objKeys
        return next()

    } catch (error) {
        
    }
}

const permission = ( permission ) =>{
    return (req, res, next) => {
        if(!req.objKey.permissions){
            return res.status(403).json({
                message: 'Permission denied!!'
            })
        }

        console.log('permission:: ', req.objKey.permissions)
        const ivalidPermission = req.objKey.permissions.includes(permission)
        if(!ivalidPermission){
            return res.status(403).json({
                message: 'Permission denied!!'
            })
        }
        return next()
    }
}

const asyuncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).cacth(next)
    }
}
module.exports = {
    apiKey,
    permission,
    asyuncHandler
}