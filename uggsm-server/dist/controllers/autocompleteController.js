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
exports.AutocompleteController = void 0;
const lodash_1 = require("lodash");
const exceptions_1 = require("../exceptions");
const models_1 = require("../models");
class AutocompleteController {
    constructor() {
        this.user = models_1.UserModel;
        this.order = models_1.OrderModel;
        this.client = models_1.ClientModel;
        this.customerName = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let search = req.query.search;
            if (!search) {
                search = '';
            }
            if (lodash_1.isString(search)) {
                try {
                    const response = yield this.client
                        .find({ name: new RegExp(search, 'i') })
                        .select('name')
                        .limit(10)
                        .lean();
                    const reduced = lodash_1.reduce(response, (a, e) => {
                        a.push({ text: e.name, value: e.name });
                        return a;
                    }, []);
                    res.status(200);
                    res.send(reduced);
                }
                catch (error) {
                    next(new exceptions_1.HttpException(500, 'Неопознанная ошибка при поиске'));
                }
            }
            else {
                next(new exceptions_1.HttpException(400, 'Нет данных для поиска'));
            }
        });
        this.customerPhone = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const search = req.query.search;
            if (lodash_1.isString(search)) {
                try {
                    const response = yield this.client.findOne({ name: search });
                    const reduced = lodash_1.reduce(response.phone, (a, e) => {
                        a.push({ text: e.phone, value: e.phone });
                        return a;
                    }, []);
                    res.status(200);
                    res.send(reduced);
                }
                catch (error) {
                    next(new exceptions_1.HttpException(500, 'Неопознанная ошибка при поиске'));
                }
            }
            else {
                next(new exceptions_1.HttpException(400, 'Нет данных для поиска'));
            }
        });
        this.phoneBrand = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let search = req.query.search;
            if (!search) {
                search = '';
            }
            if (lodash_1.isString(search)) {
                try {
                    const response = yield this.order
                        .aggregate([
                        { $match: { phoneBrand: new RegExp(search, 'i') } },
                        { $group: { _id: '$phoneBrand' } },
                        { $sample: { size: 10 } },
                    ])
                        .limit(10);
                    const reduced = lodash_1.reduce(response, (a, e) => {
                        a.push({ text: e._id, value: e._id });
                        return a;
                    }, []);
                    res.status(200);
                    res.send(reduced);
                }
                catch (error) {
                    next(new exceptions_1.HttpException(500, 'Неопознанная ошибка при поиске'));
                }
            }
            else {
                next(new exceptions_1.HttpException(400, 'Нет данных для поиска'));
            }
        });
        this.phoneModel = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let search = req.query.search;
            if (!search) {
                search = '';
            }
            if (lodash_1.isString(search)) {
                try {
                    const response = yield this.order.aggregate([
                        { $match: { phoneModel: new RegExp(search, 'i') } },
                        { $group: { _id: '$phoneModel' } },
                        { $sample: { size: 10 } },
                    ]);
                    const reduced = lodash_1.reduce(response, (a, e) => {
                        a.push({ text: e._id, value: e._id });
                        return a;
                    }, []);
                    res.status(200);
                    res.send(reduced);
                }
                catch (error) {
                    next(new exceptions_1.HttpException(500, 'Неопознанная ошибка при поиске'));
                }
            }
            else {
                next(new exceptions_1.HttpException(400, 'Нет данных для поиска'));
            }
        });
        this.declaredDefect = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let search = req.query.search;
            if (!search) {
                search = '';
            }
            if (lodash_1.isString(search)) {
                try {
                    const response = yield this.order
                        .aggregate([
                        { $match: { declaredDefect: new RegExp(search, 'i') } },
                        { $group: { _id: '$declaredDefect' } },
                        { $sample: { size: 10 } },
                    ])
                        .limit(10);
                    const reduced = lodash_1.reduce(response, (a, e) => {
                        a.push({ text: e._id, value: e._id });
                        return a;
                    }, []);
                    res.status(200);
                    res.send(reduced);
                }
                catch (error) {
                    next(new exceptions_1.HttpException(500, 'Неопознанная ошибка при поиске'));
                }
            }
            else {
                next(new exceptions_1.HttpException(400, 'Нет данных для поиска'));
            }
        });
        this.appearance = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let search = req.query.search;
            if (!search) {
                search = '';
            }
            if (lodash_1.isString(search)) {
                try {
                    const response = yield this.order
                        .aggregate([
                        { $match: { appearance: new RegExp(search, 'i') } },
                        { $group: { _id: '$appearance' } },
                        { $sample: { size: 10 } },
                    ])
                        .limit(10);
                    const reduced = lodash_1.reduce(response, (a, e) => {
                        a.push({ text: e._id, value: e._id });
                        return a;
                    }, []);
                    res.status(200);
                    res.send(reduced);
                }
                catch (error) {
                    next(new exceptions_1.HttpException(500, 'Неопознанная ошибка при поиске'));
                }
            }
            else {
                next(new exceptions_1.HttpException(400, 'Нет данных для поиска'));
            }
        });
        this.kit = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let search = req.query.search;
            if (!search) {
                search = '';
            }
            if (lodash_1.isString(search)) {
                try {
                    const response = yield this.order
                        .aggregate([
                        { $match: { kit: new RegExp(search, 'i') } },
                        { $group: { _id: '$kit' } },
                        { $sample: { size: 10 } },
                    ])
                        .limit(10);
                    const reduced = lodash_1.reduce(response, (a, e) => {
                        a.push({ text: e._id, value: e._id });
                        return a;
                    }, []);
                    res.status(200);
                    res.send(reduced);
                }
                catch (error) {
                    next(new exceptions_1.HttpException(500, 'Неопознанная ошибка при поиске'));
                }
            }
            else {
                next(new exceptions_1.HttpException(400, 'Нет данных для поиска'));
            }
        });
        this.completedWork = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let search = req.query.search;
            if (!search) {
                search = '';
            }
            if (lodash_1.isString(search)) {
                try {
                    const response = yield this.order.aggregate([
                        { $unwind: '$statusWork' },
                        { $match: { 'statusWork.header': new RegExp(search, 'i') } },
                        {
                            $group: {
                                _id: { header: '$statusWork.header', price: '$statusWork.price', message: '$statusWork.message' },
                            },
                        },
                        { $sample: { size: 10 } },
                    ]);
                    const reduced = lodash_1.reduce(
                    // @ts-ignore
                    response, (a, e) => {
                        a.push({ text: e._id.header, value: e._id });
                        return a;
                    }, []);
                    res.status(200);
                    res.send(reduced);
                }
                catch (error) {
                    next(new exceptions_1.HttpException(500, 'Неопознанная ошибка при поиске'));
                }
            }
            else {
                next(new exceptions_1.HttpException(400, 'Нет данных для поиска'));
            }
        });
        this.users = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let search = req.query.search;
            const returnValue = req.query['return-value'];
            if (!search) {
                search = '';
            }
            if (lodash_1.isString(search)) {
                try {
                    const response = yield this.user.find({ credentials: new RegExp(search, 'i') }).lean();
                    const returns = returnValue ? returnValue : '_id';
                    const reduced = lodash_1.reduce(response, (a, e) => {
                        a.push({ text: e.credentials, value: e[returns] });
                        return a;
                    }, []);
                    res.status(200);
                    res.send(reduced);
                }
                catch (error) {
                    next(new exceptions_1.HttpException(500, 'Неопознанная ошибка при поиске'));
                }
            }
            else {
                next(new exceptions_1.HttpException(400, 'Нет данных для поиска'));
            }
        });
        this.master = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let search = req.query.search;
            if (!search) {
                search = '';
            }
            if (lodash_1.isString(search)) {
                try {
                    const response = yield this.user
                        .find({ credentials: new RegExp(search, 'i'), role: { $in: ['master', 'manager', 'administrator'] } })
                        .select('_id credentials')
                        .lean();
                    const reduced = lodash_1.reduce(response, (a, e) => {
                        a.push({ text: e.credentials, value: e._id });
                        return a;
                    }, []);
                    res.status(200);
                    res.send(reduced);
                }
                catch (error) {
                    next(new exceptions_1.HttpException(500, 'Неопознанная ошибка при поиске'));
                }
            }
            else {
                next(new exceptions_1.HttpException(400, 'Нет данных для поиска'));
            }
        });
        this.manager = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let search = req.query.search;
            if (!search) {
                search = '';
            }
            if (lodash_1.isString(search)) {
                try {
                    const response = yield this.user
                        .find({ credentials: new RegExp(search, 'i'), role: { $in: ['manager', 'administrator'] } })
                        .select('_id credentials')
                        .lean();
                    const reduced = lodash_1.reduce(response, (a, e) => {
                        a.push({ text: e.credentials, value: e._id });
                        return a;
                    }, []);
                    res.status(200);
                    res.send(reduced);
                }
                catch (error) {
                    next(new exceptions_1.HttpException(500, 'Неопознанная ошибка при поиске'));
                }
            }
            else {
                next(new exceptions_1.HttpException(400, 'Нет данных для поиска'));
            }
        });
    }
}
exports.AutocompleteController = AutocompleteController;
