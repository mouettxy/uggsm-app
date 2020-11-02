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
exports.OfficeController = void 0;
const server_1 = require("./../server");
const exceptions_1 = require("../exceptions");
const exceptions_2 = require("../exceptions");
const models_1 = require("../models");
class OfficeController {
    constructor() {
        this.model = models_1.OfficeModel;
        this.getAll = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            yield this.model
                .find({})
                .then((orders) => {
                response.status(200);
                response.send(orders);
            })
                .catch((err) => {
                next(new exceptions_2.HttpException(500, err.message));
            });
        });
        this.getById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            yield this.model
                .findById(id)
                .then((order) => {
                if (order) {
                    response.status(200);
                    response.send(order);
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.model.modelName, id));
                }
            })
                .catch(() => next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.')));
        });
        this.getByCode = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const code = request.params.code;
            yield this.model
                .findOne({ code: code })
                .then((order) => {
                if (order) {
                    response.status(200);
                    response.send(order);
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.model.modelName, code));
                }
            })
                .catch(() => next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.')));
        });
        this.create = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const officeData = request.body;
            if (officeData.masterPwd === process.env.REGISTER_USER_MASTER_PWD) {
                const createdOffice = new this.model(Object.assign({}, officeData));
                yield createdOffice
                    .save()
                    .then((savedOrder) => {
                    response.status(200);
                    server_1.api.io.emit('created office', savedOrder);
                    server_1.api.io.emit('update offices');
                    response.send(savedOrder);
                })
                    .catch((err) => {
                    next(new exceptions_2.HttpException(500, err.message));
                });
            }
            else {
                next(new exceptions_2.HttpException(500, 'Where master password?!'));
            }
        });
        this.updateById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const officeData = request.body;
            yield this.model
                .findByIdAndUpdate(id, officeData, {
                new: true,
            })
                .then((updatedOrder) => {
                if (updatedOrder) {
                    response.status(200);
                    server_1.api.io.emit('updated office', updatedOrder);
                    server_1.api.io.emit('update offices');
                    response.send(updatedOrder);
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.model.modelName, id));
                }
            })
                .catch(() => {
                next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.'));
            });
        });
        this.deleteById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            yield this.model
                .findByIdAndDelete(id)
                .then((successResponse) => {
                if (successResponse) {
                    response.status(200);
                    server_1.api.io.emit('deleted office', id);
                    server_1.api.io.emit('update offices');
                    response.json({
                        message: `Оффис с ${id} был успешно удалён`,
                    });
                    response.send();
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.model.modelName, id));
                }
            })
                .catch(() => {
                next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.'));
            });
        });
    }
}
exports.OfficeController = OfficeController;
