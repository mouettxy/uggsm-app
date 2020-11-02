"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWithThatUsernameAlreadyExistsException = void 0;
const HttpException_1 = require("./HttpException");
class UserWithThatUsernameAlreadyExistsException extends HttpException_1.HttpException {
    constructor(username) {
        super(400, `Пользователь с логином ${username} уже существует`);
    }
}
exports.UserWithThatUsernameAlreadyExistsException = UserWithThatUsernameAlreadyExistsException;
