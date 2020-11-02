"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../../middlewares");
class BaseRouter {
    constructor(controller, basePath) {
        this.expressRouter = express_1.default.Router();
        this.basePath = '';
        this.controller = null;
        if (controller && basePath) {
            this.basePath = basePath;
            this.controller = new controller();
            this.expressRouter.all(`${this.basePath}*`, middlewares_1.authenticationMiddleware);
            this.initializeRoutes();
        }
        else {
            throw new Error('Controller not specified');
        }
    }
    initializeRoutes() {
        throw new Error('Routes not specified');
    }
}
exports.BaseRouter = BaseRouter;
exports.default = BaseRouter;
