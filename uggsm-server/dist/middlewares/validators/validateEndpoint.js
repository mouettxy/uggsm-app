"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpoint = void 0;
exports.endpoint = (request, response) => {
    response.status(404).send({
        status: 404,
        message: `${request.method} на конечной точке ${request.url} не найден`,
    });
};
