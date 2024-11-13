'use strict'

const redis = require("redis")
const { promisify } = require('util')
const { reservationInventory } = require("../models/repositories/inventory.repo")
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

// su ly khoa khi 1 user dat hang tim hang  vowis so luong
const acquireLock = async (producId, quantity, cartId) => {
    const key = `lock_v2023_${producId}`
    const retryTimes = 10
    const expireTimes = 3000 // 3s lock

    for (let i = 0; i < retryTimes; i++) {
       //  tao 1 key, ai co key thi vao thanh toan
        const result = await setnxAsync(key, expireTimes)
        console.log( 'result:: ',result)
        if(result === 1){
            // thao tac voi iventory
            const isResersvation = await reservationInventory({producId, quantity, cartId})
            if(isResersvation.modifiedCount){
                await pexpire(key, expireTimes)
                return key;
            }
            return null;
        } else {
            await new Promise( (resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async ( keyLock ) => {
    const deleteAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await deleteAsyncKey(keyLock)
}   

module.exports = {
    acquireLock, 
    releaseLock
}
