"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrongAuthenticationTokenException = void 0;
const HttpException_1 = require("./HttpException");
class WrongAuthenticationTokenException extends HttpException_1.HttpException {
    constructor() {
        super(401, 'Неверный токен аутентификации');
    }
}
exports.WrongAuthenticationTokenException = WrongAuthenticationTokenException;
