const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const countConnect = require('./helpers/check.connect');



const app = express()

// middlwear
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

// init db
require('./dbs/conectdbs');
countConnect()

app.use('', require('./router'))

//hanles error
app.use((req, res, next) => {
    const error = new Error('Not Found!!')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    const statusCode = error.status || 500 
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Intermal Server Error'

    })
})


module.exports = app;