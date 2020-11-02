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
var Order_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = exports.Order = exports.Workflow = exports.Comment = exports.SmsMessage = exports.CompletedWork = void 0;
const _1 = require(".");
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const utils_1 = require("../utils");
const lodash_1 = require("lodash");
const clientModel_1 = require("./clientModel");
const helpers_1 = require("../utils/helpers");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const enums_1 = require("../utils/enums");
const mongoose_partial_search_1 = __importDefault(require("mongoose-partial-search"));
class CompletedWork {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], CompletedWork.prototype, "id", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], CompletedWork.prototype, "userid", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], CompletedWork.prototype, "username", void 0);
__decorate([
    typegoose_1.prop({ default: '' }),
    __metadata("design:type", String)
], CompletedWork.prototype, "credentials", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], CompletedWork.prototype, "header", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], CompletedWork.prototype, "message", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], CompletedWork.prototype, "price", void 0);
exports.CompletedWork = CompletedWork;
class SmsMessage {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], SmsMessage.prototype, "id", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], SmsMessage.prototype, "userid", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], SmsMessage.prototype, "username", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], SmsMessage.prototype, "header", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], SmsMessage.prototype, "message", void 0);
__decorate([
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], SmsMessage.prototype, "sended", void 0);
__decorate([
    typegoose_1.prop({ default: Date.now }),
    __metadata("design:type", Date)
], SmsMessage.prototype, "date", void 0);
exports.SmsMessage = SmsMessage;
class Comment {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], Comment.prototype, "userid", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Comment.prototype, "username", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Comment.prototype, "header", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Comment.prototype, "message", void 0);
__decorate([
    typegoose_1.prop({ default: Date.now }),
    __metadata("design:type", Date)
], Comment.prototype, "date", void 0);
exports.Comment = Comment;
class Workflow {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], Workflow.prototype, "id", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Workflow.prototype, "message", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Workflow.prototype, "username", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Workflow.prototype, "header", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], Workflow.prototype, "userid", void 0);
__decorate([
    typegoose_1.prop({ default: Date.now }),
    __metadata("design:type", Date)
], Workflow.prototype, "date", void 0);
exports.Workflow = Workflow;
let Order = Order_1 = class Order {
    static addHelper(target, arr, data, workFlowStart, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (target === 'array') {
                arr.push(helpers_1.extendArrayWithId(arr, data));
            }
            else if (target === 'workflow') {
                arr.push(helpers_1.extendArrayWithId(arr, yield helpers_1.processWorkflowData({
                    header: workFlowStart,
                    message: data === null || data === void 0 ? void 0 : data.message,
                    userid: userid ? userid : data.userid || null,
                })));
            }
        });
    }
    static setHelper(target, arr, header, comment, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (target === 'workflow') {
                const workflow = helpers_1.extendArrayWithId(arr, yield helpers_1.processWorkflowData({
                    header,
                    message: comment,
                    userid: userid,
                }));
                arr.push(workflow);
            }
            return arr;
        });
    }
    static addCompletedWork(id, work) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.findOne({ id });
            yield this.addHelper('array', order.statusWork, work);
            yield this.addHelper('workflow', order.workflow, work, 'Закрыта работа', work.createdBy);
            return yield order.save();
        });
    }
    static addSmsMessage(id, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.findOne({ id });
            yield this.addHelper('array', order.statusSms, message);
            yield this.addHelper('workflow', order.workflow, message, 'Новое сообщение');
            return yield order.save();
        });
    }
    static addMasterComment(id, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.findOne({ id });
            yield this.addHelper('array', order.masterComments, comment);
            yield this.addHelper('workflow', order.workflow, comment, 'Новый комментарий');
            return yield order.save();
        });
    }
    static addManagerComment(id, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.findOne({ id });
            yield this.addHelper('array', order.managerComments, comment);
            yield this.addHelper('workflow', order.workflow, comment, 'Новый комментарий');
            return yield order.save();
        });
    }
    static addWorkflow(id, workflow) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOneAndUpdate({ id }, { $push: { workflow } }).exec();
        });
    }
    static setStatus(id, status, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.findOne({ id });
            order.status = status;
            order.workflow = yield this.setHelper('workflow', order.workflow, 'Смена статуса заказа', `${status}`, userid);
            if (status === 'Закрыт' || status === 'Готов') {
                order.closedAt = new Date();
            }
            return yield order.save();
        });
    }
    static setPayed(id, payed, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.findOne({ id });
            const oldPayedStatus = order.payed ? 'Оплачено' : 'Не оплачено';
            order.payed = payed;
            order.workflow = yield this.setHelper('workflow', order.workflow, 'Смена статуса оплаты', `Изменён с "${oldPayedStatus}" на "${payed ? 'Оплачено' : 'Не оплачено'}"`, parseInt(userid));
            return yield order.save();
        });
    }
    static setMaster(id, master, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.findOne({ id });
            if (order.master) {
                const oldMaster = yield _1.UserModel.findById(order.master);
                const newMaster = yield _1.UserModel.findById(master);
                order.workflow = yield this.setHelper('workflow', order.workflow, 'Смена мастера', `Мастер изменён с "${oldMaster.credentials}" на "${newMaster.credentials}"`);
            }
            else {
                const newMaster = yield _1.UserModel.findById(master);
                order.workflow = yield yield this.setHelper('workflow', order.workflow, 'Назначен мастер', `${newMaster.credentials}`, parseInt(userid));
            }
            order.master = master;
            return yield order.save();
        });
    }
    static setManager(id, manager, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.findOne({ id });
            if (order.manager) {
                const oldManager = yield _1.UserModel.findById(order.manager);
                const newManager = yield _1.UserModel.findById(manager);
                order.workflow = yield this.setHelper('workflow', order.workflow, 'Смена менеджера', `Менеджер изменён с "${oldManager.credentials}" на "${newManager.credentials}"`, parseInt(userid));
            }
            else {
                const newManager = yield _1.UserModel.findById(manager);
                order.workflow = yield this.setHelper('workflow', order.workflow, 'Назначен менеджер', `${newManager.credentials}`, parseInt(userid));
            }
            order.manager = manager;
            return yield order.save();
        });
    }
    static setOffice(id, officeCode, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.findOne({ id });
            const office = yield _1.OfficeModel.getOneByCode(officeCode);
            order.office = office._id;
            order.workflow = yield this.setHelper('workflow', order.workflow, 'Изменение офиса', `Изменен офис на ${office.code}|${office.name}`, parseInt(userid));
            return yield order.save();
        });
    }
};
__decorate([
    typegoose_1.prop({ autopopulate: true, ref: 'Client' }),
    __metadata("design:type", Object)
], Order.prototype, "customer", void 0);
__decorate([
    typegoose_1.prop({ required: true, searchable: true }),
    __metadata("design:type", String)
], Order.prototype, "customerName", void 0);
__decorate([
    typegoose_1.prop({ required: true, searchable: true }),
    __metadata("design:type", String)
], Order.prototype, "customerPhone", void 0);
__decorate([
    typegoose_1.prop({ autopopulate: true, ref: 'Office' }),
    __metadata("design:type", Object)
], Order.prototype, "office", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Order.prototype, "officeCode", void 0);
__decorate([
    typegoose_1.prop({ default: 'Не указано', searchable: true }),
    __metadata("design:type", String)
], Order.prototype, "phoneBrand", void 0);
__decorate([
    typegoose_1.prop({ autopopulate: true, ref: 'User' }),
    __metadata("design:type", Object)
], Order.prototype, "manager", void 0);
__decorate([
    typegoose_1.prop({ autopopulate: true, ref: 'User' }),
    __metadata("design:type", Object)
], Order.prototype, "master", void 0);
__decorate([
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "quick", void 0);
__decorate([
    typegoose_1.prop({ default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "declaredPrice", void 0);
__decorate([
    typegoose_1.prop({ default: 'Нет модели', searchable: true }),
    __metadata("design:type", String)
], Order.prototype, "phoneModel", void 0);
__decorate([
    typegoose_1.prop({ default: 'Нет серийного номера', searchable: true }),
    __metadata("design:type", String)
], Order.prototype, "serialNumber", void 0);
__decorate([
    typegoose_1.prop({ default: 'Нет описания внешнего вида', searchable: true }),
    __metadata("design:type", String)
], Order.prototype, "appearance", void 0);
__decorate([
    typegoose_1.prop({ default: 'Платный' }),
    __metadata("design:type", String)
], Order.prototype, "orderType", void 0);
__decorate([
    typegoose_1.prop({ default: 'Нет дефекта', searchable: true }),
    __metadata("design:type", String)
], Order.prototype, "declaredDefect", void 0);
__decorate([
    typegoose_1.prop({ default: 'Нет дефекта', searchable: true }),
    __metadata("design:type", String)
], Order.prototype, "defect", void 0);
__decorate([
    typegoose_1.prop({ default: 'Нет комплектации', searchable: true }),
    __metadata("design:type", String)
], Order.prototype, "kit", void 0);
__decorate([
    typegoose_1.prop({ default: Date.now }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    typegoose_1.prop({ default: '-', searchable: true }),
    __metadata("design:type", String)
], Order.prototype, "password", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Date)
], Order.prototype, "estimatedCloseAt", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Date)
], Order.prototype, "closedAt", void 0);
__decorate([
    typegoose_1.prop({ autopopulate: true, ref: 'Adversitement' }),
    __metadata("design:type", Object)
], Order.prototype, "adversitement", void 0);
__decorate([
    typegoose_1.prop({ enum: enums_1.statuses }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "payed", void 0);
__decorate([
    typegoose_1.prop({ type: () => [CompletedWork], _id: false }),
    __metadata("design:type", Array)
], Order.prototype, "statusWork", void 0);
__decorate([
    typegoose_1.prop({ type: () => [SmsMessage], _id: false }),
    __metadata("design:type", Array)
], Order.prototype, "statusSms", void 0);
__decorate([
    typegoose_1.prop({ type: () => [Comment], _id: false }),
    __metadata("design:type", Array)
], Order.prototype, "masterComments", void 0);
__decorate([
    typegoose_1.prop({ type: () => [Comment], _id: false }),
    __metadata("design:type", Array)
], Order.prototype, "managerComments", void 0);
__decorate([
    typegoose_1.prop({ type: () => [Workflow], _id: false }),
    __metadata("design:type", Array)
], Order.prototype, "workflow", void 0);
Order = Order_1 = __decorate([
    typegoose_1.pre('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isNew) {
                if (!this.status) {
                    this.status = 'Новый';
                }
                this.workflow.push(helpers_1.extendArrayWithId(this.workflow, {
                    header: `Смена статуса заказа`,
                    userid: null,
                    message: `${this.status}`,
                }));
                // find client and if not exist - create if exist trying to add phone number
                if (this.customerName) {
                    const customer = yield clientModel_1.ClientModel.findOne({ name: this.customerName });
                    if (!customer) {
                        const newClient = yield clientModel_1.ClientModel.createByOrder(this.customerName, this.customerPhone);
                        this.customer = newClient._id;
                    }
                    else {
                        const isPhoneExists = !lodash_1.isEmpty(lodash_1.filter(customer.phone, { phone: this.customerPhone }));
                        if (!isPhoneExists) {
                            yield clientModel_1.ClientModel.addPhoneNumber(this.customerName, this.customerPhone, 'Добавлено при создании заявки');
                        }
                        this.customer = customer._id;
                    }
                    this.workflow.push(helpers_1.extendArrayWithId(this.workflow, {
                        header: `Назначен клиент`,
                        userid: null,
                        // @ts-ignore
                        message: `${this.customerName}`,
                    }));
                }
                const master = yield _1.UserModel.findById(this.master);
                this.workflow.push(helpers_1.extendArrayWithId(this.workflow, {
                    header: `Назначен мастер`,
                    userid: null,
                    message: `${master.credentials}`,
                }));
                const manager = yield _1.UserModel.findById(this.manager);
                this.workflow.push(helpers_1.extendArrayWithId(this.workflow, {
                    header: `Назначен менеджер`,
                    userid: null,
                    message: `${manager.credentials}`,
                }));
                if (/[^\d]/g.test(this.customerPhone)) {
                    this.customerPhone = this.customerPhone.replace(/[^\d]/g, '').slice(1);
                }
                const office = yield _1.OfficeModel.findById(this.office);
                this.officeCode = office.code;
            }
        });
    }),
    typegoose_1.plugin(mongoose_partial_search_1.default),
    typegoose_1.plugin(mongoose_paginate_v2_1.default),
    typegoose_1.plugin(utils_1.AutoIncrement, {
        id: 'order_id',
        inc_field: 'id',
        reference_fields: ['officeCode'],
        disable_hooks: true,
    }),
    typegoose_1.plugin(mongoose_autopopulate_1.default)
], Order);
exports.Order = Order;
exports.OrderModel = typegoose_1.getModelForClass(Order);
