"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const ora_1 = __importDefault(require("ora"));
function log(scope, message, spinnerInstance) {
    if (!spinnerInstance) {
        console.log(`${scope.toUpperCase()} ${message}`);
        spinnerInstance = ora_1.default(`${scope.toUpperCase()} ${message}`).start();
    }
    else {
        spinnerInstance.stop();
        console.log(`${scope.toUpperCase()} ${message}`);
        spinnerInstance = ora_1.default(`${scope.toUpperCase()} ${message}`).start();
    }
}
exports.log = log;
