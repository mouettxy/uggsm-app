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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const server_1 = require("./../server");
const helpers_1 = require("../utils/helpers");
const exceptions_1 = require("../exceptions");
const exceptions_2 = require("../exceptions");
const models_1 = require("../models");
const lodash_1 = require("lodash");
const reports_1 = __importDefault(require("../services/reports"));
class OrdersController {
    constructor() {
        this.order = models_1.OrderModel;
        this.getAll = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            yield this.order
                .find({})
                .then((orders) => {
                response.status(200);
                response.send(orders);
            })
                .catch((err) => {
                next(new exceptions_2.HttpException(500, err.message));
            });
        });
        this.getAllByOffice = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const code = request.params.code;
            yield this.order
                .find()
                .populate({
                path: 'office',
                match: {
                    code,
                },
            })
                .then((orders) => {
                response.status(200);
                orders = orders.filter(function (order) {
                    return order.office;
                });
                response.send(orders);
            })
                .catch((err) => {
                next(new exceptions_2.HttpException(500, err.message));
            });
        });
        this.getAllWithParams = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const { query, options } = helpers_1.parsePaginateResponse(request.query, true, this.order);
            try {
                // @ts-ignore
                const orders = yield this.order.paginate(query, options);
                response.status(200);
                response.send(orders);
            }
            catch (error) {
                next(new exceptions_2.HttpException(500, error.message));
            }
        });
        this.getById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            yield this.order
                .findOne({ id })
                .then((order) => {
                if (order) {
                    response.status(200);
                    response.send(order);
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.order.modelName, id));
                }
            })
                .catch(() => next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.')));
        });
        this.create = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const orderData = request.body;
            const createdOrder = new this.order(Object.assign(Object.assign({}, orderData), { orderCreationDate: new Date() }));
            yield createdOrder
                .save()
                .then((savedOrder) => {
                response.status(200);
                server_1.api.io.emit('created order', savedOrder);
                response.send(savedOrder);
            })
                .catch((err) => {
                next(new exceptions_2.HttpException(500, err.message));
            });
        });
        this.addMasterComment = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield models_1.OrderModel.addMasterComment(request.params.id, request.body);
                if (order) {
                    response.status(200);
                    server_1.api.io.emit('added order masterComment', order.id);
                    server_1.api.io.emit('update order', order.id);
                    response.send(order);
                }
                else {
                    throw new Error('Не удалось обработать данные');
                }
            }
            catch (e) {
                next(new exceptions_2.HttpException(500, e.message));
            }
        });
        this.addManagerComment = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield models_1.OrderModel.addManagerComment(request.params.id, request.body);
                if (order) {
                    response.status(200);
                    server_1.api.io.emit('added order manager comment', order.id);
                    server_1.api.io.emit('update order', order.id);
                    response.send(order);
                }
                else {
                    throw new Error('Не удалось обработать данные');
                }
            }
            catch (e) {
                next(new exceptions_2.HttpException(500, e.message));
            }
        });
        this.addWorkflow = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield models_1.OrderModel.addWorkflow(request.params.id, request.body);
                if (order) {
                    response.status(200);
                    server_1.api.io.emit('added order workflow', order.id);
                    server_1.api.io.emit('update order', order.id);
                    response.send(order);
                }
                else {
                    throw new Error('Не удалось обработать данные');
                }
            }
            catch (e) {
                next(new exceptions_2.HttpException(500, e.message));
            }
        });
        this.setStatus = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield models_1.OrderModel.setStatus(request.params.id, request.body.status, request.body.userid);
                if (order) {
                    response.status(200);
                    server_1.api.io.emit('added order status', order.id);
                    server_1.api.io.emit('update order', order.id);
                    server_1.api.io.emit('update orders');
                    response.send(order);
                }
                else {
                    throw new Error('Не удалось обработать данные');
                }
            }
            catch (e) {
                next(new exceptions_2.HttpException(500, e.message));
            }
        });
        this.setPayed = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield models_1.OrderModel.setPayed(request.params.id, request.body.payed, request.body.userid);
                if (order) {
                    response.status(200);
                    server_1.api.io.emit('added order payed', order.id);
                    server_1.api.io.emit('update order', order.id);
                    server_1.api.io.emit('update orders');
                    response.send(order);
                }
                else {
                    throw new Error('Не удалось обработать данные');
                }
            }
            catch (e) {
                next(new exceptions_2.HttpException(500, e.message));
            }
        });
        this.setMaster = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield models_1.OrderModel.setMaster(request.params.id, request.body.master, request.body.userid);
                if (order) {
                    response.status(200);
                    server_1.api.io.emit('added order master', order.id);
                    server_1.api.io.emit('update order', order.id);
                    server_1.api.io.emit('update orders');
                    response.send(order);
                }
                else {
                    throw new Error('Не удалось обработать данные');
                }
            }
            catch (e) {
                next(new exceptions_2.HttpException(500, e.message));
            }
        });
        this.setManager = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield models_1.OrderModel.setManager(request.params.id, request.body.manager, request.body.userid);
                if (order) {
                    response.status(200);
                    server_1.api.io.emit('added order manager', order.id);
                    server_1.api.io.emit('update order', order.id);
                    server_1.api.io.emit('update orders');
                    response.send(order);
                }
                else {
                    throw new Error('Не удалось обработать данные');
                }
            }
            catch (e) {
                next(new exceptions_2.HttpException(500, e.message));
            }
        });
        this.setOffice = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield models_1.OrderModel.setOffice(request.params.id, request.body.office, request.body.userid);
                if (order) {
                    response.status(200);
                    server_1.api.io.emit('added order office', order.id);
                    server_1.api.io.emit('update order', order.id);
                    server_1.api.io.emit('update orders');
                    response.send(order);
                }
                else {
                    throw new Error('Не удалось обработать данные');
                }
            }
            catch (e) {
                next(new exceptions_2.HttpException(500, e.message));
            }
        });
        this.createByOffice = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const orderData = request.body;
            const officeCode = request.params.code;
            try {
                const office = yield models_1.OfficeModel.getOneByCode(officeCode);
                if (!office) {
                    next(new exceptions_1.CannotFindOfficeException(officeCode));
                }
                const order = new this.order(Object.assign(Object.assign({}, orderData), { office: office._id }));
                let saved = yield order.save();
                if (saved) {
                    // @ts-ignore
                    saved.setNext('order_id', (_err, doc) => __awaiter(this, void 0, void 0, function* () {
                        const id = helpers_1.generateOrderId(office.ordersTemplateParsed, doc.id);
                        doc.id = id;
                        saved = yield doc.save();
                        response.status(200);
                        server_1.api.io.emit('created order', saved);
                        server_1.api.io.emit('update orders');
                        response.send(saved);
                    }));
                }
                else {
                    next(new exceptions_2.HttpException(500, 'Ошибка валидации полей.'));
                }
            }
            catch (error) {
                next(new exceptions_2.HttpException(500, error.message));
            }
        });
        this.generateReport = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const params = request.query;
            try {
                const aggregated = yield reports_1.default(params, this.order);
                response.status(200);
                response.send(aggregated);
            }
            catch (e) {
                next(new exceptions_2.HttpException(500, e.message));
            }
        });
        this.updateById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const orderData = request.body;
            const order = yield this.order.findById(id);
            // @ts-ignore
            const oldMaster = order.master ? order.master._id : '';
            // @ts-ignore
            const oldManager = order.manager ? order.manager._id : '';
            if (oldMaster.toString() !== orderData.master) {
                const newMaster = orderData.master;
                yield this.order.setMaster(order.id, newMaster, orderData.userid);
            }
            if (oldManager.toString() !== orderData.manager) {
                const newManager = orderData.manager;
                yield this.order.setManager(order.id, newManager, orderData.userid);
            }
            delete orderData.master;
            delete orderData.manager;
            yield this.order
                .findByIdAndUpdate(id, orderData, {
                new: true,
            })
                .then((updatedOrder) => {
                if (updatedOrder) {
                    response.status(200);
                    server_1.api.io.emit('updated order', updatedOrder);
                    server_1.api.io.emit('update orders');
                    response.send(updatedOrder);
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.order.modelName, id));
                }
            })
                .catch((err) => {
                next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.'));
            });
        });
        this.deleteById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            yield this.order
                .findByIdAndDelete(id)
                .then((successResponse) => {
                if (successResponse) {
                    response.status(200);
                    server_1.api.io.emit('deleted order', id);
                    server_1.api.io.emit('update orders');
                    response.json({
                        message: `the order with id: ${id} was deleted successfully`,
                    });
                    response.send();
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.order.modelName, id));
                }
            })
                .catch(() => {
                next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.'));
            });
        });
    }
    addCompletedWork(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield models_1.OrderModel.addCompletedWork(request.params.id, request.body);
                if (order) {
                    response.status(200);
                    server_1.api.io.emit('added order completed work', order.id);
                    server_1.api.io.emit('update order', order.id);
                    server_1.api.io.emit('update orders');
                    response.send(order);
                }
                else {
                    throw new Error('Не удалось обработать данные');
                }
            }
            catch (e) {
                next(new exceptions_2.HttpException(500, e.message));
            }
        });
    }
    deleteCompletedWork(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield models_1.OrderModel.findOne({ id: request.params.id });
                const completedWorks = lodash_1.filter(order.statusWork, (e) => e.id != parseInt(request.params.workId));
                order.statusWork = completedWorks;
                yield order.save();
                if (order) {
                    response.status(200);
                    server_1.api.io.emit('deleted order completed work', order.id);
                    server_1.api.io.emit('update order', order.id);
                    server_1.api.io.emit('update orders');
                    response.send(order);
                }
                else {
                    throw new Error('Не удалось обработать данные');
                }
            }
            catch (e) {
                next(new exceptions_2.HttpException(500, e.message));
            }
        });
    }
    addSms(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield models_1.OrderModel.addSmsMessage(request.params.id, request.body);
                // TODO: sms sending through gate
                if (order) {
                    response.status(200);
                    server_1.api.io.emit('added order sms', order.id);
                    server_1.api.io.emit('update order', order.id);
                    response.send(order);
                }
                else {
                    throw new Error('Не удалось обработать данные');
                }
            }
            catch (e) {
                next(new exceptions_2.HttpException(500, e.message));
            }
        });
    }
}
exports.OrdersController = OrdersController;
