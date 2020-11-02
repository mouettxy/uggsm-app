"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validateOrder = __importStar(require("../middlewares/validators/validateOrder"));
class OrdersRouter {
    constructor() {
        this.expressRouter = express_1.default.Router();
        const orderController = new controllers_1.OrdersController();
        this.initializeRoutes(orderController);
    }
    initializeRoutes(controller) {
        const path = '/order';
        this.expressRouter
            .all(`${path}*`, middlewares_1.authenticationMiddleware)
            .get(path, controller.getAll)
            .get(`${path}/reports/report`, controller.generateReport)
            .get(`${path}/office/:code`, controller.getAllByOffice)
            .get(`${path}/paginate/`, controller.getAllWithParams)
            .get(`${path}/:id`, controller.getById)
            .post(path, validateOrder.order, controller.create)
            .post(`${path}/office/:code`, validateOrder.order, controller.createByOffice)
            .put(`${path}/:id/sms`, validateOrder.sms, controller.addSms)
            .put(`${path}/:id/completed-work`, validateOrder.completedWork, controller.addCompletedWork)
            .put(`${path}/:id/master-comment`, validateOrder.masterComment, controller.addMasterComment)
            .put(`${path}/:id/manager-comment`, validateOrder.managerComment, controller.addManagerComment)
            .put(`${path}/:id/workflow`, validateOrder.workflow, controller.addWorkflow)
            .put(`${path}/:id/status`, validateOrder.status, controller.setStatus)
            .put(`${path}/:id/payed`, validateOrder.payed, controller.setPayed)
            .put(`${path}/:id/master`, validateOrder.master, controller.setMaster)
            .put(`${path}/:id/manager`, validateOrder.manager, controller.setManager)
            .put(`${path}/:id/office`, validateOrder.office, controller.setOffice)
            .put(`${path}/:id`, controller.updateById)
            .delete(`${path}/:id`, controller.deleteById)
            .delete(`${path}/:id/completed-work/:workId`, controller.deleteCompletedWork);
    }
}
exports.OrdersRouter = OrdersRouter;
