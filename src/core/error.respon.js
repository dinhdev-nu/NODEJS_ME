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
const reasonPhrases = require('../utils/reasonPhrases')

class ErrorResponse extends Error {
    constructor(message, status){
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT){
        super(message, statusCode)
    }  
}

class BadRequestError extends ErrorResponse{
    constructor(message = ReasonStatusCode.FORBIDENT, statusCode = StatusCode.FORBIDENT){
        super(message, statusCode)
    }  
}
class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED){
        super(message, statusCode)
    }
}
class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND){
        super(message, statusCode)
    }
}
class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN){
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError, 
    NotFoundError,
    ForbiddenError
}