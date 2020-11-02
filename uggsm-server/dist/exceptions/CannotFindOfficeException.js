"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotFindOfficeException = void 0;
const _1 = require("./");
class CannotFindOfficeException extends _1.HttpException {
    constructor(officeCode) {
        super(401, `Не удалось найти офис с кодом ${officeCode}`);
    }
}
exports.CannotFindOfficeException = CannotFindOfficeException;
