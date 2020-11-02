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
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("./middlewares");
const endpointValidationMiddleware = __importStar(require("./middlewares/validators/validateEndpoint"));
const utils_1 = require("./utils");
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
class RestApi {
    constructor(router) {
        this.expressApp = express_1.default();
        this.io = null;
        this.server = null;
        utils_1.connectToDatabase();
        this.initializeSocketIO();
        this.initializeMiddlewares();
        this.initializeRouter(router);
        this.initializeErrorHandling();
    }
    initializeSocketIO() {
        const options = {};
        this.server = http_1.default.createServer(this.expressApp);
        this.io = socket_io_1.default(this.server, options);
    }
    listen() {
        this.server.listen(process.env.PORT);
        console.log('server listens on ' + process.env.PORT + ' port');
    }
    initializeRouter(routers) {
        routers.forEach((router) => {
            this.expressApp.use('/v1/', router.expressRouter);
        });
    }
    initializeMiddlewares() {
        this.expressApp.use(cors_1.default());
        this.expressApp.use(body_parser_1.default.json());
        this.expressApp.use(cookie_parser_1.default());
    }
    initializeErrorHandling() {
        this.expressApp.use(endpointValidationMiddleware.endpoint);
        this.expressApp.use(middlewares_1.errorMiddleware);
    }
}
exports.default = RestApi;
