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
exports.OfficeRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validateOffice = __importStar(require("../middlewares/validators/validateOffice"));
class OfficeRouter {
    constructor() {
        this.expressRouter = express_1.default.Router();
        const officeController = new controllers_1.OfficeController();
        this.initializeRoutes(officeController);
    }
    initializeRoutes(controller) {
        const path = '/office';
        this.expressRouter
            .all(`${path}*`, middlewares_1.authenticationMiddleware)
            .get(path, controller.getAll)
            .get(`${path}/:code`, controller.getByCode)
            .post(path, validateOffice.office, controller.create)
            .put(`${path}/:id`, validateOffice.office, controller.updateById)
            .delete(`${path}/:id`, controller.deleteById);
    }
}
exports.OfficeRouter = OfficeRouter;
