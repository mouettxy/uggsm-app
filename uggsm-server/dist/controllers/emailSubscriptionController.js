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
exports.EmailSubscriptionController = void 0;
const exceptions_1 = require("../exceptions");
const models_1 = require("../models");
const server_1 = require("../server");
class EmailSubscriptionController {
    constructor() {
        this.model = models_1.EmailSubcriptionModel;
        this.getAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.model.find();
                res.status(200);
                res.send(data);
            }
            catch (error) {
                next(new exceptions_1.HttpException(500, error.message));
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const request = req.body;
            try {
                let data = new this.model(Object.assign({}, request));
                data = yield data.save();
                res.status(200);
                server_1.api.io.emit('created email subscription', data);
                server_1.api.io.emit('update email subscriptions');
                res.send(data);
            }
            catch (error) {
                next(new exceptions_1.HttpException(500, error.message));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const isDeleted = yield this.model.findByIdAndDelete(id);
                if (isDeleted) {
                    res.status(200);
                    server_1.api.io.emit('deleted email subscription', isDeleted);
                    server_1.api.io.emit('update email subscriptions');
                    res.send(isDeleted);
                }
                else {
                    new exceptions_1.HttpException(422, 'Не удалось удалить подписку.');
                }
            }
            catch (error) {
                next(new exceptions_1.HttpException(500, error));
            }
        });
    }
}
exports.EmailSubscriptionController = EmailSubscriptionController;
