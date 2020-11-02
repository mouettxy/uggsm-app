"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.CashModel = exports.Cash = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const utils_1 = require("../utils");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const _1 = require(".");
const mongoose_partial_search_1 = __importDefault(require("mongoose-partial-search"));
let Cash = class Cash {
    static getBalanceByOffice(officeCode) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let income = yield exports.CashModel.aggregate()
                .match({ office: officeCode })
                .group({ _id: null, sum: { $sum: '$income' } });
            let consumption = yield exports.CashModel.aggregate()
                .match({ office: officeCode })
                .group({ _id: null, sum: { $sum: '$consumption' } });
            income = ((_a = income[0]) === null || _a === void 0 ? void 0 : _a.sum) ? (_b = income[0]) === null || _b === void 0 ? void 0 : _b.sum : 0;
            consumption = ((_c = consumption[0]) === null || _c === void 0 ? void 0 : _c.sum) ? (_d = consumption[0]) === null || _d === void 0 ? void 0 : _d.sum : 0;
            if (typeof income === 'number' && typeof consumption === 'number') {
                // @ts-ignore
                income += this.income ? this.income : 0;
                // @ts-ignore
                consumption += this.consumption ? this.consumption : 0;
                return income - consumption;
            }
            return 0;
        });
    }
};
__decorate([
    typegoose_1.prop({ default: Date.now }),
    __metadata("design:type", Date)
], Cash.prototype, "createdAt", void 0);
__decorate([
    typegoose_1.prop({ autopopulate: true, ref: 'Office', required: true }),
    __metadata("design:type", Object)
], Cash.prototype, "office", void 0);
__decorate([
    typegoose_1.prop({ default: 0 }),
    __metadata("design:type", Number)
], Cash.prototype, "income", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], Cash.prototype, "orderid", void 0);
__decorate([
    typegoose_1.prop({ autopopulate: true, ref: 'Client' }),
    __metadata("design:type", Object)
], Cash.prototype, "client", void 0);
__decorate([
    typegoose_1.prop({ autopopulate: true, ref: 'User', required: true }),
    __metadata("design:type", Object)
], Cash.prototype, "cashier", void 0);
__decorate([
    typegoose_1.prop({ searchable: true }),
    __metadata("design:type", String)
], Cash.prototype, "comment", void 0);
__decorate([
    typegoose_1.prop({ default: 0 }),
    __metadata("design:type", Number)
], Cash.prototype, "consumption", void 0);
__decorate([
    typegoose_1.prop({ default: 0 }),
    __metadata("design:type", Number)
], Cash.prototype, "balance", void 0);
Cash = __decorate([
    typegoose_1.pre('save', function () {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.orderid && this.client) {
                if (!this.comment) {
                    const order = yield _1.OrderModel.findOne({ id: this.orderid });
                    const client = yield _1.ClientModel.findById(this.client);
                    this.comment = `Оплата по заказу #${this.orderid} (${order.phoneModel}) (Клиент: ${client.name})`;
                }
            }
            else if (this.orderid && !this.client) {
                const order = yield _1.OrderModel.findOne({ id: this.orderid });
                this.comment = `Оплата по заказу #${this.orderid} (${order.phoneModel})`;
            }
            else if (!this.orderid && this.client) {
                const client = yield _1.ClientModel.findById(this.client);
                this.comment = `Оплата (Клиент: ${client.name})`;
            }
            else if (!this.orderid && !this.client && !this.comment) {
                this.comment = 'Оплата';
            }
            let income = yield exports.CashModel.aggregate()
                .match({ office: this.office })
                .group({ _id: null, sum: { $sum: '$income' } });
            let consumption = yield exports.CashModel.aggregate()
                .match({ office: this.office })
                .group({ _id: null, sum: { $sum: '$consumption' } });
            income = ((_a = income[0]) === null || _a === void 0 ? void 0 : _a.sum) ? (_b = income[0]) === null || _b === void 0 ? void 0 : _b.sum : 0;
            consumption = ((_c = consumption[0]) === null || _c === void 0 ? void 0 : _c.sum) ? (_d = consumption[0]) === null || _d === void 0 ? void 0 : _d.sum : 0;
            if (typeof income === 'number' && typeof consumption === 'number') {
                // @ts-ignore
                income += this.income ? this.income : 0;
                // @ts-ignore
                consumption += this.consumption ? this.consumption : 0;
                this.balance = income - consumption;
            }
            else {
                this.balance = this.income;
            }
        });
    }),
    typegoose_1.plugin(mongoose_partial_search_1.default),
    typegoose_1.plugin(utils_1.AutoIncrement, {
        id: 'cash_id',
        inc_field: 'id',
    }),
    typegoose_1.plugin(mongoose_paginate_v2_1.default),
    typegoose_1.plugin(mongoose_autopopulate_1.default)
], Cash);
exports.Cash = Cash;
exports.CashModel = typegoose_1.getModelForClass(Cash);
