"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdversitementController = void 0;
const models_1 = require("../models");
const exceptions_1 = require("../exceptions");
const exceptions_2 = require("../exceptions");
class AdversitementController {
    constructor() {
        this.adversitement = models_1.AdversitementModel;
        this.getAll = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            yield this.adversitement
                .find()
                .then((adversitement) => {
                response.status(200);
                response.send(adversitement);
            })
                .catch((err) => {
                next(new exceptions_2.HttpException(500, err.message));
            });
        });
        this.getById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            yield this.adversitement
                .findOne({ id })
                .then((adversitement) => {
                if (adversitement) {
                    response.status(200);
                    response.send(adversitement);
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.adversitement.modelName, id));
                }
            })
                .catch(() => next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.')));
        });
        this.create = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const adversitementData = request.body;
            try {
                const adversitement = new this.adversitement(Object.assign({}, adversitementData));
                const saved = yield adversitement.save();
                response.status(200);
                response.send(saved);
            }
            catch (error) {
                next(new exceptions_2.HttpException(500, error.message));
            }
        });
        this.updateById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const adversitementData = request.body;
            yield this.adversitement
                .findOneAndUpdate({ id }, adversitementData, {
                new: true,
            })
                .then((updatedadversitement) => {
                if (updatedadversitement) {
                    response.status(200);
                    response.send(updatedadversitement);
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.adversitement.modelName, id));
                }
            })
                .catch(() => {
                next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.'));
            });
        });
        this.deleteById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            yield this.adversitement
                .findOneAndDelete({ id })
                .then((successResponse) => {
                if (successResponse) {
                    response.status(200);
                    response.json({
                        message: `Запись из кассы с ${id} была успешно удалена`,
                    });
                    response.send();
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.adversitement.modelName, id));
                }
            })
                .catch(() => {
                next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.'));
            });
        });
    }
}
exports.AdversitementController = AdversitementController;
