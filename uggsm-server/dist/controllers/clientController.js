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
exports.ClientController = void 0;
const server_1 = require("./../server");
const helpers_1 = require("../utils/helpers");
const exceptions_1 = require("../exceptions");
const exceptions_2 = require("../exceptions");
const models_1 = require("../models");
class ClientController {
    constructor() {
        this.model = models_1.ClientModel;
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
        this.getPaginated = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const { query, options } = helpers_1.parsePaginateResponse(request.query, false, this.model);
            try {
                // @ts-ignore
                const clients = yield this.model.paginate(query, options);
                response.status(200);
                response.send(clients);
            }
            catch (error) {
                next(new exceptions_2.HttpException(500, error.message));
            }
        });
        this.getByName = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const name = request.params.name;
            yield this.model
                .findOne({ name })
                .then((user) => {
                response.status(200);
                response.send(user);
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
                .find({ code: code })
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
            const clientData = request.body;
            const createdClient = new this.model(Object.assign({}, clientData));
            yield createdClient
                .save()
                .then((savedOrder) => {
                response.status(200);
                server_1.api.io.emit('created client', savedOrder);
                server_1.api.io.emit('update clients');
                response.send(savedOrder);
            })
                .catch((err) => {
                next(new exceptions_2.HttpException(500, err.message));
            });
        });
        this.updateById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const clientData = request.body;
            yield this.model
                .findByIdAndUpdate(id, clientData, {
                new: true,
            })
                .then((updatedOrder) => {
                if (updatedOrder) {
                    response.status(200);
                    server_1.api.io.emit('updated client', updatedOrder);
                    server_1.api.io.emit('update clients');
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
                    server_1.api.io.emit('deleted client', id);
                    server_1.api.io.emit('update clients');
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
exports.ClientController = ClientController;
