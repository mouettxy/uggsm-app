"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrongCredentialsException = void 0;
const HttpException_1 = require("./HttpException");
class WrongCredentialsException extends HttpException_1.HttpException {
    constructor() {
        super(401, 'Неверные логин или пароль');
    }
}
exports.WrongCredentialsException = WrongCredentialsException;
