"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationTokenMissingException = void 0;
const HttpException_1 = require("./HttpException");
class AuthenticationTokenMissingException extends HttpException_1.HttpException {
    constructor() {
        super(401, 'Не удалось найти токен аутентификации');
    }
}
exports.AuthenticationTokenMissingException = AuthenticationTokenMissingException;
