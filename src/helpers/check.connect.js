'use strict'

const { default: mongoose } = require("mongoose")

const countConnect = async () => {
    const numConnection  = await mongoose.connections.length
    console.log(`Number of Connections:: ${numConnection}`)
}

module.exports = countConnect