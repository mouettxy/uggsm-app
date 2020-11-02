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
exports.UsersController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const server_1 = require("../server");
const exceptions_1 = require("../exceptions");
const exceptions_2 = require("../exceptions");
const models_1 = require("../models");
class UsersController {
    constructor() {
        this.user = models_1.UserModel;
        this.getAll = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            yield this.user
                .find()
                .populate('office')
                .then((users) => {
                response.status(200);
                response.send(users);
            })
                .catch((error) => {
                next(new exceptions_2.HttpException(500, error.message));
            });
        });
        this.getById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            yield this.user
                .findById(id)
                .populate('office')
                .then((user) => {
                if (user) {
                    response.status(200);
                    response.send(user);
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.user.modelName, id));
                }
            })
                .catch(() => next(new exceptions_2.HttpException(422, 'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.')));
        });
        this.create = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const userData = request.body;
            const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
            const officeCode = userData.office;
            try {
                const office = yield models_1.OfficeModel.getOneByCode(officeCode);
                if (!office) {
                    next(new exceptions_1.CannotFindOfficeException(officeCode));
                }
                userData.office = office._id;
                const user = new this.user(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
                const savedUser = yield user.save();
                userData.password = undefined;
                response.status(200);
                server_1.api.io.emit('created new user', savedUser.credentials);
                server_1.api.io.emit('update users');
                response.send(savedUser);
            }
            catch (error) {
                next(new exceptions_2.HttpException(500, error.message));
            }
        });
        this.updateById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const userData = request.body;
            const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
            // @ts-ignore
            yield this.user.findOneAndUpdate(id, userData, { new: true }).then((user) => {
                if (user) {
                    const updatedUser = Object.assign(Object.assign({}, userData), { password: hashedPassword });
                    response.status(200);
                    server_1.api.io.emit('updated user', updatedUser);
                    server_1.api.io.emit('update user', updatedUser.id);
                    response.send(updatedUser);
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.user.modelName, id));
                }
            });
        });
        this.deleteById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            yield this.user.findByIdAndDelete(id).then((successResponse) => {
                if (successResponse) {
                    response.status(200);
                    server_1.api.io.emit('deleted user', id);
                    server_1.api.io.emit('update users');
                    server_1.api.io.emit('update user', id);
                    response.json({
                        message: `the user with id: ${id} was deleted successfully`,
                    });
                }
                else {
                    next(new exceptions_1.ObjectNotFoundException(this.user.modelName, id));
                }
            });
        });
    }
}
exports.UsersController = UsersController;
