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
var Client_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientModel = exports.Client = exports.ClientPhone = exports.clientTypes = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const utils_1 = require("../utils");
const helpers_1 = require("../utils/helpers");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const mongoose_partial_search_1 = __importDefault(require("mongoose-partial-search"));
exports.clientTypes = ['физ. лицо', 'компания'];
class ClientPhone {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], ClientPhone.prototype, "id", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], ClientPhone.prototype, "phone", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], ClientPhone.prototype, "comment", void 0);
exports.ClientPhone = ClientPhone;
let Client = Client_1 = class Client {
    static createByOrder(name, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const phoneObj = helpers_1.extendArrayWithId([], {
                phone,
                comment: 'Добавлено при создании заявки',
            });
            const client = new this({
                name,
            });
            client.phone.push(phoneObj);
            return yield client.save();
        });
    }
    static addPhoneNumber(name, phone, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.findOne({ name });
            client.phone.push(helpers_1.extendArrayWithId(client.phone, { phone, comment }));
            return yield client.save();
        });
    }
};
__decorate([
    typegoose_1.prop({ default: new Date() }),
    __metadata("design:type", Date)
], Client.prototype, "createdAt", void 0);
__decorate([
    typegoose_1.prop({ unique: true, required: true, searchable: true }),
    __metadata("design:type", String)
], Client.prototype, "name", void 0);
__decorate([
    typegoose_1.prop({ searchable: true }),
    __metadata("design:type", String)
], Client.prototype, "email", void 0);
__decorate([
    typegoose_1.prop({ autopopulate: true, ref: 'Adversitement' }),
    __metadata("design:type", Object)
], Client.prototype, "adversitement", void 0);
__decorate([
    typegoose_1.prop({ searchable: true }),
    __metadata("design:type", String)
], Client.prototype, "comment", void 0);
__decorate([
    typegoose_1.prop({ searchable: true }),
    __metadata("design:type", String)
], Client.prototype, "address", void 0);
__decorate([
    typegoose_1.prop({ default: 0 }),
    __metadata("design:type", Number)
], Client.prototype, "discount", void 0);
__decorate([
    typegoose_1.prop({ default: true }),
    __metadata("design:type", Boolean)
], Client.prototype, "allowedEmailNotifications", void 0);
__decorate([
    typegoose_1.prop({ default: true }),
    __metadata("design:type", Boolean)
], Client.prototype, "allowedNotifications", void 0);
__decorate([
    typegoose_1.prop({ default: 'физ. лицо', enum: exports.clientTypes, searchable: true }),
    __metadata("design:type", String)
], Client.prototype, "clientType", void 0);
__decorate([
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], Client.prototype, "isProvider", void 0);
__decorate([
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], Client.prototype, "isConflict", void 0);
__decorate([
    typegoose_1.prop({ type: () => [ClientPhone], _id: false }),
    __metadata("design:type", Array)
], Client.prototype, "phone", void 0);
Client = Client_1 = __decorate([
    typegoose_1.pre('save', function () {
        return __awaiter(this, void 0, void 0, function* () {
            // if (!this.adversitement) {
            //   // this.adversitement = (await AdversitementModel.findOne({ name: 'default' }))._id
            // }
        });
    }),
    typegoose_1.plugin(mongoose_paginate_v2_1.default),
    typegoose_1.plugin(utils_1.AutoIncrement, {
        id: 'client_id',
        inc_field: 'id',
    }),
    typegoose_1.plugin(mongoose_partial_search_1.default),
    typegoose_1.plugin(mongoose_autopopulate_1.default)
], Client);
exports.Client = Client;
exports.ClientModel = typegoose_1.getModelForClass(Client);
