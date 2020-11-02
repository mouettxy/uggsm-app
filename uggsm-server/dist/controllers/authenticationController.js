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
exports.AuthenticationController = void 0;
const server_1 = require("./../server");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const exceptions_1 = require("../exceptions");
const models_1 = require("../models");
class AuthenticationController {
    constructor() {
        this.user = models_1.UserModel;
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userData = req.body;
            if (yield this.user.findOne({ username: userData.username })) {
                next(new exceptions_1.UserWithThatUsernameAlreadyExistsException(userData.username));
            }
            else {
                try {
                    if (userData.masterPwd === process.env.REGISTER_USER_MASTER_PWD) {
                        const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
                        const office = yield models_1.OfficeModel.getOneByCode(userData.office);
                        if (!office) {
                            next(new exceptions_1.CannotFindOfficeException(userData.office));
                        }
                        userData.office = office._id;
                        userData.password = hashedPassword;
                        const user = yield this.user.create(Object.assign({}, userData));
                        user.set('password', undefined);
                        server_1.api.io.emit('created new user', user.credentials);
                        server_1.api.io.emit('update users');
                        res.send(user);
                    }
                    else {
                        next(new exceptions_1.HttpException(500, 'Master pwd incorrect'));
                    }
                }
                catch (error) {
                    next(new exceptions_1.HttpException(500, error.message));
                }
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const loginData = req.body;
            const user = yield this.user.findOne({ username: loginData.username });
            if (user) {
                const matchedPassword = yield bcrypt_1.default.compare(loginData.password, user.get('password'));
                if (matchedPassword) {
                    user.set('password', undefined);
                    const tokenData = AuthenticationController.createToken(user);
                    res.setHeader('Set-Cookie', [AuthenticationController.createCookie(tokenData)]);
                    res.send(user);
                }
                else {
                    next(new exceptions_1.WrongCredentialsException());
                }
            }
            else {
                next(new exceptions_1.WrongCredentialsException());
            }
        });
        this.logout = (request, response) => __awaiter(this, void 0, void 0, function* () {
            response.setHeader('Set-Cookie', 'Authorization=;Max-age=0');
            response.status(200).send({ status: 200, message: 'logout successfully' });
        });
    }
    static createToken(user) {
        const expiresIn = 60 * 60 * 24 * 7; // 7 days
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken = {
            _id: user.get('_id'),
        };
        return {
            expiresIn,
            token: jsonwebtoken_1.default.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
    static createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
}
exports.AuthenticationController = AuthenticationController;
