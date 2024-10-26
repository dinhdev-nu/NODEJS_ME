'use strict'

const statusCodes = require('../utils/statusCodes')

const StatusCode = {
    FORBIDENT: 403,
    CONFLICT: 409
}
const ReasonStatusCode = {
    FORBIDENT: 'Bad request error',
    CONFLICT: 'Conflict error'
}
const{
    StatusCodes,
    ReasonPhrases
} = require('../utils/httpStatusCode')

class ErrorResponse extends Error {
    constructor(message, status){
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDENT){
        super(message, statusCode)
    }  
}

class BadRequestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDENT){
        super(message, statusCode)
    }  
}
class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED){
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError
}