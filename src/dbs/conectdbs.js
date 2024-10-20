'use strict'

const mongoose = require("mongoose");


const url = "mongodb://localhost:27017/shopDB";
class connectShopdb{
    constructor(){
        this.connect()
    }

    connect(type = "mongodb") {
        mongoose.connect(url, { maxPoolSize: 50 })
            .then(() => console.log("Connect DB Success!!"))
            .catch(() => console.log("Failue!!"))
    }

    static getInstance() {
        if(!connectShopdb.instance){
            connectShopdb.instance = new connectShopdb()
        }
        return connectShopdb.instance 
    }
}

const instanceMongodb = connectShopdb.getInstance()

module.exports = instanceMongodb

