"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cash = void 0;
const helpers_1 = require("../../utils/helpers");
exports.cash = [...helpers_1.requiredFieldsHelper('office'), helpers_1.badRequestHelper()];
