const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');

const app = express()

// middlwear
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())

app.get('/', (req, res) => {
    const message = "Hello World !!"

    res.status(200).json({
        mess: message
    })
})


module.exports = app;