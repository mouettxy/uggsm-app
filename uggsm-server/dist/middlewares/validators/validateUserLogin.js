"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = void 0;
const helpers_1 = require("../../utils/helpers");
exports.userLogin = [...helpers_1.requiredFieldsHelper('password', 'username'), helpers_1.badRequestHelper()];
