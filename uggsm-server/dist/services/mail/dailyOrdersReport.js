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
exports.sendDailyReport = void 0;
const lodash_1 = require("lodash");
const email_templates_1 = __importDefault(require("email-templates"));
const path_1 = __importDefault(require("path"));
const reports_1 = __importDefault(require("../reports"));
const moment_1 = __importDefault(require("moment"));
const models_1 = require("../../models");
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendDailyReport(to) {
    return __awaiter(this, void 0, void 0, function* () {
        const report = yield reports_1.default({
            type: 'daily',
            date: [moment_1.default().startOf('day').toISOString(), moment_1.default().endOf('day').toISOString()],
        }, models_1.OrderModel);
        const transporter = nodemailer_1.default.createTransport({
            service: 'Yandex',
            auth: {
                user: 'daily@uggsm.ru',
                pass: 'rerlopxe1',
            },
        });
        const template = 'template';
        const opts = {
            message: {
                from: 'daily@uggsm.ru',
                to: to,
            },
            send: true,
            views: { root: __dirname },
            transport: transporter,
            juice: true,
            juiceResources: {
                applyStyleTags: true,
                preserveImportant: true,
                webResources: {
                    relativeTo: path_1.default.resolve('src/services/mail/template'),
                },
            },
            preview: false,
        };
        const locals = {
            newOrders: report.new,
            closedOrders: report.closed,
            totalNew: lodash_1.reduce(report.new, (a, e) => {
                a += e.ordersTotal;
                return a;
            }, 0),
            totalClosed: lodash_1.reduce(report.closed, (a, e) => {
                a += e.ordersTotal;
                return a;
            }, 0),
            totalWorks: lodash_1.reduce(report.closed, (a, e) => {
                a += e.cashSum;
                return a;
            }, 0),
            totalCash: lodash_1.reduce(report.closed, (a, e) => {
                a += e.worksSum;
                return a;
            }, 0),
        };
        //@ts-ignore
        const email = new email_templates_1.default(opts);
        //@ts-ignore
        return yield email.send({ template, locals });
    });
}
exports.sendDailyReport = sendDailyReport;
