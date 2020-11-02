"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectNotFoundException = void 0;
const HttpException_1 = require("./HttpException");
class ObjectNotFoundException extends HttpException_1.HttpException {
    constructor(modelName, id) {
        super(404, `Модель ${modelName} с ID ${id} не найдена`);
    }
}
exports.ObjectNotFoundException = ObjectNotFoundException;
