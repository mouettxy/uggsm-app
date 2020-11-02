"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adversitement = void 0;
const helpers_1 = require("../../utils/helpers");
exports.adversitement = [...helpers_1.requiredFieldsHelper('name', 'title'), helpers_1.badRequestHelper()];
