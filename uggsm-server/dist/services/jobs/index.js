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
const agenda_1 = __importDefault(require("agenda"));
const emailSubscriptionModel_1 = require("../../models/emailSubscriptionModel");
const lodash_1 = require("lodash");
const dailyOrdersReport_1 = require("../mail/dailyOrdersReport");
const { MONGO_USER, MONGO_PASSWORD, DB_CONNECTION_STRING, DB_SERVER } = process.env;
const DB_URL = `${DB_CONNECTION_STRING}${MONGO_USER}:${MONGO_PASSWORD}${DB_SERVER}?connectTimeoutMS=1000&bufferCommands=false&authSource=admin`;
const agenda = new agenda_1.default({ db: { address: DB_URL } });
agenda.define('send daily order reports', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptions = yield emailSubscriptionModel_1.EmailSubcriptionModel.find({ type: 'daily-report' });
    console.log('we here');
    if (subscriptions) {
        lodash_1.each(subscriptions, (e) => {
            console.log(e);
            dailyOrdersReport_1.sendDailyReport(e.email);
        });
    }
}));
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        // IIFE to give access to async/await
        yield agenda.start();
        yield agenda.every('00 20 * * *', 'send daily order reports');
    });
})();
