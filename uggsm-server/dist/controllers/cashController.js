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
exports.CashController = void 0;
const server_1 = require("./../server");
const models_1 = require("../models");
const exceptions_1 = require("../exceptions");
const exceptions_2 = require("../exceptions");
const models_2 = require("../models");
const helpers_1 = require("../utils/helpers");
class CashController {
    constructor() {
        this.cash = models_1.CashModel;
        this.getAll = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            yield this.cash
                .find()
                .then((cash) => {
                response.status(200);
                response.send(cash);
            })
                .catch((err) => {
                next(new exceptions_2.HttpException(500, err.message));
            });
        });
        this.getBalance = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const office = request.params.office;
            yield this.cash
                .find({ office })
                .sort({
                id: 'desc',
            })
                .then((cash) => {
                response.status(200);
                response.send({ balance: cash[0].balance || 0 });
            })
                .catch((err) => {
                next(new exceptions_2.HttpException(500, err.message));
            });
        });
        this.getPaginated = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const { query, options } = helpers_1.parsePaginateResponse(request.query, true, this.cash);
            try {
                // @ts-ignore
                const cash = yield this.cash.paginate(query, options);
                response.status(200);
                response.send(cash);
            }
            catch (error) {
                next(new exceptions_2.HttpException(500, error.message));
            }
        });
        this.getAllByOffice = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const code = request.params.code;
            yield this.cash
                .find()
                .populate({
                path: 'office',
                match: {
                    code,
                },
            })
                .then((cash) => {
                response.status(200);
                cash = cash.filter(function (c) {
                    return c.office;
                });
                response.send(cash);
            })
                .catch((err) => {
                next(new exceptions_2.HttpException(500, err.message));
            });
        });
        this.getByOrder = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const orderid = Number(request.params.id);
            yield this.cash
                .find({ orderid })
                .then((cash) => {
                if (cash) {
                    response.status(200);
                    response.send(cash);
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.cash.modelName, String(orderid)));
                }
            })
                .catch(() => next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.')));
        });
        this.getById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            yield this.cash
                .findOne({ id })
                .then((cash) => {
                if (cash) {
                    response.status(200);
                    response.send(cash);
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.cash.modelName, id));
                }
            })
                .catch(() => next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.')));
        });
        this.createByOffice = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const cashData = request.body;
            const officeCode = request.params.code;
            try {
                const office = yield models_2.OfficeModel.getOneByCode(officeCode);
                if (!office) {
                    next(new exceptions_1.CannotFindOfficeException(officeCode));
                }
                const cash = new this.cash(Object.assign(Object.assign({}, cashData), { office: office._id }));
                const saved = yield cash.save();
                response.status(200);
                server_1.api.io.emit('created cash', saved);
                server_1.api.io.emit('update cashes');
                if (saved.orderid) {
                    server_1.api.io.emit('update order', saved.orderid);
                }
                response.send(saved);
            }
            catch (error) {
                next(new exceptions_2.HttpException(500, error.message));
            }
        });
        this.updateById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const cashData = request.body;
            yield this.cash
                .findOneAndUpdate({ id }, cashData, {
                new: true,
            })
                .then((updatedCash) => {
                if (updatedCash) {
                    response.status(200);
                    server_1.api.io.emit('updated cash', updatedCash);
                    server_1.api.io.emit('update cashes');
                    if (updatedCash.orderid) {
                        server_1.api.io.emit('update order', updatedCash.orderid);
                    }
                    response.send(updatedCash);
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.cash.modelName, id));
                }
            })
                .catch(() => {
                next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.'));
            });
        });
        this.deleteById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const cash = yield this.cash.findOne({ id });
            yield this.cash
                .findOneAndDelete({ id })
                .then((successResponse) => {
                if (successResponse) {
                    response.status(200);
                    server_1.api.io.emit('deleted cash', id);
                    server_1.api.io.emit('update cashes');
                    if (cash.orderid) {
                        server_1.api.io.emit('update order', cash.orderid);
                    }
                    response.json({
                        message: `Запись из кассы с ID ${id} была успешно удалена`,
                    });
                    response.send();
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.cash.modelName, id));
                }
            })
                .catch(() => {
                next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.'));
            });
        });
    }
}
exports.CashController = CashController;
