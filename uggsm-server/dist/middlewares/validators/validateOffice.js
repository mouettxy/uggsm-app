"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.office = void 0;
const helpers_1 = require("../../utils/helpers");
exports.office = [
    ...helpers_1.requiredFieldsHelper('code', 'name', 'address', 'ordersTemplate', 'docsTemplate'),
    helpers_1.badRequestHelper(),
];
