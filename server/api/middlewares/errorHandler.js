import {error} from "../../utils/logging"
const {CustomError} = require("../../utils/errors");
const errorService = require('../../services/error.service');

export function errorHandler(err, req, res, next) {
    let message, status;
    if (typeof (err) === 'string') {
        // custom application error
        status = 400
        message = "400" + err.message
    } else if (err.name === 'NoKeyInDB') {
        status = 500
        message = "Internal server error! Please contact admin."
    } else if (err.name === 'ValidationError') {
        // mongoose validation error
        status = 400
        message = "400" + err.message
    } else if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        status = 401
        message = 'Invalid Token or unknown URL'
    } else {
        // default to 500 server error
        status = 500
        message = err.message
    }
    error(err.message);

    const customErr = new CustomError(message, "EXCEPTION_SERVER")
    errorService.create(customErr)
        .then(() => {
            return res.status(status).json({message: message});
        })

}
