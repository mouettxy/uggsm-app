"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutocompleteRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
class AutocompleteRouter {
    constructor() {
        this.expressRouter = express_1.default.Router();
        const autocompleteController = new controllers_1.AutocompleteController();
        this.initializeRoutes(autocompleteController);
    }
    initializeRoutes(controller) {
        const path = '/autocomplete';
        this.expressRouter
            .all(`${path}*`, middlewares_1.authenticationMiddleware)
            .get(`${path}/customer-name`, controller.customerName)
            .get(`${path}/customer-phone`, controller.customerPhone)
            .get(`${path}/phone-brand`, controller.phoneBrand)
            .get(`${path}/phone-model`, controller.phoneModel)
            .get(`${path}/declared-defect`, controller.declaredDefect)
            .get(`${path}/appearance`, controller.appearance)
            .get(`${path}/kit`, controller.kit)
            .get(`${path}/users`, controller.users)
            .get(`${path}/master`, controller.master)
            .get(`${path}/manager`, controller.manager)
            .get(`${path}/completed-work`, controller.completedWork);
    }
}
exports.AutocompleteRouter = AutocompleteRouter;
