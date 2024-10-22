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


module.exports = app;