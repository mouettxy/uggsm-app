"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSubscriptionRouter = void 0;
const controllers_1 = require("../controllers");
const BaseRouter_1 = __importDefault(require("./heplers/BaseRouter"));
class EmailSubscriptionRouter extends BaseRouter_1.default {
    constructor() {
        super(controllers_1.EmailSubscriptionController, '/email-subscriptions');
    }
    initializeRoutes() {
        this.expressRouter
            .get(`${this.basePath}`, this.controller.getAll)
            .post(`${this.basePath}`, this.controller.create)
            .delete(`${this.basePath}/:id`, this.controller.delete);
    }
}
exports.EmailSubscriptionRouter = EmailSubscriptionRouter;
