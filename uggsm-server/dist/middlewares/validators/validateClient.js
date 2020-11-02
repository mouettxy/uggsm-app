"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const helpers_1 = require("../../utils/helpers");
exports.client = [...helpers_1.requiredFieldsHelper('name'), helpers_1.badRequestHelper()];
