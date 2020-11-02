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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeModel = exports.Office = void 0;
const typegoose_1 = require("@typegoose/typegoose");
class Office {
    get ordersTemplateParsed() {
        const regExp = /(\d*)\{(\w*):(\d*)\}/g.exec(this.ordersTemplate);
        return {
            start: regExp[1],
            modifier: regExp[2],
            modifierCount: parseInt(regExp[3]),
        };
    }
    static getOneByCode(code) {
        return this.findOne({ code }).exec();
    }
}
__decorate([
    typegoose_1.prop({ required: true, unique: true }),
    __metadata("design:type", String)
], Office.prototype, "code", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Office.prototype, "name", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Office.prototype, "ordersTemplate", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Office.prototype, "docsTemplate", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Office.prototype, "address", void 0);
exports.Office = Office;
exports.OfficeModel = typegoose_1.getModelForClass(Office);
