"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const helpers_1 = require("../../utils/helpers");
exports.user = [
    ...helpers_1.requiredFieldsHelper('username', 'password', 'credentials', 'office', 'role'),
    helpers_1.badRequestHelper(),
];
