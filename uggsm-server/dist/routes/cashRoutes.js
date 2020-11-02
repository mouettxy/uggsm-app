"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashRouter = void 0;
const express_1 = __importDefault(require("express"));
const cashController_1 = require("../controllers/cashController");
const middlewares_1 = require("../middlewares");
class CashRouter {
    constructor() {
        this.expressRouter = express_1.default.Router();
        const cashController = new cashController_1.CashController();
        this.initializeRoutes(cashController);
    }
    initializeRoutes(controller) {
        const path = '/cash';
        this.expressRouter
            .all(`${path}*`, middlewares_1.authenticationMiddleware)
            .get(path, controller.getAll)
            .get(`${path}/paginated`, controller.getPaginated)
            .get(`${path}/balance/:office`, controller.getBalance)
            .get(`${path}/:code`, controller.getAllByOffice)
            .get(`${path}/order/:id`, controller.getByOrder)
            .post(`${path}/:code`, controller.createByOffice)
            .put(`${path}/:id`, controller.updateById)
            .delete(`${path}/:id`, controller.deleteById);
    }
}
exports.CashRouter = CashRouter;
