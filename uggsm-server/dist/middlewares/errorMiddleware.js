"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
function errorMiddleware(error, request, response, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response.status(status).send({
        status,
        message,
    });
}
exports.errorMiddleware = errorMiddleware;
