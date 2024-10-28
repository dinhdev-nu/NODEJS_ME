'use strict'

const { OK, CREATED, SuccessResponse } = require("../core/succesd.respon");
const AccessServices = require("../services/access.services");


class AccessControllers {
    handleRefreshToken = async (req, res, next) =>{
        new SuccessResponse({
            message: 'Get Token Success!',
            metadata: await AccessServices.handleRefreshToken( req.body.refreshToken )
        }).send(res)
    }
    logout = async (req, res, next) =>{
        new SuccessResponse({
            message: 'Logout Success!',
            metadata: await AccessServices.loguot( req.keyStore )
        }).send(res)
    }
    login = async (req, res, next) =>{
        new SuccessResponse({
            metadata: await AccessServices.login(req.body)
        }).send(res)
    }
    
    signup = async(req, res, next) =>{
        // console.log(`[P]::signup::`, req.body)
        new CREATED({
            message: "Resgiserted OK !",
            metadata: await AccessServices.signup(req.body),
            options: {
                limit: 10
            }
        }).send(res)    
    }

}

module.exports = new AccessControllers();