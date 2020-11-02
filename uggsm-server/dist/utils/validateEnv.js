"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
require("dotenv/config");
const envalid_1 = require("envalid");
function validateEnv() {
    envalid_1.cleanEnv(process.env, {
        MONGO_USER: envalid_1.str(),
        MONGO_PASSWORD: envalid_1.str(),
        DB_CONNECTION_STRING: envalid_1.str(),
        DB_SERVER: envalid_1.str(),
        PORT: envalid_1.num(),
        JWT_SECRET: envalid_1.str(),
        REGISTER_USER_MASTER_PWD: envalid_1.str(),
    });
}
exports.validateEnv = validateEnv;
