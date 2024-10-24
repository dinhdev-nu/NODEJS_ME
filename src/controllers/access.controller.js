'use strict'

const AccessServices = require("../services/access.services");


class AccessControllers {

    async signup(req, res, next){
       try {
        console.log(`[P]::signup::`, req.body)
        return res.status(201).json(await AccessServices.signup(req.body))
       } catch (error) {
         next(error)
       } 
    }

}

module.exports = new AccessControllers();